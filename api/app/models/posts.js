// models/posts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

var log = require('winston');
log.info('model: Posts');

var mongoose = require('mongoose');

var PostsSchema = new mongoose.Schema({
  '_creator': { 'type': mongoose.Schema.Types.ObjectId, 'required': true, 'ref': 'Users' },
  'created': { 'type': Date, 'default': Date.now, 'index': true },
  'title': { 'type': String, 'required': true, 'index': true },
  'content': { 'type': String, 'required': true },
  'excerpt': { 'type': String, 'required': false, 'index': true },
  'interactions': require('./partials/interactions.js')
});

mongoose.model('Posts', PostsSchema);
