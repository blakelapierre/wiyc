// models/partials/interactions.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var mongoose = require('mongoose');

module.exports = {
  'likes': { 'type': Number, 'default': 0 },
  'dislikes': { 'type': Number, 'default': 0 },
  'comments': [{
    '_creator': { 'type': mongoose.Schema.Types.ObjectId, 'required': true, 'ref': 'Users' },
    'created': { 'type': Date, 'default': Date.now },
    'likes': { 'type': Number, 'default': 0 },
    'dislikes': { 'type': Number, 'default': 0 },
    'content': { 'type': String, 'required': true },
  }]
};
