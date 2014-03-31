/*
 * FILE
 *  controllers/conversations.js
 *
 * PURPOSE
 *
 *
 * LICENSE
 *  Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to
 *  deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *  sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *  IN THE SOFTWARE.
 */

'use strict';

var log = require('winston');
log.info('controller: Conversations');

var mongoose = require('mongoose');
var Conversations = mongoose.model('Conversations');
var Paginator = require('pulsar-api-framework').expressjs.Paginator;

function ConversationsController (app, config) {
  this.app = app;
  this.config = config;
}

ConversationsController.prototype.create = function (req, res) {
  if (!this.app.checkAuthentication(req,res,'Only authenticated users can start new conversations')) {
    return false;
  }

  log.debug('conversations.create', req.body);
  delete req.body._id;
  req.body._creator = req.session.user._id;

  Conversations.create(
    req.body,
    function (err, conversation) {
      if (err) {
        log.error('conversations.create', err);
        res.json(500, err);
        return;
      }
      conversation.populate(
        {
          'path': '_creator',
          'select': '_id displayName'
        },
        function (err, populatedConversation) {
          if (err) {
            log.error('conversations.create.populate', err);
            res.json(500, err);
            return;
          }
          res.json(200, populatedConversation);
        }
      );
    }
  );
};

ConversationsController.prototype.list = function(req, res){
  log.debug('conversations.list', req.route, req.query);

  var query =
  Conversations
  .find({ }, '_creator created content', { 'sort': { 'created': -1 }})
  .lean(true);

  var paginator = new Paginator(req);
  paginator.paginateQuery(query)
  .populate('_creator', '_id displayName')
  .exec(function (err, conversations) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, conversations);
  });
};

ConversationsController.prototype.get = function (req, res) {
  log.debug('conversations.get', req.route, req.query);
  Conversations
  .findById(req.route.params.id)
  .lean(true)
  .populate('_creator', '_id displayName')
  .exec(function (err, conversation) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, conversation);
  });
};

ConversationsController.prototype.update = function (req, res) {
  log.debug('conversations.update', req.route, req.query, req.body);
  delete req.body._id;
  Conversations.findOneAndUpdate(
    {'_id': req.route.params.id},
    req.body,
    function (err, conversation) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      if (!conversation) {
        res.json(404, {'msg':'conversation not found'});
        return;
      }
      res.json(200, conversation);
    }
  );
};

ConversationsController.prototype.delete = function (req, res) {
  log.debug('conversations.delete', req.route, req.query);
  Conversations.findOneAndRemove(
    {'_id': req.route.params.id },
    function (err) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      res.json(200);
    }
  );
};

ConversationsController.prototype.createComment = function (req, res) {
  log.debug('conversations.createComment', req.route, req.query, req.body);
  Conversations
  .findById(req.route.params.id)
  .populate('_creator', '_id displayName')
  .exec(function (err, conversation) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    conversation.comments.push(req.body);
    conversation.save(function (err, commentedPulse) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      res.json(200, commentedPulse);
    });
  });
};

ConversationsController.prototype.getComments = function (req, res) {
  log.debug('thoughts.getComments', req.route, req.query);
  var paginator = new Paginator(req);
  var query =
  Conversations
  .findById(req.route.params.id, 'comments')
  .lean(true);

  paginator.paginateQuery(query)
  .populate('_creator', '_id displayName')
  .exec(function (err, thought) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, thought.comments);
  });
};

module.exports = exports = ConversationsController;
