// controllers/users.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// Licence: MIT

'use strict';

var log = require('winston');
log.info('++ controller: Users');

var fs = require('fs');
var crypto = require('crypto');
var mailer = require('nodemailer');

var mongoose = require('mongoose');

var Users = mongoose.model('Users');
var Paginator = require('puretech-foundation').Mongoose.Paginator;

function UsersController(app, config) {
  this.app = app;
  this.config = config;
}

UsersController.prototype.create = function (req, res) {
  var self = this;
  var verificationKey = this.config.app.generateRandomKey();

  log.debug('users.create', req.route, req.query, req.body);

  req.body.emailVerified = false; // nah - no shortcut on that.
  req.body.emailVerifyKey = verificationKey;
  req.body.password = this.config.app.hashPassword(req.body.password);

  Users.create(req.body, function (err, user) {
    if (err) {
      log.error(err);
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
    self.sendVerificationEmail({
      'user': user,
      'verificationKey': verificationKey,
      'subject': 'Welcome to Pulsar, please verify your email address.',
      'messageTemplate': 'app/templates/welcome-email.template'
    });
  });
};

UsersController.prototype.sendVerificationEmail = function (options) {
  var self = this;

  var profileLink =
    this.config.app.frontendUrl + '/#/user/' + options.user._id;

  var emailVerifyLink =
    this.config.app.frontendUrl + '/#/verify' +
    '?u=' + options.user._id + '&k=' + options.verificationKey;

  console.log('cwd', process.cwd());
  fs.readFile(options.messageTemplate, function (err, messageTemplate) {
    if (err) {
      log.error(err);
      return;
    }
    var messageBody = messageTemplate.toString()
      .replace('{{emailAddress}}', options.user.email)
      .replace('{{emailVerifyLink}}', emailVerifyLink)
      .replace('{{profileLink}}', profileLink);

    if (options.user.email === 'testuser@robcolbert.com') {
      log.info('skipping new user email for testuser@robcolbert.com');
      fs.writeFile('email-message.pulsar', messageBody);
      return;
    }
    self.sendEmail(options.user.email, options.subject, messageBody);
  });
};

UsersController.prototype.sendEmail = function (addressTo, subject, messageBody, callback) {
  log.info('EMAIL CONFIG SHIT', this.config);
  var transport = mailer.createTransport('SMTP', {
    'service': 'Gmail',
    'auth': {
      'user': this.config.app.emailUser,
      'pass': this.config.app.emailPassword
    }
  });
  var email = {
    'from': this.config.app.emailUser,
    'to': addressTo,
    'subject': subject,
    'body': messageBody
  };
  transport.sendMail(email, function (err, responseStatus) {
    log.info('sendmail', err, responseStatus);
    if (callback && (typeof callback === 'function')) {
      callback(err, responseStatus);
    }
  });
};

UsersController.prototype.get = function (req, res) {
  log.debug('users.get', req.route, req.query);
  var projection = {
    'password': 0,
    'emailVerifyKey': 0
  };
  Users.findById(req.route.params.userId, projection, function (err, user) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!user) {
      res.json(404, {
        'message': 'Requested user profile not found.',
        'errors': [{
          'name': 'User Not Found',
          'message': 'No user exists with the specified UserId.'
        }],
        'solutions': [{
          'name': 'Check URL',
          'message': 'If you typed the URL manually, please check it and try again. If you clicked a link, please let the site maintainer know they have a broken link.'
        }, {
          'name': 'Feel the Regret',
          'message': 'If you deleted your profile, maybe you shouldn\'t have? Just a thought.'
        }]
      });
      return;
    }
    res.json(200, user);
  });
};

UsersController.prototype.getMyProfile = function (req, res) {
  log.debug('users.getMyProfile');
  if (!req.session || !req.session.user) {
    res.json(500, {
      'msg': 'user session required'
    });
    return; // so get the fuck out
  }

  var projection = {
    'password': 0,
    'emailVerifyKey': 0
  };
  Users.findById(req.session.user._id, projection, function (err, user) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!user) {
      res.json(404, {
        'msg': 'user not found'
      });
      return;
    }
    res.json(200, user);
  });
};

