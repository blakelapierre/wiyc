// models/videos.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var log = require('winston');
log.info('model: Videos');

var mongoose = require('mongoose');

var VideosSchema = new mongoose.Schema({
  'created': { 'type': Date, 'default': Date.now },
  'title': { 'type': String, 'required': true },
  'description': { 'type': String, 'required': false },
  'url': { 'type': String, 'required': false },
  'element': {
    'type': { 'type': String, 'required': true },
    'videoId': { 'type': String, 'required': false }
  },
  'interactions': require('./partials/interactions.js')
});

mongoose.model('Videos', VideosSchema);
