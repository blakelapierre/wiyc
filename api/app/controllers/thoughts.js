// controllers/thoughts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var mongoose = require('mongoose');
var Thoughts = mongoose.model('Thoughts');

var Paginator = require('./lib/paginator');

exports.list = function(req, res){
  var query = Thoughts.find(req.query, 'created thought').lean(true);
  var paginator = new Paginator(req);
  paginator.paginateQuery(query).exec(function (err, thoughts) {
    if (err) {
      res.json(500, err);
      return;
    }
    res.json(200, thoughts);
  });
};

exports.create = function (req, res) {
  var thought = new Thoughts(req.body);
  thought.save(function (err, newThought) {
    if (err) {
      res.json(500, err);
      return;
    }
    res.json(200, newThought);
  });
};

exports.get = function (req, res) {
  Thoughts.findById(req.route.params.id, function (err, thought) {
    if (err) {
      res.json(500, err);
      return;
    }
    res.json(200, thought);
  });
};

exports.update = function (req, res) {
  res.json(500, {'msg':'stubbed'});
};

exports.delete = function (req, res) {
  Thoughts.remove(req.body, function (err) {
    if (err) {
      res.json(500, err);
      return;
    }
    res.json(200);
  });
};

exports.createComment = function (req, res) {
  Thoughts.findById(req.route.params.id, function (err, thought) {
    if (err) {
      res.json(500, err);
      return;
    }
    thought.comments.push(req.body);
    thought.save(function (err, newThought) {
      res.json(200, newThought);
    });
  });
};

exports.getComments = function (req, res) {
  console.log('route', req.route);
  console.log('query', req.query);

  var paginator = new Paginator(req);
  
  var query = Thoughts.findById(req.route.params.id, 'comments').lean(true);
  paginator.paginateQuery(query).exec(function (err, thought) {
    if (err) {
      res.json(500, err);
      return;
    }
    res.json(200, thought.comments);
  });
};
