// models/posts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var mongoose = require('mongoose');
var log = require('winston');

log.info('model: Posts');

var PostsSchema = new mongoose.Schema({
  'created': { 'type': Date, 'default': Date.now },
  'title': { 'type': String, 'required': true },
  'content': { 'type': String, 'required': true },
  'excerpt': { 'type': String, 'required': false },
  'interactions': require('./partials/interactions.js')
});

mongoose.model('Posts', PostsSchema);
