// models/partials/interactions.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

module.exports = {
  'likes': { 'type': Number, 'default': 0 },
  'dislikes': { 'type': Number, 'default': 0 },
  'comments': [{
    'posted': { 'type': Date, 'default': Date.now },
    'author': { 'type': String, 'default': 'Anonymous' },
    'content': { 'type': String, 'required': true }
  }]
};
