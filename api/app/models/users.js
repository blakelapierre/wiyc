// models/users.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var mongoose = require('mongoose');
var log = require('winston');

log.info('model: Users');

var UsersSchema = new mongoose.Schema({
  'created': { 'type': Date, 'default': Date.now },
  'email': { 'type': String, 'required': true },
  'displayName': { 'type': String, 'required': true },
  'password': { 'type': String, 'required': true },
  'slug': { 'type': String, 'required': false },
  'about': { 'type': String, 'required': false },
  'website': { 'type': String, 'required': false },
  'friends': [{
    'friendId': { 'type': mongoose.Schema.Types.ObjectId, 'required': true },
    'displayName': { 'type': String, 'required': true }
  }],
  'ignored': [{
    'userId': { 'type': mongoose.Schema.Types.ObjectId, 'required': true }
  }]
});

mongoose.model('Users', UsersSchema);
