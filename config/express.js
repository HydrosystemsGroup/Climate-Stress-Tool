var fs = require('fs'),
    express = require('express'),
    session = require('express-session'),
    FileStore = require('session-file-store')(session),
    flash = require('connect-flash'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    pkg = require('../package.json'),
    compression = require('compression');

var kue = require('kue');

var env = process.env.NODE_ENV || 'development';

module.exports = function (app, config) {

  if (config.env === 'development') app.set('showStackError', true);

  if (!fs.existsSync(config.run_folder)){
    console.log("Creating run folder: " + config.run_folder);
    fs.mkdirSync(config.run_folder);
  }

  app.use(session({
    store: new FileStore({
      path: config.session_folder
    }),
    secret: 'climate-stress',
    resave: true,
    saveUninitialized: true
  }));

  app.use(compression());

  app.use(favicon());
  if (config.env !== 'test') app.use(logger('dev'));

  app.use(express.static(config.root + '/public'));

  app.set('views', config.root + '/views');
  app.set('view engine', 'ejs');

  app.use(function (req, res, next) {
    res.locals.pkg = pkg;
    next();
  });

  app.use(cookieParser());

  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({extended: true}));

  app.use(flash());

  app.use('/kue', kue.app);
  require('./routes')(app);

  // error handlers
  app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
  });

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
              message: err.message,
              error: err
          });
      });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: {}
      });
  });

};







