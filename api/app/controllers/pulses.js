// controllers/pulses.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var log = require('winston');
log.info('controller: PulsesController');

var mongoose = require('mongoose');
var Pulses = mongoose.model('Pulses');
var Paginator = require('robcolbert-utils').expressjs.Paginator;

function PulsesController (app, config) {
  this.app = app;
  this.config = config;
}

PulsesController.prototype.create = function (req, res) {
  log.info('pulses.create', req.route, req.query, req.body);
  if (!req.session.user || !req.session.authenticated.status) {
    log.error('Pulses.create called by unauthenticated client', req.session);
    res.json(
      500,
      {
        //@TODO: refactor this to a config file with internationalization
        'message':'Pulse transmission requires user authentication (non-negotiable).'
      }
    );
    return;
  }

  delete req.body._id;
  req.body._creator = req.session.user._id;
  Pulses.create(req.body, function (err, pulse) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, pulse);
  });
};

PulsesController.prototype.list = function(req, res){
  log.info('pulses.list', req.route, req.query);

  var query =
  Pulses
  .find({ }, '_creator created content', { 'sort': { 'created': -1 }})
  .lean(true);

  var paginator = new Paginator(req);
  paginator.paginateQuery(query)
  .populate('_creator', '_id displayName')
  .exec(function (err, pulses) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, pulses);
  });
};

PulsesController.prototype.get = function (req, res) {
  log.info('pulses.get', req.route, req.query);
  Pulses
  .findById(req.route.params.id)
  .lean(true)
  .populate('_creator', '_id displayName')
  .exec(function (err, pulse) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, pulse);
  });
};

PulsesController.prototype.update = function (req, res) {
  log.info('pulses.update', req.route, req.query, req.body);
  delete req.body._id;
  Pulses.findOneAndUpdate(
    {'_id': req.route.params.id},
    req.body,
    function (pulse) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      if (!pulse) {
        res.json(404, {'msg':'pulse not found'});
        return;
      }
      res.json(200, pulse);
    }
  );
};

PulsesController.prototype.delete = function (req, res) {
  log.debug('pulses.delete', req.route, req.query);
  Pulses.findOneAndRemove(
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

PulsesController.prototype.createComment = function (req, res) {
  log.debug('pulses.createComment', req.route, req.query, req.body);
  Pulses
  .findById(req.route.params.id)
  .populate('_creator', '_id displayName')
  .exec(function (err, pulse) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    pulse.comments.push(req.body);
    pulse.save(function (err, commentedPulse) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      res.json(200, commentedPulse);
    });
  });
};

PulsesController.prototype.getComments = function (req, res) {
  log.debug('thoughts.getComments', req.route, req.query);
  var paginator = new Paginator(req);
  var query =
  Pulses
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

module.exports = exports = PulsesController;
