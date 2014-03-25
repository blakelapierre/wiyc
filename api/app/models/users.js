/*
 * FILE
 *  models/users.js
 *
 * PURPOSE
 *
 *
 * LICENSE
 *  Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to
 *  deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *  sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *  IN THE SOFTWARE.
 */

'use strict';

var log = require('winston');
log.info('model: Users');

var mongoose = require('mongoose');

function validateNotEmpty (value) {
  return value && (value.length !== 0);
}

var accountStandingStatuses = ['active', 'admin', 'banned'];
function validateAccountStandingStatus (value) {
  return accountStandingStatuses.indexOf(value) !== -1;
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
  'accountStanding': {
    'status': {
      'type': String,
      'default': 'active',
      'validate': [ validateAccountStandingStatus, 'Account standing fails validation' ]
    },
    'reason': { 'type': String },
    'expires': { 'type': Date }
  },
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
      }
    },
    'defaults': {
      'posts': {
        'visibility': { 'type': String, 'default': 'friends' }
      },
      'pulses': {
        'visibility': { 'type': String, 'default': 'friends' }
      }
    }
  }

});

mongoose.model('Users', UsersSchema);
