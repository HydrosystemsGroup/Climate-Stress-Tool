var express = require('express'),
    fs = require('fs');

var env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env];

var app = express();

require('./config/express')(app, config);

module.exports = app;
