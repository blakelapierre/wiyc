// controllers/posts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

var log = require('winston');
log.info('controller: PostsController');

var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');
var Paginator = require('robcolbert-utils').expressjs.Paginator;

function PostsController (app, config) {
  this.app = app;
  this.config = config;
}

PostsController.prototype.checkAuthentication = function (req, res, message) {
  if (!req.session.user || !req.session.authenticated.status) {
    log.error('Posts.createComment called by unauthenticated client', req.session);
    res.json(
      500,
      {
        //@TODO: refactor this to a config file with internationalization
        'message': message
      }
    );
    return false;
  }
  return true;
};

PostsController.prototype.create = function (req, res) {
  log.debug('posts.create', req.route, req.query, req.body);
  if (!this.checkAuthentication(req, res, 'Posts can only be created by authenticated Pulsar users.')) {
    return;
  }

  req.body._creator = req.session.user._id;
  Posts.create(req.body, function (err, newPost) {
    if (err) {
      log.error(err);
      res.json(500, err);
      log.error('posts.create error', err);
      return;
    }
    res.json(200, newPost);
  });
};

PostsController.prototype.list = function(req, res){
  log.debug('posts.list', req.route, req.query);

  var query =
  Posts
  .find({ }, '_creator created title content excerpt')
  .lean(false);

  var paginator = new Paginator(req);
  query = paginator.paginateQuery(query);

  query
  .sort({ 'created':-1 })
  .populate('_creator', '_id displayName')
  .exec(function (err, posts) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, posts);
  });
};

PostsController.prototype.get = function (req, res) {
  log.debug('posts.get', req.route, req.query);
  Posts
  .findById(req.route.params.postId)
  .lean(true)
  .populate('_creator', '_id displayName')
  .populate({
    'path':'interactions.comments._creator',
    'select': '_id displayName'
  })
  .exec(function (err, post) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!post) {
      res.json(404, {'msg':'post not found'});
      return;
    }
    res.json(200, post);
  });
};

PostsController.prototype.update = function (req, res) {
  log.debug('posts.update', req.route, req.query, req.body);
  if (!this.checkAuthentication(req, res, 'Posts can only be updated by authenticated Pulsar users.')) {
    return;
  }

  // In no way will the creator's userId be authoritaive when coming from the
  // client period and ever. This value was read from the database and stored
  // in memcache on trusted resources.
  req.body._creator = req.session.user._id;

  // In no way will meaningful information from a post be considered
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

  Posts.findById(req.route.params.postId, function (err, post) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!post) {
      res.json(404, {'message':'post not found'});
      return;
    }
    if (req.body.__v < post.__v) {
      res.json(500, {'message':'A newer version of this post already exists'});
      return;
    }

    // if the authenticated user on this session is NOT the author of this
    // document, then unlike on Maury Povich where the guy hears, "You are NOT
    // the father," our hacker does not get to celebrate and the document
    // doesn't have to run off stage with a camera crew following it.

    if (post._creator.toString() !== req.session.user._id.toString()) {
      post.populate('_creator', '_id displayName', function (err, populatedUser) {
        console.log('unauthorized post edit', post._creator, req.session.user);
        res.json(403, {'message':'you are not authorized to edit this post'});
      });
      return; // we're done
    }

    // Update the authorized fields by directly copying them from the input.
    // @TODO: As ours is not the only client accessing Pulsar, some degree of
    // content filtering is going to be required here. A little testing is
    // needed, but some manner of filtering is going to be required here.

    post.title = req.body.title;
    post.excerpt = req.body.excerpt;
    post.content = req.body.content;
    post.increment();

    post.save(function (err, newPost) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      newPost.populate('_creator', '_id displayName', function (err, populatedPost) {
        if (err) {
          log.error(err);
          res.json(500, err);
          return;
        }
        res.json(200, populatedPost);
      })
    });
  });
};

PostsController.prototype.delete = function (req, res) {
  log.debug('posts.delete', req.route, req.query);
  if (!this.checkAuthentication(req, res, 'Posts can only be deleted by authenticated Pulsar users.')) {
    return;
  }

  Posts.remove(req.body, function (err) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200);
  });
};

PostsController.prototype.createComment = function (req, res) {
  log.debug('posts.createComment', req.route, req.query, req.body);
  if (!this.checkAuthentication(req, res, 'Post comments can only be created by authenticated Pulsar users.')) {
    return;
  }

  Posts.findById(req.route.params.postId)
  .populate('_creator', '_id displayName')
  .exec(function (err, post) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!post) {
      res.json(404, {'msg':'post not found'});
      return;
    }

    req.body._creator = req.session.user._id;
    post.interactions.comments.push(req.body);
    post.save(function (err, newPost) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      var commentIdx = newPost.interactions.comments.length - 1;
      newPost.populate(
        {
          'path': 'interactions.comments._creator',
          'select': '_id displayName'
        },
        function (err, populatedPost) {
          if (err) {
            log.error(err);
            res.json(500, err);
            return;
          }
          var comment = populatedPost.interactions.comments[commentIdx];
          res.json(200, comment);
        }
      );
    });
  });
};

PostsController.prototype.getComments = function (req, res) {
  log.debug('posts.getComments', req.route, req.query);
  var paginator = new Paginator(req);
  var query =
  Posts
  .findById(req.route.params.postId, 'comments')
  .lean(true);

  paginator.paginateQuery(query)
  .sort({'posted':1})
  .populate('_creator', '_id displayName')
  .exec(function (err, post) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, post.interactions.comments);
  });
};

module.exports = exports = PostsController;
