/*
 * FILE
 *  controllers/pulses.js
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
log.info('controller: PulsesController');

var mongoose = require('mongoose');
var Pulses = mongoose.model('Pulses');
var Paginator = require('robcolbert-utils').expressjs.Paginator;

function PulsesController (app, config) {
  this.app = app;
  this.config = config;
}

PulsesController.prototype.checkAuthentication = function (req, res, message) {
  if (!req.session.user || !req.session.authenticated.status) {
    log.error('pulses.checkAuthentication failed', req.session, message);
    res.json(500, { 'message': message });
    return false;
  }
  return true;
};

PulsesController.prototype.create = function (req, res) {
  log.debug('pulses.create', req.route, req.query, req.body);
  if (!this.checkAuthentication(req, res, 'Pulses can only be created by authenticated Pulsar users.')) {
    return;
  }

  req.body._creator = req.session.user._id;
  Pulses.create(req.body, function (err, newPulse) {
    if (err) {
      log.error(err);
      res.json(500, err);
      log.error('pulses.create error', err);
      return;
    }
    res.json(200, newPulse);
  });
};

PulsesController.prototype.list = function(req, res){
  log.debug('pulses.list', req.route, req.query);

  var query =
  Pulses
  .find({ }, '_creator created title content excerpt')
  .lean(false);

  var paginator = new Paginator(req);
  query = paginator.paginateQuery(query);

  query
  .sort({ 'created':-1 })
  .populate('_creator', '_id displayName')
  .exec(function (err, pulses) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }

    var response = {
      'totalPages':20,
      'pulses': pulses
    };

    res.json(200, response);
  });
};

PulsesController.prototype.get = function (req, res) {
  log.info('pulses.get', req.route, req.query);
  Pulses
  .findById(req.route.params.pulseId)
  .lean(true)
  .populate('_creator', '_id displayName')
  .populate({
    'path':'interactions.comments._creator',
    'select': '_id displayName'
  })
  .exec(function (err, pulse) {
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
  });
};

PulsesController.prototype.update = function (req, res) {
  log.debug('pulses.update', req.route, req.query, req.body);
  if (!this.checkAuthentication(req, res, 'Pulses can only be updated by authenticated Pulsar users.')) {
    return;
  }

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
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!pulse) {
      res.json(404, {'message':'pulse not found'});
      return;
    }
    if (req.body.__v < pulse.__v) {
      res.json(500, {'message':'A newer version of this pulse already exists'});
      return;
    }

    // if the authenticated user on this session is NOT the author of this
    // document, then unlike on Maury Povich where the guy hears, "You are NOT
    // the father," our hacker does not get to celebrate and the document
    // doesn't have to run off stage with a camera crew following it.

    if (pulse._creator.toString() !== req.session.user._id.toString()) {
      pulse.populate('_creator', '_id displayName', function (err, populatedPulse) {
        console.log('unauthorized pulse edit', populatedPulse._creator, req.session.user, err);
        res.json(403, { 'message':'you are not authorized to edit this pulse' });
      });
      return; // we're done
    }

    // Update the authorized fields by directly copying them from the input.
    // @TODO: As ours is not the only client accessing Pulsar, some degree of
    // content filtering is going to be required here. A little testing is
    // needed, but some manner of filtering is going to be required here.

    pulse.title = req.body.title;
    pulse.excerpt = req.body.excerpt;
    pulse.content = req.body.content;
    pulse.increment();

    pulse.save(function (err, newPulse) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      newPulse.populate('_creator', '_id displayName', function (err, populatedPulse) {
        if (err) {
          log.error(err);
          res.json(500, err);
          return;
        }
        res.json(200, populatedPulse);
      });
    });
  });
};

PulsesController.prototype.delete = function (req, res) {
  log.debug('pulses.delete', req.route, req.query);
  if (!this.checkAuthentication(req, res, 'Pulses can only be deleted by authenticated Pulsar users.')) {
    return;
  }

  Pulses.remove(req.body, function (err) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200);
  });
};

PulsesController.prototype.createComment = function (req, res) {
  log.debug('pulses.createComment', req.route, req.query, req.body);
  if (!this.checkAuthentication(req, res, 'Pulse comments can only be created by authenticated Pulsar users.')) {
    return;
  }

  Pulses.findById(req.route.params.pulseId)
  .populate('_creator', '_id displayName')
  .exec(function (err, pulse) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!pulse) {
      res.json(404, {'msg':'pulse not found'});
      return;
    }

    req.body._creator = req.session.user._id;
    pulse.interactions.comments.push(req.body);
    pulse.save(function (err, newPulse) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      var commentIdx = newPulse.interactions.comments.length - 1;
      newPulse.populate(
        {
          'path': 'interactions.comments._creator',
          'select': '_id displayName'
        },
        function (err, populatedPulse) {
          if (err) {
            log.error(err);
            res.json(500, err);
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
  log.debug('pulses.getComments', req.route, req.query);
  var paginator = new Paginator(req);
  var query =
  Pulses
  .findById(req.route.params.pulseId, 'comments')
  .lean(true);

  paginator.paginateQuery(query)
  .sort({'created': 1})
  .populate('_creator', '_id displayName')
  .exec(function (err, pulse) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, pulse.interactions.comments);
  });
};

module.exports = exports = PulsesController;
