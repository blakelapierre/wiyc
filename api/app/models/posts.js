// models/posts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var mongoose = require('mongoose');
var PostsSchema = new mongoose.Schema({
  'created': { 'type': Date, 'default': Date.now },
  'title': { 'type': String, 'required': true },
  'content': { 'type': String, 'required': true },
  'excerpt': { 'type': String, 'required': false },
  'comments': require('./partials/comments.js')
});

mongoose.model('Posts', PostsSchema);
console.log('MODEL: Posts');
