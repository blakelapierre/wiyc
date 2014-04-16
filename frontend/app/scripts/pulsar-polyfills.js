// pulsar-utils.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

/*
 * When working in Pulsar, for convenience, you may:
 *
 * var test = [ 1, 2, 3 ];
 * if (test.contains(2)) {
 * }
 */

Array.prototype.contains = function (element) { return (this.indexOf(element) !== -1); };
