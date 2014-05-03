/*
 * FILE
 *  models/pulses.js
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
log.info('model: Pulses');

var mongoose = require('mongoose');

var statusValues = ['draft', 'published', 'trash'];
function validatePulseStatus (value) {
  return statusValues.indexOf(value) !== -1;
}

var visibilityValues = ['public', 'contacts', 'private'];
function validateVisibilityValue (value) {
  return visibilityValues.indexOf(value) !== -1;
}

var PulsesSchema = new mongoose.Schema({
  '_creator': { 'type': mongoose.Schema.Types.ObjectId, 'required': true, 'ref': 'Users' },
  'created': { 'type': Date, 'default': Date.now, 'index': true },
  'visibility': {
    'type': String,
    'required': true,
    'validate': [ validateVisibilityValue, 'Pulse visibility fails validation']
  },
  'status': {
    'type': String,
    'required': true,
    'default': 'draft',
    'validate': [ validatePulseStatus, 'Pulse status fails validation' ]
  },
  'title': { 'type': String, 'required': true, 'index': true },
  'content': { 'type': String, 'required': true },
  'excerpt': { 'type': String, 'required': false, 'index': true },
  'interactions': require('./partials/interactions.js')
});

mongoose.model('Pulses', PulsesSchema);
