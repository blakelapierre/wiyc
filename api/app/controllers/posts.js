// controllers/posts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var log = require('winston');
log.info('controller: PostsController');

var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');
var Paginator = require('robcolbert-utils').expressjs.Paginator;

function PostsController (app, config) {
  this.app = app;
  this.config = config;
}

PostsController.prototype.create = function (req, res) {
  log.debug('posts.create', req.route, req.query, req.body);
  if (!req.session.user || !req.session.authenticated.status) {
    log.error('Posts.create called by unauthenticated client', req.session);
    res.json(
      500,
      {
        //@TODO: refactor this to a config file with internationalization
        'message':'Post creation requires user authentication (non-negotiable).'
      }
    );
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
  log.info('posts.list', req.route, req.query);

  var query =
  Posts
  .find({ }, '_creator created title content excerpt')
  .lean(true);

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
  delete req.body._id;

  Posts
  .findByIdAndUpdate(req.route.params.postId, req.body)
  .lean(true)
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
    res.json(200, post);
  });
};

PostsController.prototype.delete = function (req, res) {
  log.debug('posts.delete', req.route, req.query);
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
  Posts.findById(req.route.params.postId)
  .lean(true)
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
    post.interactions.comments.push(req.body);
    post.save(function (err, newPost) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      var commentIdx = newPost.interactions.comments.length - 1;
      res.json(200, newPost.interactions.comments[commentIdx]);
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
