/*
 * FILE
 *  plugins/index.js
 *
 * PURPOSE
 *  require()s a list of plugins to load into your Pulsar API server.
 *
 * LICENSE
 *  Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
 *  License: MIT
 */

//@TODO I really want to have this be data-driven and access a collection
// in MongoDB to known which plugins to load/enable in the server.

module.exports = exports = [
    require('./pulsewire')
];