UsersController.prototype.update = function (req, res) {
  var self = this;
  log.debug('users.update', req.route, req.query, req.body);

  var authMessage = 'Only authenticated users can update user profiles.';
  if (!self.app.checkAuthentication(req, res, authMessage)) {
    return;
  }

  if (req.body._id !== req.session.user._id) {
    res.json(403, {
      'message': 'Users can only update their own profiles.'
    });
    return;
  }

  Users.findById(req.session.user._id, function (err, user) {
    if (err) {
      log.error('users.update', err);
      res.json(500, err);
      return;
    }
    if (!user) {
      res.json(404, {
        'msg': 'user not found'
      });
      return;
    }

    if (req.body.hasOwnProperty('password')) {
      user.password = self.config.app.hashPassword(req.body.password);
    }
    if (req.body.hasOwnProperty('email') && (req.body.email !== user.email)) {
      user.emailVerified = false;
      user.email = req.body.email;
    }

    if (req.body.hasOwnProperty('displayName')) {
      user.displayName = req.body.displayName;
    }
    if (req.body.hasOwnProperty('tagline')) {
      user.tagline = req.body.tagline;
    }
    if (req.body.hasOwnProperty('about')) {
      user.about = req.body.about;
    }
    if (req.body.hasOwnProperty('website')) {
      user.website = req.body.website;
    }

    user.save(function (err, newUser) {
      if (self.app.checkError(err, res, 'users.requestPasswordReset')) {
        return;
      }
      res.json(200, newUser);
    });
  });
};

/*
 * Requests a password reset for the specified email address. Order of
 * operations:
 *
 * 1. Fetch user account for specified email address. If there is no matching
 *    user account for the given email address, an error is returned.
 *
 * 2. Mark account status as "reset-pending". This disallows all logins on the
 *    account until the password reset occurs.
 *
 * 3. An email is sent to the user containing a key and a link to claim that
 *    key with a form that allows a new password input.
 *
 * 4. If the service receives the generated key and a new password, the user's
 *    account is updated.
 */
UsersController.prototype.requestPasswordReset = function (req, res) {
  var self = this;
  log.debug('users.requestPasswordReset', req.route, req.query, req.body);

  if (!req.body.email) {
    res.json(
      403, {
        'message': 'Please provide the email address you used when creating your Pulsar profile.'
      }
    );
    return;
  }

  var email = req.body.email.toLowerCase();
  Users.findOne({
    'email': email
  }, function (err, user) {
    if (self.app.checkError(err, res, 'users.requestPasswordReset')) {
      return;
    }
    if (!user) {
      res.json(404, {
        'message': 'No user account with requested email address.'
      });
      return;
    }

    // generate the random password reset key using Node's cryptographically
    // secure source. It's still pseudorandom, but pulled from a higher quality
    // source.

    crypto.randomBytes(32, function (err, randomBytes) {
      if (err) {
        res.json(500, err);
        return;
      }

      user.passwordResetKey = new Buffer(randomBytes)
        .toString('base64');

      user.save(function (err, user) {
        if (self.app.checkError(err, res, 'users.requestPasswordReset')) {
          return;
        }
        res.json(200, user);

        // dash off an email to the user for them to use to actually reset
        // the password.

        // @TODO there's a lot of hard-coded here. Need to spend a day on config
        // again.
        var messageBody =
          'A password reset request was received for your Pulsar account. To ' +
          ' reset your password, please visit this URL:\n\n' +
          'http://robcolbert.com/#/execute-password-reset?token=' +
          encodeURIComponent(user.passwordResetKey) +
          '&email=' + encodeURIComponent(email) + '\n\n' +
          'If you did not intend to reset your password, simply ignore this ' +
          'email and no further action will be taken.';

        self.sendEmail(email, 'PULSAR Password Reset Request', messageBody);
      });
    });
  });
};

