/*
 * FILE
 *  controllers/pulse-categories.js
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
log.info('controller: PulseCategoriesController');

var mongoose = require('mongoose');
var PulseCategories = mongoose.model('PulseCategories');
var Paginator = require('robcolbert-utils').expressjs.Paginator;

function PulseCategoriesController (app, config) {
  this.app = app;
  this.config = config;
}

PulseCategoriesController.prototype.create = function (req, res) {
  log.debug('pulsecategories.create', req.route, req.query, req.body);
  if (!this.app.checkAdmin(req, res, 'Pulse categories can only be created by Pulsar administrators.')) {
    return;
  }

  req.body._creator = req.session.user._id;
  PulseCategories.create(req.body, function (err, newPulse) {
    if (err) {
      log.error(err);
      res.json(500, err);
      log.error('pulsecategories.create error', err);
      return;
    }
    res.json(200, newPulse);
  });
};

PulseCategoriesController.prototype.list = function(req, res){
  log.debug('pulsecategories.list', req.route, req.query);

  var query =
  PulseCategories
  .find({ }, 'category slug description')
  .sort({ 'category': 1 });

  var paginator = new Paginator(req);
  paginator.paginateQuery(query)
  .lean(false)
  .exec(function (err, categories) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, categories);
  });
};

PulseCategoriesController.prototype.get = function (req, res) {
  log.info('pulsecategories.get', req.route, req.query);

  PulseCategories
  .findById(req.route.params.categoryId)
  .lean(true)
  .exec(function (err, pulse) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!pulse) {
      res.json(404, { 'msg': 'Pulse category not found' });
      return;
    }
    res.json(200, pulse);
  });
};

PulseCategoriesController.prototype.update = function (req, res) {
  log.debug('pulsecategories.update', req.route, req.query, req.body);
  if (!this.app.checkAdmin(req, res, 'Pulse categories can only be updated by Pulsar administrators.')) {
    return;
  }

  PulseCategories.findById(req.route.params.categoryId, function (err, category) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!category) {
      res.json(404, {'message': 'Pulse category not found'});
      return;
    }
    if (req.body.__v < category.__v) {
      res.json(500, {'message':'A newer version of this pulse category already exists'});
      return;
    }

    category.category = req.body.category;
    category.slug = req.body.slug;
    category.description = req.body.description;
    category.increment();

    category.save(function (err, savedCategory) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      res.json(200, savedCategory);
    });
  });
};

PulseCategoriesController.prototype.delete = function (req, res) {
  log.debug('pulsecategories.delete', req.route, req.query);
  if (!this.app.checkAdmin(req, res, 'Pulses can only be deleted by Pulsar administrators.')) {
    return;
  }

  PulseCategories.remove(req.body, function (err) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200);
  });
};

module.exports = exports = PulseCategoriesController;
