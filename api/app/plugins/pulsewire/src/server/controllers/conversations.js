// controllers/conversations.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

var log = require('winston');
log.info('controller: Conversations');

var mongoose = require('mongoose');
var Conversations = mongoose.model('Conversations');
var Paginator = require('pulsar-api-framework').expressjs.Paginator;

var conversationPopulateChain = [
  {
    'path':'creator',
    'select':'_id displayName'
  },
  {
    'path':'members.user',
    'select':'_id displayName'
  },
  {
    'path':'messages.sender',
    'select':'_id displayName'
  }
];

function ConversationsController (plugin) {
  this.plugin = plugin;
  this.app = plugin.app;
  this.config = plugin.config;
}

ConversationsController.prototype.createConversation = function (req, res) {
  var self = this;
  if (!self.app.checkAuthentication(req,res,'Only authenticated users can start new conversations')) {
    return false;
  }
  log.debug('conversations.create', req.session.user._id);

  delete req.body._id;
  req.body.creator = req.session.user._id;
  req.body.members = [
    { // the authenticated user will be the first member (always)
      'user':req.session.user._id,
      'withHistory':true
    }
  ];

  Conversations.create(
    req.body,
    function (err, conversation) {
      if (self.app.checkError(err, res, 'pulsewire.conversations.create')) {
        return;
      }
      conversation.populate(
        conversationPopulateChain,
        function (err, populatedConversation) {
          if (self.app.checkError(err, res, 'pulsewire.conversations.create')) {
            return;
          }
          res.json(200, populatedConversation);
        }
      );
    }
  );
};

ConversationsController.prototype.listConversations = function(req, res){
  var self = this;
  log.debug('conversations.list', req.route, req.query);

  var query =
  Conversations
  .find({ }, null, { 'sort': { 'created': -1 }})
  .lean(true);

  var paginator = new Paginator(req);
  paginator.paginateQuery(query)
  .populate(conversationPopulateChain)
  .exec(function (err, conversations) {
    if (self.app.checkError(err, res, 'pulsewire.conversations.list')) {
      return;
    }
    res.json(200, conversations);
  });
};

ConversationsController.prototype.getConversation = function (req, res) {
  var self = this;
  log.info('conversations.get', req.route.params.conversationId);

  Conversations
  .findById(req.route.params.conversationId)
  .lean(true)
  .populate(conversationPopulateChain)
  .exec(function (err, conversation) {
    if (self.app.checkError(err, res, 'pulsewire.conversations.get')) {
      return;
    }
    if (!conversation) {
      res.json(404, {'message':'Conversation not found'});
      return;
    }
    res.json(200, conversation);
  });
};

/*
 * REST METHOD
 * updateConversation
 *
 * HANDLES
 * PUT    /pulsewire/conversations/:conversationId
 *
 * PURPOSE
 * Update the fields and data for a conversation. This is not the right way to
 * add messages and members to the conversation. There are separate methods for
 * those operations. This method is intended to be used solely to change the
 * topic or some aspect of the conversation exclusive of members and messages.
 */
ConversationsController.prototype.updateConversation = function (req, res) {
  var self = this;
  log.info('conversations.update', req.route.params.conversationId);

  if (!self.app.checkAuthentication(req,res,'Only authenticated users can update a conversation')) {
    return;
  }

  delete req.body._id;
  req.body.creator = req.session.user._id;

  Conversations
  .findById(req.route.params.conversationId)
  .lean(false)
  .populate(conversationPopulateChain)
  .exec(function (err, conversation) {
    if (self.app.checkError(err, res, 'pulsewire.conversations.update')) {
      return;
    }
    if (!conversation) {
      res.json(404, {'msg':'conversation not found'});
      return;
    }
    self.app.log.info('conversation.creator', conversation.creator);
    self.app.log.info('creator', conversation.creator, 'caller', req.session.user);
    if (conversation.creator._id.toString() !== req.session.user._id.toString()) {
      res.json(403, {'message':'Conversations can only be updated by their owner'});
      return;
    }
    conversation.subject = req.body.subject;
    conversation
    .save(function (err) {
      if (self.app.checkError(err, res, 'Failed to update conversation')) {
        return;
      }
      res.json(200, conversation);
    });
  });
};

/*
 * REST METHOD
 * deleteConversation
 *
 * HANDLES
 * DELETE /pulsewire/conversations/:conversationId
 *
 * PURPOSE
 * Physically removes the conversation from the database with a findOneAndRemove
 * call.
 *
 * NOTE
 * There are basically two camps in database design: Deleters and those who do
 * not delete. I'm a deleter. Because the alternative is an isDeleted or
 * currentStatus field. And, those have indexes. BIG indexes. They burn RAM,
 * have to be checked with nearly every query and add a level of general
 * pressure to a system that I try to avoid. Besides, this is always a tunable
 * operation.
 *
 * NOTE
 * MongoDB, to actually remove data, merely updates two pointers in a
 * doubly-linked list. That's it. There is no autocompaction, etc. It can and
 * will reuse the space on disk, but it does not perform anything beyond marking
 * the space as free and maintaining indexes.
 *
 * NOTE
 * Yes, maintaining indexes is slow in any database. MongoDB is no exception.
 * And, that's why I prefer to keep the data set small by physically removing
 * data when the user is done with it instead of having to constantly update
 * the relevant indexes *and* the record status/isDeleted concept.
 */
