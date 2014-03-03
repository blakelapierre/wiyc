// controllers/sessions.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var log = require('winston');
log.info('controller: SessionsController');

var mongoose = require('mongoose');
var Users = mongoose.model('Users');

function SessionsController (app, config) {
  this.app = app;
  this.config = config;
}

SessionsController.prototype.create = function (req, res) {
  var failMsg = 'no account matches supplied email address and password.';

  log.info('sessions.create', req.body);
  req.body.password = this.config.app.hashPassword(req.body.password);

  var projection = {
    'messages': 0,
    'friends': 0,
    'ignored': 0
  };

  Users.find({'email': req.body.email}, projection, function (err, users) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }

    if (!users || (users.length !== 1)) {
      res.json(404, { 'msg': failMsg });
      return;
    }
    if (users[0].password !== req.body.password) {
      res.json(200, { 'msg': failMsg });
      return;
    }

    req.session.authenticated = {
      'status': true,
      'login': new Date()
    };
    req.session.user = { };

    users[0].loginCount++;
    users[0].lastLogin = new Date();
    users[0].save(function (err, newUser) {

      // Compose a basic user object to cache on the session cookie and
      // stay 100% stateless here with respect to having to knowing the
      // user. The session record itself is persisted only to Memcache,
      // the cookie sent to the user is SIGNED and this is just how I'm
      // choosing to mark a session on Pulsar at this time for a lot of
      // reasons.

      req.session.user._id = newUser._id;
      req.session.user.email = newUser.email;
      req.session.user.displayName = newUser.displayName;
      req.session.user.slug = newUser.slug;

      res.json(200, req.session);
    });
  });
};

SessionsController.prototype.get = function (req, res) {
  log.debug('sessions.getMySession', req.route);
  if (!req.session) {
    res.json(500, {'msg':'no active session'});
    return;
  }
  res.json(200, req.session);
};

module.exports = exports = SessionsController;
