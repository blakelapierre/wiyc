// controllers/pulses.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

var log = require('winston');
log.info('controller: PulsesController');

var mongoose = require('mongoose');
var Pulses = mongoose.model('Pulses');
var Paginator = require('pulsar-api-framework').expressjs.Paginator;

function PulsesController (app, config) {
  this.app = app;
  this.config = config;
}

PulsesController.prototype.create = function (req, res) {
  var self = this;

  if (!this.app.checkAuthentication(req, res, 'Only authenticated users can create pulses.')) {
    return;
  }
  log.info('pulses.create', req.session.user._id);

  if (req.body._id) {
    delete req.body._id;
  }
  req.body._creator = req.session.user._id;

  Pulses.create(req.body, function (err, newPulse) {
    if (self.app.checkError(err,res,'pulses.create')) {
      return;
    }
    newPulse.populate('_creator', function (err, populatedPulse) {
      if (self.app.checkError(err,res,'pulses.create')) {
        return;
      }
      res.json(200, populatedPulse);
    });
  });
};

PulsesController.prototype.list = function(req, res){
  var self = this;
  var options = {
    'status': 'published'
  };

  if (req.query.userId) {
    options._creator = req.query.userId;
  }
  if (req.query.status) {
    options.status = req.query.status;
  }
  log.info('pulses.list', options);

  var query = Pulses.find(options, '_creator created title content excerpt');
  var paginator = new Paginator(req);
  query = paginator.paginateQuery(query);

  query
  .sort({ 'created': -1 })
  .populate('_creator', '_id displayName')
  .exec(function (err, pulses) {
    if (self.app.checkError(err,res,'pulses.list')) {
      return;
    }
    Pulses.count(options, function (err, count) {
      options.pagination = {
        'page': paginator.page,
        'countPerPage': paginator.countPerPage,
        'totalPulses': count,
        // Nah - I think I'd like to keep it real. Clients can choose to not
        // keep it real (and format it). But, clients can't keep it real if
        // I've stripped away all this valid comedy:
        'totalPages': /*Math.ceil(*/count / paginator.countPerPage/*)*/
      };
      var response = {
        'options': options,
        'pulses': pulses
      };
      res.json(200, response);
    });
  });
};

PulsesController.prototype.get = function (req, res) {
  var self = this;

  log.info('pulses.get');

  Pulses
  .findById(req.route.params.pulseId)
  .lean(true)
  .populate('_creator', '_id displayName')
  .populate({
    'path':'interactions.comments._creator',
    'select': '_id displayName'
  })
  .exec(function (err, pulse) {
    if (self.app.checkError(err,res,'pulses.get')) {
      return;
    }
    if (!pulse) {
      res.json(404, {'msg':'pulse not found'});
      return;
    }
    res.json(200, pulse);
  });
};

