// models/conversations.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

var log = require('winston');
log.info('model: Conversations');

var mongoose = require('mongoose');
var ConversationsSchema = new mongoose.Schema({
  'creator': {
    'type': mongoose.Schema.Types.ObjectId,
    'required': true,
    'ref': 'Users',
    'index': 'hashed'
  },
  'created': { 'type': Date, 'default': Date.now, 'index': true },
  'subject': { 'type': String },
  'members': [{
    'type': mongoose.Schema.Types.ObjectId,
    'required': true,
    'ref': 'Users',
    'index': true
  }],
  'messages': [{
    'sender': {
      'type': mongoose.Schema.Types.ObjectId,
      'required': true,
      'ref': 'Users',
      'index': 'hashed'
    },
    'created': { 'type': Date, 'default': Date.now },
    'content': { 'type': String }
  }],
  'lastMessage': { 'type': mongoose.Schema.Types.ObjectId, 'required': false },
});

mongoose.model('Conversations', ConversationsSchema);
