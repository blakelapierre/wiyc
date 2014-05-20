// models/projects.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

/*
   Provides a backing store for developer applications in Pulsar Studio.
*/

'use strict';

var log = require('winston');
log.info('model: Projects');

var mongoose = require('mongoose');

function ProjectRatingValues ( ) { }
ProjectRatingValues.validate = function (value) {
  return ['E', 'T', 'M'] // Everyone, Teen, Mature
         .indexOf(value) !== -1;
};

var ProjectsSchema = new mongoose.Schema({
  'creator': {
    'type': mongoose.Schema.Types.ObjectId,
    'required': true,
    'index': 'hashed',
    'ref': 'Users'
  },
  'created': {
    'type': Date,
    'default': Date.now,
    'index': true
  },

  'name': { 'type': String, 'required': true },
  'rating': { 'type': String, 'required': true, 'validate': ProjectRatingValues.validate },
  'description': { 'type': String, 'required': false },
  'interactions': require('./partials/interactions.js'),

  'scripts': [{
    'name': { 'type': String, 'required': true },
    'version': { 'type': Number, 'default': 0 },
    'content': { 'type': String, 'default': null }
  }]

});

mongoose.model('Projects', ProjectsSchema);
