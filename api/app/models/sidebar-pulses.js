// models/sidebar-pulses.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

var log = require('winston');
log.info('model: SidebarPulses');

var mongoose = require('mongoose');

var SidebarPulsesSchema = new mongoose.Schema({
  '_creator': {
    'type': mongoose.Schema.Types.ObjectId,
    'required': true,
    'ref': 'Users',
    'index': 'hashed'
  },
  'created': {
    'type': Date,
    'default': Date.now,
    'index': true
  },
  'content': { 'type': String, 'required': true },
  'interactions': require('./partials/interactions.js')
});

mongoose.model('SidebarPulses', SidebarPulsesSchema);
