// controllers/sessions.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

var log = require('winston');
log.info('controller: SessionsController');

var mongoose = require('mongoose');
var Users = mongoose.model('Users');

function SessionsController (app, config) {
  this.app = app;
  this.config = config;
}

SessionsController.prototype.create = function (req, res) {
  log.info('sessions.create', req.body);

  var email = req.body.email.toString().toLowerCase();
  var password = this.config.app.hashPassword(req.body.password);
  var failMsg = 'No user account matches the supplied email address and password.';

  Users
  .find({'email': email})
  .select({'emailVerifyKey': 0, 'messages': 0, 'friends': 0, 'ignored': 0})
  .exec(function (err, users) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }

    if (!users || (users.length !== 1)) {
      log.info('Sessions.create failed: No user account');
      res.json(404, { 'message': failMsg });
      return;
    }
    if (users[0].password !== password) {
      log.info('Sessions.create failed: Failed password', users[0].password, password);
      res.json(500, { 'message': failMsg });
      return;
    }

    req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
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
      req.session.user.isAdmin = (email === 'rob.isconnected@gmail.com');
      req.session.user.displayName = newUser.displayName;
      req.session.user.slug = newUser.slug;

      res.json(200, req.session);
    });
  });
};

SessionsController.prototype.get = function (req, res) {
  log.debug('sessions.getMySession', req.route);
  if (!req.session) {
    res.json(500, {'message':'no active session'});
    return;
  }
  res.json(200, req.session);
};

SessionsController.prototype.delete = function (req, res) {
  req.session.destroy();
  res.json(200, {'message':'authenticated session destroyed successfully'});
};

module.exports = exports = SessionsController;
