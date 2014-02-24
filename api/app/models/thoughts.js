// models/thoughts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var mongoose = require('mongoose');
var log = require('winston');

log.info('model: Thoughts');

var ThoughtsSchema = new mongoose.Schema({
  'created': { 'type': Date, 'default': Date.now },
  'thought': { 'type': String, 'required': true },
  'interactions': require('./partials/interactions.js')
});

ThoughtsSchema.virtual('date')
.get(function ( ) {
  return this._id.getTimestamp();
});

mongoose.model('Thoughts', ThoughtsSchema);
