// models/users.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

var log = require('winston');
log.info('model: Users');

var mongoose = require('mongoose');

function validateNotEmpty (value) {
  return value && (value.length !== 0);
}

var accountStandingStatuses = ['active', 'admin', 'banned', 'password-reset'];
function validateAccountStandingStatus (value) {
  return accountStandingStatuses.indexOf(value) !== -1;
}

var pulseVisibilityValues = ['public', 'contacts', 'banned', 'password-reset'];
function validateAccountStandingStatus (value) {
  return pulseVisibilityValues.indexOf(value) !== -1;
}

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
    'validate': [ validateNotEmpty, 'Email address must not be empty' ]
  },
  'emailVerified': { 'type': Boolean, 'default': false },
  'emailVerifyKey': { 'type': String, 'required': false },
  'passwordResetKey': { 'type': String, 'required': false },
  'accountStanding': {
    'status': {
      'type': String,
      'default': 'active',
      'validate': [ validateAccountStandingStatus, 'Account standing fails validation' ]
    },
    'reason': { 'type': String },
    'expires': { 'type': Date }
  },
  'password': { 'type': String, 'required': true },
  'slug': { 'type': String, 'required': false, 'index': { 'unique': true, 'sparse': true } },
  'lastLogin': { 'type': Date, 'required': false },
  'loginCount': { 'type': Number, 'default': 0 },
  'displayName': { 'type': String, 'default': 'New User' },
  'tagline': { 'type': String, 'required': false },
  'about': { 'type': String, 'required': false },
  'website': { 'type': String, 'required': false },
  'contacts': [{
    'contactId': { 'type': mongoose.Schema.Types.ObjectId, 'required': true, 'ref': 'Users' },
    'connected': { 'type': Date, 'default': Date.now },
  }],
  'contactCount': { 'type': Number, 'default': 0 },
  'contactRequests': [{
    'sender': { 'type': mongoose.Schema.Types.ObjectId, 'required': true, 'ref': 'Users'},
    'message': { 'type': String, 'required': false },
  }],
  'ignored': [{
    'userId': { 'type': mongoose.Schema.Types.ObjectId, 'required': true }
  }],
  'ignoredCount': { 'type': Number, 'default': 0 },
  'messageCount': { 'type': Number, 'default': 0 },
  'settings': {
    'flags': {
      'desktopNotifications': {
        'enabled': { 'type': Boolean, 'default': false },
        'conversations': { 'type': Boolean, 'default': true },
        'comments': { 'type': Boolean, 'default': true },
        'requests': { 'type': Boolean, 'default': true },
      },
      'email': {
        'conversations': { 'type': Boolean, 'default': false },
        'comments': { 'type': Boolean, 'default': false },
        'requests': { 'type': Boolean, 'default': true }
      },
      'content': {
        'maximumRating': { 'type': Boolean, 'default': true }
      }
    },
    'defaults': {
      'pulses': {
        'visibility': { 'type': String, 'default': 'contacts' }
      }
    }
  }

});

mongoose.model('Users', UsersSchema);
