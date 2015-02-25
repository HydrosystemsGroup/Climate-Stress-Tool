var express = require('express'),
    session = require('express-session'),
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

  // should be placed before express.static
  // app.use(express.compress({
  //   filter: function (req, res) {
  //     return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
  //   },
  //   level: 9
  // }))

  app.use(compression());

  app.use(favicon());
  if (config.env !== 'test') app.use(logger('dev'));

  app.use(express.static(config.root + '/public'));

  // set views path, template engine and default layout
  app.set('views', config.root + '/views');
  app.set('view engine', 'ejs');

  // expose package.json to views
  app.use(function (req, res, next) {
    res.locals.pkg = pkg;
    next();
  });

  // cookieParser should be above session
  app.use(cookieParser());

  // bodyParser
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded());

  // expresssession storage
  // app.use(session({ 
  //   store: new mongoStore({
  //       url: config.database_url,
  //       collection : 'sessions'
  //     }),
  //   secret: pkg.name, 
  //   resave: true, 
  //   saveUninitialized: true
  // }));

  // use passport session
  // app.use(passport.initialize());
  // app.use(passport.session());

  // connect flash for flash messages - should be declared after sessions
  app.use(flash());

  // should be declared after session and flash
  // app.use(helpers(pkg.name))

  // adds CSRF support
  // if (process.env.NODE_ENV !== 'test') {
  //   app.use(express.csrf())

  //   // This could be moved to view-helpers :-)
  //   app.use(function(req, res, next){
  //     res.locals.csrf_token = req.csrfToken()
  //     next()
  //   })
  // }

  // Add user to all renders
  // app.use(function(req, res, next){
  //   res.locals.user = req.user;
  //   // res.locals.message = [''];
  //   res.locals.message = { 
  //     'info': req.flash('info'),
  //     'error': req.flash('error')
  //   };
  //   next();
  // });

  // Bootstrap routes
  // require('./routes')(app, passport);
  app.use('/jobs', kue.app);
  require('./routes')(app);

  /// error handlers

  /// catch 404 and forward to error handler
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







