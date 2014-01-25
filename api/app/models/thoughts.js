// models/thoughts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var mongoose = require('mongoose');
var ThoughtsSchema = new mongoose.Schema({
  'created': { 'type': Date, 'default': Date.now },
  'thought': { 'type': String, 'required': true },
  'comments': require('./partials/comments.js')
});

ThoughtsSchema.virtual('date')
.get(function ( ) {
  return this._id.getTimestamp();
});

mongoose.model('Thoughts', ThoughtsSchema);
console.log('MODEL: Thoughts');
