// controllers/posts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');
var Paginator = require('./lib/paginator');

exports.list = function(req, res){
  var query = Posts.find(req.query, 'created title content excerpt').lean(true);
  var paginator = new Paginator(req);
  paginator.paginateQuery(query).sort({'created':-1}).exec(function (err, posts) {
    if (err) {
      res.json(500, err);
      return;
    }
    res.json(200, posts);
  });
};

exports.create = function (req, res) {
  var post = new Posts(req.body);
  post.save(function (err, newPost) {
    if (err) {
      res.json(500, err);
      console.log('posts.create error', err);
      return;
    }
    res.json(200, newPost);
  });
};

exports.get = function (req, res) {
  Posts.findById(req.route.params.postId, function (err, post) {
    if (err) {
      res.json(500, err);
      return;
    }
    res.json(200, post);
  });
};

exports.update = function (req, res) {
  delete req.body._id;
  console.log('posts.update', req.body);
  Posts.findByIdAndUpdate(req.route.params.postId, req.body, function (err, post) {
    if (err) {
      console.log(err);
      res.json(500, err);
      return;
    }
    res.json(200, post);
  });
};

exports.delete = function (req, res) {
  Posts.remove(req.body, function (err) {
    if (err) {
      res.json(500, err);
      return;
    }
    res.json(200);
  });
};

exports.createComment = function (req, res) {
  Posts.findById(req.route.params.postId, function (err, post) {
    if (err) {
      res.json(500, err);
      return;
    }
    post.comments.push(req.body);
    post.save(function (err, newPost) {
      if (err) {
        res.json(500, err);
        console.log(err);
        return;
      }
      res.json(200, newPost.comments[newPost.comments.length - 1]);
    });
  });
};

exports.getComments = function (req, res) {
  var paginator = new Paginator(req);
  var query = Posts.findById(req.route.params.postId, 'comments').lean(true);
  paginator.paginateQuery(query).sort({'posted':1}).exec(function (err, post) {
    if (err) {
      res.json(500, err);
      return;
    }
    res.json(200, post.comments);
  });
};
