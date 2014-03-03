// controllers/users.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var log = require('winston');
log.info('controller: UsersController');

var mongoose = require('mongoose');
var mailer = require('nodemailer');
var Users = mongoose.model('Users');
var Paginator = require('robcolbert-utils').expressjs.Paginator;

function UsersController (app, config) {
  this.app = app;
  this.config = config;
}

// How about: This function is the entire process of creating a new user.
//
// It's not exactly 'hello, world', but it sort of is compared to the
// shit I normally have to do to wire this up. Hell, I had enough time
// left over to write this casual-ass comment. Because the code is so
// easy to understand I don't have to be all anal retentive up here. We
// just chill and have a chat, you know?
//
// This method creates a new user record in the database. Uniqueness is
// on the user's email address sparesely. If that works, the method sends
// an email to the user to verify their email address. And, if that works,
// it writes a line to the log. Becasue this isn't fucking rocket science.
// You're not actually a space cowboy. It's a CRUD service with some basic
// features. When asked, it does its job. And, because it's so fucking simple,
// it's easier to keep safe.
//
UsersController.prototype.create = function (req, res) {
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
      'email': user.email,
      'displayName': user.displayName,
      'slug': user.slug
    };
    res.json(200, req.session); // dismiss the client.

    //
    // send an email address verification email
    //

    var transport = mailer.createTransport('SMTP', {
      'service':'Gmail',
      'auth': {
        'user':'rob.isConnected@gmail.com',
        'pass':'aC3-9b8cD?b3'
      }
    });

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

    var email = {
      'from':'rob.isConnected@gmail.com',
      'to':req.body.email,
      'subject':'Welcome to Pulsar, please verify your email address.',
      'body':messageBody
    };

    transport.sendMail(email, function (err, responseStatus) {
      log.info('sendMail response', err, responseStatus);
    });
  });
};

UsersController.prototype.get = function (req, res) {
  log.debug('users.get', req.route, req.query);
  var projection = { 'password':0, 'emailVerifyKey':0 };
  Users.findById(req.route.params.userId, projection, function (err, user) {
    if (err) {
      log.error(err);
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
  log.debug('users.getMyProfile');
  if (!req.session || !req.session.user) {
    res.json(500, {'msg':'user session required'});
    return; // so get the fuck out
  }

  var projection = { 'password':0, 'emailVerifyKey':0 };
  Users.findById(req.session.user._id, projection, function (err, user) {
    if (err) {
      log.error(err);
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
  log.debug('users.update', req.route, req.query, req.body);
  delete req.body._id;

  if (req.body.password) {
    req.body.password = this.config.app.hashPassword(req.body.password);
  }

  Users.findOneAndUpdate(
    {'_id': req.route.params.userId},
    req.body,
    function (err, user) {
      if (err) {
        log.error(err);
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
  log.debug('users.delete', req.route, req.query);
  Users.findOneAndRemove(
    {'_id': req.route.params.userId },
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
  Users.findById(req.route.params.userId, function (err, user) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }

    if (!user) {
      res.json(404, {'msg':'invalid verification request'});
      return;
    }

    if (!req.query.k || (req.query.k !== user.emailVerifyKey)) {
      log.error('email address verification failed', req.query.k, user.emailVerifyKey);
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
  log.debug('users.list', req.route, req.query);
  var paginator = new Paginator(req);
  var projection = { 'password':0, 'emailVerifyKey':0 };
  var query = Users.find({ }, projection, { 'sort': { 'displayName': 1 }});
  paginator.paginateQuery(query).exec(function (err, users) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, users);
  });
};

UsersController.prototype.addFriend = function (req, res) {
  log.debug('users.addFriend', req.route, req.query);
  Users.findById(req.route.params.userId, function (err, user) {
    if (err) {
      log.error(err);
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
      res.json(404, {'msg':'user not found'});
      return;
    }
    user.friends.pull({'_id': req.route.params.friendId});
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
      res.json(404, {'msg':'user not found'});
      return;
    }
    res.json(200, {'friends': user.friends });
  });
};

module.exports = exports = UsersController;
