var express = require('express');
var rjcUtils = require('robcolbert-utils');

module.exports = function(app, config) {
  app.configure(function () {
    app.use(express.compress());
    app.use(new rjcUtils.expressjs.CORS(app, config));
    app.use(express.static(config.root + '/public'));
    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.use(express.favicon(config.root + '/public/img/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(function(req, res) {
      res.status(404).render('404', { title: '404' });
    });
  });
};
