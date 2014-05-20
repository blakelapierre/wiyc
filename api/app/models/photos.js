// models/photos.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

var log = require('winston');
log.info('model: Photos');

var mongoose = require('mongoose');

var PhotosSchema = new mongoose.Schema({
  'creator': {
    'type': mongoose.Schema.Types.ObjectId,
    'required': true,
    'index': 'hashed',
    'ref': 'Users'
  },
  'created': {
    'type': Date,
    'default': Date.now,
    'index': true
  },
  'mimeType': { 'type': String, 'required': true },
  'title': { 'type': String, 'required': true },
  'description': { 'type': String, 'required': false },
  'interactions': require('./partials/interactions.js')
});

mongoose.model('Photos', PhotosSchema);
