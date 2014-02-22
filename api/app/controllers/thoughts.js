// controllers/thoughts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var mongoose = require('mongoose');
var Thoughts = mongoose.model('Thoughts');
var Paginator = require('robcolbert-utils').expressjs.Paginator;

exports.list = function(req, res){
  var paginator = new Paginator(req);
  var query = Thoughts.find({ }, 'created thought', { 'sort': { 'created': -1 }});
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
  delete req.body._id;
  Thoughts.findOneAndUpdate(
    {'_id': req.route.params.id},
    req.body,
    function (thought) {
      if (err) {
        res.json(500, err);
        return;
      }
      if (!thought) {
        res.json(404, {'msg':'thought not found (and that\'s funny shit)'});
        return;
      }
      res.json(200, thought);
    }
  );
};

exports.delete = function (req, res) {
  Thoughts.findOneAndRemove(
    {'_id': req.route.params.id },
    function (err) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200);
    }
  );
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
