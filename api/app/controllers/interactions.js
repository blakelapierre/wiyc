// controllers/interactions.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

/*
   Implements a reusable controller fragment that can quickly and easily be mixed
   into any service implementation system-wide to instantly enable accounted
   interactions (comments and thumbs up/down) on any "document" (object)
   system-wide.

   Learn more:
   https://github.com/robcolbert/pulsarcms/wiki/Pulsar-API:-Interactions
*/

'use strict';

var log = require('winston');
log.info('++ controller: InteractionsController');

var Paginator = require('puretech-foundation').Mongoose.Paginator;

function InteractionsController (model, app, config) {
  this.model = model;
  this.app = app;
  this.config = config;
}

InteractionsController.prototype.mount = function (routes, baseUri) {
  routes.add({ 'method': 'POST', 'uri': baseUri + '/comments', 'controllerMethod': this.createComment.bind(this) });
  routes.add({ 'method': 'GET',  'uri': baseUri + '/comments', 'controllerMethod': this.getComments.bind(this) });
};

InteractionsController.prototype.createComment = function (req, res) {
  var self = this;

  if (!self.app.checkAuthentication(req, res, 'Comments can only be created by authenticated Pulsar users with valid accounts.')) {
    return;
  }

  log.info(self.model.modelName + '.createComment', req.route.params.objectId);

  this.model
  .findById(req.route.params.objectId)
  .populate('_creator', '_id displayName')
  .exec(function (err, contentObject) {
    if (self.app.checkError(err, res, self.model.modelName + '.createComment')) {
      return;
    }

    if (!contentObject) {
      res.json(404, {
        'message':'Comment failed: The requested Pulsar object no longer exists.'
      });
      return;
    }

    if (req.body._id) {
      delete req.body._id;
    }
    req.body._creator = req.session.user._id;

    contentObject.interactions.comments.push(req.body);
    contentObject.save(function (err, newObject) {
      if (self.app.checkError(err,res,self.model.modelName + '.createComment')) {
        return;
      }

      var commentIdx = newObject.interactions.comments.length - 1;
      newObject.populate(
        {
          'path': 'interactions.comments._creator',
          'select': '_id displayName'
        },
        function (err, populatedObject) {
          if (self.app.checkError(err,res,self.model.modelName + '.createComment')) {
            return;
          }
          var comment = populatedObject.interactions.comments[commentIdx];
          res.json(200, comment);
        }
      );
    });
  });
};

InteractionsController.prototype.getComments = function (req, res) {
  var self = this;

  log.info('pulses.getComments', req.route, req.query);

  var paginator = new Paginator(req);
  var query =
  this.model
  .findById(req.route.params.objectId, 'comments')
  .lean(true);

  paginator.paginateQuery(query)
  .sort({'created': 1})
  .populate('_creator', '_id displayName')
  .exec(function (err, contentObject) {
    if (self.app.checkError(err,res,self.model.modelName + '.getComments')) {
      return;
    }
    res.json(200, contentObject.interactions.comments);
  });
};

module.exports = exports = InteractionsController;
