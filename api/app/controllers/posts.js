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

PostsController.prototype.list = function(req, res){
  console.debug('posts.list', req.route, req.query);
  var query = Posts.find(req.query, 'created title content excerpt').lean(true);
  var paginator = new Paginator(req);
  paginator.paginateQuery(query).sort({'created':-1}).exec(function (err, posts) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, posts);
  });
};

PostsController.prototype.create = function (req, res) {
  console.debug('posts.create', req.route, req.query, req.body);
  var post = new Posts(req.body);
  post.save(function (err, newPost) {
    if (err) {
      log.error(err);
      res.json(500, err);
      log.error('posts.create error', err);
      return;
    }
    res.json(200, newPost);
  });
};

PostsController.prototype.get = function (req, res) {
  console.debug('posts.get', req.route, req.query);
  Posts.findById(req.route.params.postId, function (err, post) {
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
  console.debug('posts.update', req.route, req.query, req.body);
  delete req.body._id;
  Posts.findByIdAndUpdate(req.route.params.postId, req.body, function (err, post) {
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
  console.debug('posts.delete', req.route, req.query);
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
  console.debug('posts.createComment', req.route, req.query, req.body);
  Posts.findById(req.route.params.postId, function (err, post) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!post) {
      res.json(404, {'msg':'post not found'});
      return;
    }
    post.comments.push(req.body);
    post.save(function (err, newPost) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      res.json(200, newPost.comments[newPost.comments.length - 1]);
    });
  });
};

PostsController.prototype.getComments = function (req, res) {
  console.debug('posts.getComments', req.route, req.query);
  var paginator = new Paginator(req);
  var query = Posts.findById(req.route.params.postId, 'comments').lean(true);
  paginator.paginateQuery(query).sort({'posted':1}).exec(function (err, post) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, post.comments);
  });
};

module.exports = exports = PostsController;
