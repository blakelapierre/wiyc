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

function ConversationsController (app, config) {
  this.app = app;
  this.config = config;
}

ConversationsController.prototype.create = function (req, res) {
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

ConversationsController.prototype.list = function(req, res){
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

ConversationsController.prototype.get = function (req, res) {
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

ConversationsController.prototype.update = function (req, res) {
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

ConversationsController.prototype.delete = function (req, res) {
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

    conversation.save(function (err, savedConversation) {
      if (self.app.checkError(err, res, 'pulswire.conversations.createMessage')) {
        return;
      }
      savedConversation.populate(conversationPopulateChain, function (err, populatedConversation) {
        if (self.app.checkError(err, res, 'pulswire.conversations.createMessage')) {
          return;
        }
        res.json(200, savedConversation);
      });
    });
  });
};

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

ConversationsController.prototype.getMessage = function (req, res) {
  var self = this;
  self.app.log.info('pulsewire.conversations.getMessage', req.route.params.conversationId, req.route.params.messageId);

  Conversations
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
