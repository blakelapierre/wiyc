// models/photos.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var mongoose = require('mongoose');
var PhotosSchema = new mongoose.Schema({
  'created': { 'type': Date, 'default': Date.now },
  'mimeType': { 'type': String, 'required': true },
  'title': { 'type': String, 'required': true },
  'description': { 'type': String, 'required': false },
  'interactions': require('./partials/interactions.js')
});

mongoose.model('PhotosSchema', PhotosSchema);
console.log('MODEL: Photos');
