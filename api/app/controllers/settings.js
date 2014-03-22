/*
 * FILE
 *  controllers/settings.js
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
log.info('controller: Settings');

var mongoose = require('mongoose');
var Settings = mongoose.model('Settings');

function SettingsController (app, config) {
  var self = this;

  self.app = app;
  self.config = config;

  log.info('reading settings from db...');

  Settings.findOne(function (err, settings) {
    if (err) {
      log.error('setitngs init error', err);
      return;
    }
    if (!settings) {
      self.settings = new Settings(); // create
      self.settings.save(function (err, newSettings) {
        self.settings = newSettings;
      });
    } else {
      self.settings = settings;
    }
  });
}

SettingsController.prototype.checkAuthentication = function (req, res, message) {
  if (!req.session.authenticated.status || !req.session.user || !req.session.user.isAdmin ) {
    log.error('SettingsController.checkAuthentication by unauthenticated client', req.session);
    res.json(
      500,
      {
        //@TODO: refactor this to a config file with internationalization
        'message': message
      }
    );
    return false;
  }
  return true;
};

SettingsController.prototype.get = function (req, res) {
  log.debug('settings.get');

  if (this.settings) {
    res.json(200, this.settings);
    return;
  }

  Settings
  .find()
  .lean(true)
  .limit(1)
  .exec(function (err, settings) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!settings) {
      res.json(404, {'msg':'settings not found (check database install)'});
      return;
    }
    res.json(200, settings);
  });
};

SettingsController.prototype.update = function (req, res) {
  var self = this;

  log.debug('settings.update');
  if (!self.checkAuthentication(req, res, 'Site settings can only be updated by admin users.')) {
    return;
  }

  if (self.settings.__v > req.body.__v) {
    res.json(500, {'message':'A newer version of site settings already exists'});
    return;
  }

  var documentId = req.body._id;
  delete req.body._id;

  Settings.findByIdAndUpdate(documentId, req.body, function (err, newSettings) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    if (!newSettings) {
      res.json(404, {'message':'settings not found (check database)'});
      return;
    }
    self.settings = newSettings;
    res.json(200, self.settings);
  });
};

module.exports = exports = SettingsController;
