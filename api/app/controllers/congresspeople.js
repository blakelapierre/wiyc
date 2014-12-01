// controllers/congressperson.js
// Copyright (C) 2014 Blake La Pierre <blakelapierre@gmail.com>
// License: MIT

'use strict';

var log = require('winston');
log.info('++ controller: CongresspeopleController');

var mongoose = require('mongoose');
var Congresspeople = mongoose.model('Congresspeople');
var Paginator = require('puretech-foundation').Mongoose.Paginator;

function CongresspeopleController (app, config) {
  this.app = app;
  this.config = config;
}

CongresspeopleController.prototype.list = function(req, res){
  var self = this;
  var options = {
    //'chamber': 'senate'
  };

  log.info('congresspeople.list', options);

  var query = Congresspeople.find(options, '_id name chamber'); // I don't think we really want chamber here, but we need it for the route

  query
  //.sort({ 'created': -1 })
  //.populate('_creator', '_id displayName')
  .exec(function (err, congresspeople) {
    if (self.app.checkError(err,res,'congresspeople.list')) {
      return;
    }
    res.json(200, {list: congresspeople});
  });
};

CongresspeopleController.prototype.get = function (req, res) {
  var self = this;

  log.info('congresspeople.get');

  Congresspeople
  .findOne({name: req.route.params.name})
  .exec(function (err, congressperson) {
    if (self.app.checkError(err,res,'congressperson.get')) {
      return;
    }
    if (!congressperson) {
      res.json(404, {'msg':'congressperson not found'});
      return;
    }
    res.json(200, congressperson);
  });
};

CongresspeopleController.prototype.comment = function (req, res) {


  log.info('congressperson.comment');

  res.json(200, {done: true});
};

CongresspeopleController.prototype.addVideo = function(req, res) {


  log.info('congressperson.addVideo');

  res.json(200, {done: true});
};

module.exports = exports = CongresspeopleController;
