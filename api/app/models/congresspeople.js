/*
 * FILE
 *  models/congresspeople.js
 *
 * PURPOSE
 *
 *
 * LICENSE
 *  Copyright (C) 2014 Blake La Pierre <blakelapierre@gmail.com>
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
log.info('model: congresspeople');

var mongoose = require('mongoose');

function CongresspeopleChamberValues ( ) { }
CongresspeopleChamberValues.validate = function (value) {
  return ['house', 'senate'] // <-- how to Pulsar :)
         .indexOf(value) !== -1;
};

var CongresspeopleSchema = new mongoose.Schema({
  'created': { 'type': Date, 'default': Date.now, 'index': true },
  'name': { 'type': String, 'required': true, 'index': true },
  'chamber': { 'type': String, 'required': true, 'index': true },
  'location': { // should be a reference to location object?
    'vicinity': { 'type': String },
    'latitude': { 'type': String }, // trust floats for this? Nah
    'longitude': { 'type': String }
  },
  'timeline': [{
    'time': { 'type': Date },
    'event': { 'type': mongoose.Schema.Types.ObjectId, 'required': true }
  }],
  'videos': [{ 'type': mongoose.Schema.Types.ObjectId, 'required': true, 'ref': 'Videos' }]
});

mongoose.model('Congresspeople', CongresspeopleSchema);
