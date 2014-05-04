// models/partials/interactions.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT
/*
PURPOSE:
Defines a reusable MongooseJS model partial for (re)use around the entire Pulsar
API. Pulsar also provides a controller for this partial that can simply be
pathed and patched into your service's domain as desired. You don't even need to
call them a thumbs-up in the URL.

LEARN MORE:
https://github.com/robcolbert/pulsarcms/wiki/Pulsar-API:-Interactions
*/

var mongoose = require('mongoose');

/*
 * Information about "who" liked "what" is stored on user profiles, not here.
 * Thumbs-Up and Thumbs-Down are simple counts on objects. They do not account.
 * Accountable actions are stored on a user's profile with a date and an Object
 * reference. The fact that they are stored on the user's ACCOUNT (whoah) is by
 * design and very on-purpose.
 *
 * The philosophy is to keep interactions mostly agnostic where appropriate and
 * simple by design. Because simple is always appropriate.
 */
module.exports = {
  'likes': { 'type': Number, 'default': 0 },
  'dislikes': { 'type': Number, 'default': 0 },
  'comments': [{
    '_creator': { 'type': mongoose.Schema.Types.ObjectId, 'required': true, 'ref': 'Users' },
    'created': { 'type': Date, 'default': Date.now },
    'likes': { 'type': Number, 'default': 0 },
    'dislikes': { 'type': Number, 'default': 0 },
    'content': { 'type': String, 'required': true },
  }]
};