UsersController.prototype.executePasswordReset = function (req, res) {
  log.info('users.executePasswordReset', req.route, req.query, req.body);

  /* (Rjc) - 2014-04-24
   * The auth token, email address and desired password are only accepted from
   * the HTTP content body by design. This helps to prevent people from building
   * insecure clients.
   *
   * When they discover this comment searching for why URL parameters aren't
   * working, I hope they'll consider the security implications of adapting this
   * service to accept them (or at least ask). I will not accept patches
   * enabling the use of URL parameters for this service into Pulsar's core. No
   * plugin making an attempt to alter a user account using URL parameters will
   * be accepted into Pulsar's core.
   *
   * In Red Neck:
   * "Y'all can build and distribute whatever ya want, but the core of Pulsar
   * shall and will be kept maximally secure according to current best
   * practices."
   */

  if (!req.body.token) {
    res.json(
      403, {
        'message': 'Password reset requests must include an authentication token.'
      }
    );
    return;
  }
  if (!req.body.email) {
    res.json(
      500, {
        'message': 'Must specify user\'s email address'
      }
    );
    return;
  }
  if (!req.body.password) {
    res.json(
      500, {
        'message': 'Must specify new password to set for user account'
      }
    );
    return;
  }

  var email = req.body.email;
  var encodedPassword = this.config.app.hashPassword(req.body.password);

  Users.findOneAndUpdate({
      'email': email,
      'passwordResetKey': req.body.token
    }, {
      'password': encodedPassword,
      'passwordResetKey': null
    },
    function (err, user) {
      if (err) {
        log.error('users.executePasswordReset', err);
        res.json(500, err);
        return;
      }
      if (!user) {
        res.json(404, {
          'message': 'No user account found with that email address and ' +
            'outstanding password reset request token.'
        });
        return;
      }
      res.json(200, user);
    }
  );
};

UsersController.prototype.delete = function (req, res) {
  log.debug('users.delete', req.route, req.query);
  Users.findOneAndRemove({
      '_id': req.route.params.userId
    },
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

UsersController.prototype.verifyEmailKey = function (req, res) {
  log.debug('users.verifyEmailKey', req.route, req.query);
  Users.findById(req.route.params.userId, function (err, user) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }

    if (!user) {
      res.json(404, {
        'msg': 'invalid verification request'
      });
      return;
    }

    if (!req.query.k || (req.query.k !== user.emailVerifyKey)) {
      log.error('email address verification failed', req.query.k, user.emailVerifyKey);
      res.json(500, {
        'msg': 'email address verification has failed'
      });
      return;
    }

    user.emailVerified = true;
    user.emailVerifyKey = null;

    user.save(function (err, newUser) {
      res.json(200, newUser);
    });
  });
};

UsersController.prototype.list = function (req, res) {
  var paginator = new Paginator(req);
  var projection = {
    'password': 0, // security
    'email': 0, // security
    'emailVerifyKey': 0, // security
    'about': 0 // efficiency
  };
  var query = Users.find({}, projection, {
    'sort': {
      'displayName': 1
    }
  });
  log.debug('users.list', req.route, req.query);
  paginator.paginateQuery(query)
    .exec(function (err, users) {
      if (err) {
        log.error(err);
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
  log.debug('users.addFriend', req.route, req.query);

  Users.findById(req.route.params.userId, function (err, user) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!user) {
      res.json(404, {
        'msg': 'user not found'
      });
      return;
    }
    user.friends.push(req.body);
    user.save(function (err, newUser) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      res.json(200, newUser);
    });
  });
};

UsersController.prototype.removeFriend = function (req, res) {
  log.debug('users.addFriend', req.route, req.query);
  Users.findById(req.route.params.userId, function (err, user) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!user) {
      res.json(404, {
        'msg': 'user not found'
      });
      return;
    }
    user.friends.pull({
      '_id': req.route.params.friendId
    });
    user.save(function (err, newUser) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      res.json(200, newUser);
    });
  });
};

UsersController.prototype.listFriends = function (req, res) {
  log.debug('users.listFriends', req.route, req.query);
  Users.findById(req.route.params.userId, function (err, user) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!user) {
      res.json(404, {
        'msg': 'user not found'
      });
      return;
    }
    res.json(200, {
      'friends': user.friends
    });
  });
};

module.exports = exports = UsersController;
