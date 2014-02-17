// models/videos.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var mongoose = require('mongoose');
var VideosSchema = new mongoose.Schema({
  'created': { 'type': Date, 'default': Date.now },
  'type': { 'type': String, 'required': true },
  'title': { 'type': String, 'required': true },
  'description': { 'type': String, 'required': false },
  'interactions': require('./partials/interactions.js')
});

mongoose.model('Videos', VideosSchema);
console.log('MODEL: Videos');
