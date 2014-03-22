/*
 * FILE
 *  models/pulse-categories.js
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
log.info('model: PulseCategories');

var mongoose = require('mongoose');

var PulseCategoriesSchema = new mongoose.Schema({
  'category': { 'type': String, 'required': true, 'unique': true },
  'slug': { 'type': String, 'required': true, 'unique': true },
  'description': { 'type': String, 'required': false }
});

var PulseCategories = mongoose.model('PulseCategories', PulseCategoriesSchema);
PulseCategories.find({'category': 'blog'}, function (err, blogCategory) {
  if (err) {
    log.error('pulsecategories.find', err);
    throw err;
  }
  if (blogCategory) {
    return;
  }

  blogCategory = {
    'category':'blog',
    'description':'The Pulsar main blog page category to support the blogging module.'
  };
  PulseCategories.create(blogCategory, function (err, savedCategory) {
    if (err) {
    }
    log.info('PULSAR: new pulse category', savedCategory);
  });
});
