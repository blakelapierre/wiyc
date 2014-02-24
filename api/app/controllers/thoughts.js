// controllers/thoughts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var log = require('winston');
log.info('controller: ThoughtsController');

var mongoose = require('mongoose');
var Thoughts = mongoose.model('Thoughts');
var Paginator = require('robcolbert-utils').expressjs.Paginator;

function ThoughtsController (app, config) {
  this.app = app;
  this.config = config;
}

ThoughtsController.prototype.list = function(req, res){
  console.debug('thoughts.list', req.route, req.query);
  var paginator = new Paginator(req);
  var query = Thoughts.find({ }, 'created thought', { 'sort': { 'created': -1 }});
  paginator.paginateQuery(query).exec(function (err, thoughts) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, thoughts);
  });
};

ThoughtsController.prototype.create = function (req, res) {
  console.debug('thoughts.create', req.route, req.query, req.body);
  var thought = new Thoughts(req.body);
  thought.save(function (err, newThought) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, newThought);
  });
};

ThoughtsController.prototype.get = function (req, res) {
  console.debug('thoughts.get', req.route, req.query);
  Thoughts.findById(req.route.params.id, function (err, thought) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, thought);
  });
};

ThoughtsController.prototype.update = function (req, res) {
  console.debug('thoughts.update', req.route, req.query, req.body);
  delete req.body._id;
  Thoughts.findOneAndUpdate(
    {'_id': req.route.params.id},
    req.body,
    function (thought) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      if (!thought) {
        log.error('thought not found', req.route.params.id);
        res.json(404, {'msg':'thought not found'});
        return;
      }
      res.json(200, thought);
    }
  );
};

ThoughtsController.prototype.delete = function (req, res) {
  console.debug('thoughts.delete', req.route, req.query);
  Thoughts.findOneAndRemove(
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

ThoughtsController.prototype.createComment = function (req, res) {
  console.debug('thoughts.createComment', req.route, req.query, req.body);
  Thoughts.findById(req.route.params.id, function (err, thought) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    thought.comments.push(req.body);
    thought.save(function (err, newThought) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      res.json(200, newThought);
    });
  });
};

ThoughtsController.prototype.getComments = function (req, res) {
  console.debug('thoughts.getComments', req.route, req.query);
  var paginator = new Paginator(req);
  var query = Thoughts.findById(req.route.params.id, 'comments').lean(true);
  paginator.paginateQuery(query).exec(function (err, thought) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, thought.comments);
  });
};

module.exports = exports = ThoughtsController;