PulsesController.prototype.update = function (req, res) {
  var self = this;

  if (!this.app.checkAuthentication(req, res, 'Pulses can only be updated by authenticated Pulsar users.')) {
    return;
  }
  log.info('pulses.update', req.session.user, req.route.params.pulseId);

  // In no way will the creator's userId be authoritaive when coming from the
  // client period and ever. This value was read from the database and stored
  // in memcache on trusted resources.
  req.body._creator = req.session.user._id;

  // In no way will meaningful information from a pulse be considered
  // authoritative when (potentially) coming from the client with respect to
  // subdocuments, comments, etc. These items are removed from input if they
  // are presented (again, ours is not the only client that *can* access this
  // server, and we're inviting the public to hit it (hard) (in the face) (on
  // purpose) (I can't afford Symantec penetration testing).

  delete req.body.created;
  delete req.body.interactions;

  // Slurp in the report from the db. We're ready to alter it.
  // Do NOT populate _creator as that would be a waste of db resources. It is
  // being overwritten and we're certainly not going past the userId as work
  // in this unit.

  Pulses.findById(req.route.params.pulseId, function (err, pulse) {
    if (self.app.checkError(err,res,'pulses.update')) {
      return;
    }
    if (!pulse) {
      res.json(404, {'message':'pulse not found'});
      return;
    }
    if (req.body.__v < pulse.__v) {
      res.json(403, {'message':'A newer version of this pulse already exists'});
      return;
    }

    // if the authenticated user on this session is NOT the author of this
    // document, then unlike on Maury Povich where the guy hears, "You are NOT
    // the father," our hacker does not get to celebrate and the document
    // doesn't have to run off stage with a camera crew following it.

    if (pulse._creator.toString() !== req.session.user._id.toString()) {
      res.json(403, { 'message':'Pulse update forbidden' });
      return; // we're done
    }

    // Update the authorized fields by directly copying them from the input.
    // @TODO: As ours is not the only client accessing Pulsar, some degree of
    // content filtering is going to be required here. A little testing is
    // needed, but some manner of filtering is going to be required here.

    pulse.visibility = req.body.visibility;
    pulse.status = req.body.status;
    pulse.title = req.body.title;
    pulse.excerpt = req.body.excerpt;
    pulse.content = req.body.content;
    pulse.increment();

    pulse.save(function (err, newPulse) {
      if (self.app.checkError(err,res,'pulses.update')) {
        return;
      }
      newPulse.populate('_creator', '_id displayName', function (err, populatedPulse) {
        if (self.app.checkError(err,res,'pulses.update')) {
          return;
        }
        res.json(200, populatedPulse);
      });
    });
  });
};

PulsesController.prototype.delete = function (req, res) {
  var self = this;

  if (!self.app.checkAuthentication(req, res, 'Pulses can only be deleted by authenticated Pulsar users.')) {
    return;
  }
  log.info('pulses.delete', req.session.user, req.route.params.pulseId);

  Pulses
  .findById(req.route.params.pulseId)
  .exec(function (err, pulse) {
    if (self.app.checkError(err,res,'pulses.delete')) {
      return;
    }
    if (!pulse) {
      res.json(404, {'message':'Pulse not found'});
      return;
    }
    if (pulse._creator.toString() !== req.session.user._id.toString()) {
      res.json(403, {'message':'you are not authorized to edit this pulse'});
      return;
    }
    pulse.remove(function (err) {
      if (self.app.checkError(err,res,'pulses.delete')) {
        return;
      }
      res.json(200, {'message':'Pulse deleted successfully'});
    });
  });
};

PulsesController.prototype.createComment = function (req, res) {
  var self = this;

  if (!self.app.checkAuthentication(req, res, 'Pulse comments can only be created by authenticated Pulsar users.')) {
    return;
  }
  log.info('pulses.createComment', req.route.params.pulseId);

  Pulses
  .findById(req.route.params.pulseId)
  .populate('_creator', '_id displayName')
  .exec(function (err, pulse) {
    if (self.app.checkError(err,res,'pulses.createComment')) {
      return;
    }
    if (!pulse) {
      res.json(404, {'msg':'pulse not found'});
      return;
    }

    req.body._creator = req.session.user._id;
    pulse.interactions.comments.push(req.body);
    pulse.save(function (err, newPulse) {
      if (self.app.checkError(err,res,'pulses.createComment')) {
        return;
      }
      var commentIdx = newPulse.interactions.comments.length - 1;
      newPulse.populate(
        {
          'path': 'interactions.comments._creator',
          'select': '_id displayName'
        },
        function (err, populatedPulse) {
          if (self.app.checkError(err,res,'pulses.createComment')) {
            return;
          }
          var comment = populatedPulse.interactions.comments[commentIdx];
          res.json(200, comment);
        }
      );
    });
  });
};

PulsesController.prototype.getComments = function (req, res) {
  var self = this;

  log.info('pulses.getComments', req.route, req.query);

  var paginator = new Paginator(req);
  var query =
  Pulses
  .findById(req.route.params.pulseId, 'comments')
  .lean(true);

  paginator.paginateQuery(query)
  .sort({'created': 1})
  .populate('_creator', '_id displayName')
  .exec(function (err, pulse) {
    if (self.app.checkError(err,res,'pulses.getComments')) {
      return;
    }
    res.json(200, pulse.interactions.comments);
  });
};

module.exports = exports = PulsesController;
