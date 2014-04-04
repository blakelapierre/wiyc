/*
 * FILE
 *  controllers/users.js
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

var mongoose = require('mongoose');
var mailer = require('nodemailer');
var Users = mongoose.model('Users');
var Paginator = require('pulsar-api-framework').expressjs.Paginator;

function UsersController (app, config) {
  this.app = app;
  this.config = config;
}

UsersController.prototype.create = function (req, res) {
  var self = this;
  var verificationKey = this.config.app.generateRandomKey();
  
  self.app.log.debug('users.create', req.route, req.query, req.body);

  req.body.emailVerified = false; // nah - no shortcut on that.
  req.body.emailVerifyKey = verificationKey;
  req.body.password = this.config.app.hashPassword(req.body.password);

  Users.create(req.body, function (err, user) {
    if (err) {
      self.app.log.error(err);
      res.json(500, err);
      return;
    }

    req.session.user = {
      '_id': user._id,
      'created': user.created,
      'email': user.email,
      'displayName': user.displayName,
      'slug': user.slug
    };
    res.json(200, req.session); // dismiss the client.

    if (user.email === 'testuser@robcolbert.com') {
      self.app.log.info('skipping new user email for testuser@robcolbert.com');
      return;
    }

    //
    // send an email address verification email
    //

    var messageBody =
    'A user account was created on Pulsar using email address ' +
    req.session.user.email +
    '. To confirm, please visit this link:' +
    '\n\n' +
    'http://robcolbert.com/#/verify?u='+user._id+'&k=' + verificationKey +
    '\n\n' +
    'If you did not create a user account on Pulsar, no further action is ' +
    'required. Please ignore this message, and accept this apology for the ' +
    'inconvenience. We do what we can, but people do make mistakes/typos.' +
    '\n\n' +
    'If you verify your email address and continue to use Pulsar, your ' +
    'profile page will be located at the following URL:' +
    '\n\n' +
    'http://robcolbert.com/#/profile/' + user._id +
    '\n\n' +
    'Enjoy using Pulsar. It should be fine. Sure, there are going to be some ' +
    'growing pains here and there as with any other online service. But, ' +
    'overall, I think it\'ll be fine. If not, guess what we\'ll learn ' +
    'together? Let the fun begin...' +
    '\n\n' +
    'Best regards,\n' +
    '-Rob <rob.isConnected@gmail.com>';

    self.sendEmail(req.body.email, messageBody); // I don't want the callback

  });
};

UsersController.prototype.sendEmail = function (addressTo, messageBody, callback) {
  var self = this;
  self.app.log.info('EMAIL CONFIG SHIT', this.config);

  var transport = mailer.createTransport('SMTP', {
    'service':'Gmail',
    'auth': {
      'user':this.config.app.emailUser,
      'pass':this.config.app.emailPassword
    }
  });
  var email = {
    'from':'rob.isConnected@gmail.com',
    'to':addressTo,
    'subject':'Welcome to Pulsar, please verify your email address.',
    'body':messageBody
  };
  transport.sendMail(email, function (err, responseStatus) {
    self.app.log.info('sendmail', err, responseStatus);
    if (callback && (typeof callback === 'function')) {
      callback(err, responseStatus);
    }
  });
};

UsersController.prototype.get = function (req, res) {
  var self = this;
  self.app.log.debug('users.get', req.route, req.query);

  var projection = { 'password':0, 'emailVerifyKey':0 };
  Users.findById(req.route.params.userId, projection, function (err, user) {
    if (err) {
      self.app.log.error(err);
      res.json(500, err);
      return;
    }
    if (!user) {
      res.json(404, {'msg':'user not found'});
      return;
    }
    res.json(200, user);
  });
};

UsersController.prototype.getMyProfile = function (req, res) {
  var self = this;
  self.app.log.debug('users.getMyProfile');
  if (!req.session || !req.session.user) {
    res.json(500, {'msg':'user session required'});
    return; // so get the fuck out
  }

  var projection = { 'password':0, 'emailVerifyKey':0 };
  Users.findById(req.session.user._id, projection, function (err, user) {
    if (err) {
      self.app.log.error(err);
      res.json(500, err);
      return;
    }
    if (!user) {
      res.json(404, {'msg':'user not found'});
      return;
    }
    res.json(200, user);
  });
};

UsersController.prototype.update = function (req, res) {
  var self = this;
  self.app.log.debug('users.update', req.route, req.query, req.body);

  delete req.body._id;
  if (req.body.password) {
    req.body.password = self.config.app.hashPassword(req.body.password);
  }

  Users.findOneAndUpdate(
    {'_id': req.route.params.userId},
    req.body,
    function (err, user) {
      if (err) {
        self.app.log.error(err);
        res.json(500, err);
        return;
      }
      if (!user) {
        res.json(404, {'msg':'user not found'});
        return;
      }
      res.json(200, user);
    }
  );
};

UsersController.prototype.delete = function (req, res) {
  var self = this;
  self.app.log.debug('users.delete', req.route, req.query);

  Users.findOneAndRemove(
    {'_id': req.route.params.userId },
    function (err) {
      if (err) {
        self.app.log.error(err);
        res.json(500, err);
        return;
      }
      res.json(200);
    }
  );
};

UsersController.prototype.verifyEmailKey = function (req, res) {
  var self = this;

  Users.findById(req.route.params.userId, function (err, user) {
    if (err) {
      self.app.log.error(err);
      res.json(500, err);
      return;
    }

    if (!user) {
      res.json(404, {'msg':'invalid verification request'});
      return;
    }

    if (!req.query.k || (req.query.k !== user.emailVerifyKey)) {
      self.app.log.error('email address verification failed', req.query.k, user.emailVerifyKey);
      res.json(500, {'msg':'email address verification has failed'});
      return;
    }

    user.emailVerified = true;
    user.emailVerifyKey = null;

    user.save(function (err, newUser) {
      res.json(200, newUser);
    });
  });
};

UsersController.prototype.list = function(req, res){
  var self = this;
  self.app.log.debug('users.list', req.route, req.query);

  var paginator = new Paginator(req);
  var projection = { 'password':0, 'emailVerifyKey':0 };
  var query = Users.find({ }, projection, { 'sort': { 'displayName': 1 }});
  paginator.paginateQuery(query).exec(function (err, users) {
    if (err) {
      self.app.log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, users);
  });
};

//
// Feature-specific methods
//

UsersController.prototype.addFriend = function (req, res) {
  var self = this;
  self.app.log.debug('users.addFriend', req.route, req.query);

  Users.findById(req.route.params.userId, function (err, user) {
    if (err) {
      self.app.log.error(err);
      res.json(500, err);
      return;
    }
    if (!user) {
      res.json(404, {'msg':'user not found'});
      return;
    }
    user.friends.push(req.body);
    user.save(function (err, newUser) {
      if (err) {
        self.app.log.error(err);
        res.json(500, err);
        return;
      }
      res.json(200, newUser);
    });
  });
};

UsersController.prototype.removeFriend = function (req, res) {
  var self = this;
  self.app.log.debug('users.addFriend', req.route, req.query);

  Users.findById(req.route.params.userId, function (err, user) {
    if (err) {
      self.app.log.error(err);
      res.json(500, err);
      return;
    }
    if (!user) {
      res.json(404, {'msg':'user not found'});
      return;
    }
    user.friends.pull({'_id': req.route.params.friendId});
    user.save(function (err, newUser) {
      if (err) {
        self.app.log.error(err);
        res.json(500, err);
        return;
      }
      res.json(200, newUser);
    });
  });
};

UsersController.prototype.listFriends = function (req, res) {
  var self = this;
  self.app.log.debug('users.listFriends', req.route, req.query);
  Users.findById(req.route.params.userId, function (err, user) {
    if (err) {
      self.app.log.error(err);
      res.json(500, err);
      return;
    }
    if (!user) {
      res.json(404, {'msg':'user not found'});
      return;
    }
    res.json(200, {'friends': user.friends });
  });
};

module.exports = exports = UsersController;

