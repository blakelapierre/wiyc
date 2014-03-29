/*
 * FILE
 *  config.js
 *
 * PURPOSE
 *  You put things here you don't want the world to know. Then, you never commit
 *  it or submit to anywhere public. That is how to keep things like your Google
 *  password safe while sharing everything you do with the world. Don't panic.
 *  If you ever share this file with someone, the smartest "Step 2" is
 *  immediately changing all your passwords.
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

module.exports = exports = {
  'allowOrigin'       : 'http(s)://TheDomainYouAccessTheApiFrom.whatever',
  'emailUser'         : 'ENTER YOUR GMAIL USERNAME',
  'emailPassword'     : 'ENGER YOUR GMAIL PASSWORD',
  'userPasswordSalt'  : 'CREATE A UNIQUE PASSWORD SALT', // use a UUID
  'cookieSecret'      : 'CREATE A UNIQUE COOKIE SECRET'  // use a UUID
};

// AND DON'T EVER SHARE THIS FILE! IF YOU DO, CHANGE EVERYTHING AND MIGRATE
// THE USER PASSWORD SALT (TOTAL PAIN IN THE ASS). PLEASE: BE CAREFUL!!
