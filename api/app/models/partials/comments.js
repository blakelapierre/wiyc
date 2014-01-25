// models/partials/comments.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

module.exports = [{
  'posted': { 'type': Date, 'default': Date.now },
  'author': { 'type': String, 'default': 'Anonymous' },
  'comment': { 'type': String, 'required': true }
}];
