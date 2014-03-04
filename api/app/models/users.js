// models/users.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var log = require('winston');
log.info('model: Users');

var mongoose = require('mongoose');

var UsersSchema = new mongoose.Schema({
  'created': {
    'type': Date,
    'default': Date.now,
    'index': true
  },
  'email': {
    'type': String,
    'required': true,
    'lowercase': true,
    'trim': true,
    'index': {
      'unique': true
    },
    'validate': [
      function notEmpty (value) {
        return value && (value.length !== 0);
      },
      'Email address must not be empty'
    ]
  },
  'emailVerified': { 'type': Boolean, 'default': false },
  'emailVerifyKey': { 'type': String, 'required': false },
  'displayName': { 'type': String, 'default': 'New User' },
  'password': { 'type': String, 'required': true },
  'slug': { 'type': String, 'required': false, 'index': { 'unique': true, 'sparse': true } },
  'lastLogin': { 'type': Date, 'required': false },
  'loginCount': { 'type': Number, 'default': 0 },
  'about': { 'type': String, 'required': false },
  'website': { 'type': String, 'required': false },
  'friends': [{
    'friendId': { 'type': mongoose.Schema.Types.ObjectId, 'required': true }
  }],
  'friendCount': { 'type': Number, 'default': 0 },
  'ignored': [{
    'userId': { 'type': mongoose.Schema.Types.ObjectId, 'required': true }
  }],
  'ignoredCount': { 'type': Number, 'default': 0 },
  'messages': [{
    'status': { 'type': String, 'required': true },
    'sent': { 'type': Date, 'default': Date.now },
    'senderId': { 'type': mongoose.Schema.Types.ObjectId, 'required': true },
    'subject': { 'type': String, 'required': false },
    'content': { 'type': String, 'required': false }
  }],
  'messageCount': { 'type': Number, 'default': 0 }
});

mongoose.model('Users', UsersSchema);
