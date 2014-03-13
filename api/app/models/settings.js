// models/settings.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

var log = require('winston');
log.info('model: SettingsController');

var mongoose = require('mongoose');

var SettingsSchema = new mongoose.Schema({
  'lastUpdated': { 'type': Date, 'default': Date.now },
  'siteInformation': {
    'name': { 'type': String, 'default': 'A New Pulsar Site', 'required': true },
    'brand': { 'type': String, 'default': 'PULSAR', 'required': true },
    'description': { 'type': String }
  }
});

mongoose.model('Settings', SettingsSchema);
