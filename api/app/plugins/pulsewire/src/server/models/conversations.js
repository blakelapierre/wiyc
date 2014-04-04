// models/conversations.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

var log = require('winston');
log.info('++ PulseWire model: Conversations');

var mongoose = require('mongoose');
var ConversationsSchema = new mongoose.Schema({
  'creator': { 'type': mongoose.Schema.Types.ObjectId, 'required': true, 'ref': 'Users', 'index': 'hashed' },
  'created': { 'type': Date, 'default': Date.now, 'index': true },
  'subject': { 'type': String },
  'members': [{
    'user': { 'type': mongoose.Schema.Types.ObjectId, 'required': true, 'ref': 'Users', 'index': true},
    'joined': { 'type': Date, 'default': Date.now, 'index': true },
    'withHistory': { 'type': Boolean, 'default': true }
  }],
  'messages': [{
    'sender': { 'type': mongoose.Schema.Types.ObjectId, 'required': true, 'ref': 'Users', 'index': true },
    'created': { 'type': Date, 'default': Date.now },
    'content': { 'type': String }
  }]
});

module.exports.ConversationsSchema = exports.ConversationsSchema = mongoose.model('Conversations', ConversationsSchema);