ConversationsController.prototype.deleteConversation = function (req, res) {
  log.debug('conversations.delete', req.route, req.query);
  Conversations.findOneAndRemove(
    {'_id': req.route.params.id },
    function (err) {
      if (self.app.checkError(err, res, 'pulsewire.conversations.delete')) {
        return;
      }
      res.json(200);
    }
  );
};

/*
 * REST METHOD
 *  createMessage
 *
 * HANDLES
 * POST   /pulsewire/conversations/:conversationId/messages
 *
 * PURPOSE
 *  Record the user's conversation message to the database and, if successful,
 *  forward to the main PulseWire controller to emit to conversation members as
 *  a notification.
 */
ConversationsController.prototype.createMessage = function (req, res) {
  var self = this;
  var idx;
  log.debug('pulsewire.conversations.createMessage', req.route.params.conversationId);

  if (!self.app.checkAuthentication(req,res,'Only authenticated users can create conversation messages')) {
    return;
  }

  req.body.sender = req.session.user._id;
  delete req.body.created;

  Conversations
  .findById(req.route.params.conversationId)
  .exec(function (err, conversation) {
    if (self.app.checkError(err, res, 'pulsewire.conversations.createMessage')) {
      return;
    }
    var isMember = false;
    for (idx = conversation.members.length; !isMember && (idx > 0); ) {
      --idx;
      self.app.log.info('member', idx, conversation.members[idx].user.toString());
      if (conversation.members[idx].user.toString() === req.session.user._id.toString()) {
        isMember = true;
      }
    }
    if (!isMember) {
      res.json(403, {'message':'Only members of a conversation can post messages to it'});
      return;
    }

    Conversations.findOneAndUpdate(
      {'_id':req.route.params.conversationId},
      {'$push': { 'messages': req.body } },
      {'select': 'messages members'}
    )
    .lean(true)
    .populate(conversationPopulateChain)
    .exec(function (err, updatedConversation) {
      if (self.app.checkError(err, res, 'pulsesire.conversations.createMessage')) {
        return;
      }

      /*
       * Grab the last message on the array that we just pushed.
       */
      var messageIdx = updatedConversation.messages.length - 1;
      var message = updatedConversation.messages[messageIdx];

      /*
       * Shoot it to the client (your message was sent successfully, and here's
       * those IDs and other results you need).
       */
      res.json(200, message);

      /*
       * Forward the message and needed conversation data to the PulseWire
       * plugin main controller to emit as a Conversations message.
       *
       * NOTE - We have the members list right here. It would be rude to ask the
       * plugin to go fetch it again. Grant access to the members field on the
       * populated conversation and users to save it a trip to the db to
       * retrieve this required information. No need to even traverse Memcache
       * or some other horrific design. Just politely hand it to it as a
       * fire-n-forget (I don't care if you get the real-time notification,
       * you'll get the message in the db as guaranteed above. Because we don't
       * *get* to this line of code without a successful MongoDB update and
       * populate.
       */
      self.plugin.emitConversationMessage({
        'conversationId': updatedConversation._id,
        'members': updatedConversation.members,
        'message': message
      });
    });
  });
};

/*
 * REST METHOD
 * listMessages
 *
 * HANDLES
 * GET    /pulsewire/conversations/:conversationId
 *
 * PURPOSE
 * Produce a paginated list of messages within a conversation accepting a page
 * number and count per page (cpp) value as query parameters.
 */
ConversationsController.prototype.listMessages = function (req, res) {
  var self = this;
  var paginator = new Paginator(req);

  var messageStartIdx = (paginator.page - 1) * paginator.countPerPage;
  var messageCount = paginator.countPerPage + 0;
  self.app.log.info('pulsewire.conversations.listMessages', messageStartIdx, messageCount);

  Conversations
  .find({'_id': req.route.params.conversationId })
  .slice('messages', [messageStartIdx, messageCount])
  .populate(conversationPopulateChain)
  .lean(true)
  .exec(function (err, messages) {
    if (self.app.checkError(err, res, 'pulsewire.conversations.listMessages')) {
      return;
    }
    res.json(200, messages);
  });
};

ConversationsController.prototype.getConversationMessage = function (req, res) {
  var self = this;
  self.app.log.info('pulsewire.conversations.getMessage', req.route.params.conversationId, req.route.params.messageId);

  Conversations // Relax. Yes, the field is indexed.
  .findOne({ 'messages._id': req.route.params.messageId }, {'messages.$': 1})
  .populate(conversationPopulateChain)
  .lean(true)
  .exec(function (err, conversation) {
    if (self.app.checkError(err, res, 'pulsewire.conversations.getMessage')) {
      return;
    }
    res.json(200, conversation.messages[0]);
  });
};

module.exports = exports = ConversationsController;
