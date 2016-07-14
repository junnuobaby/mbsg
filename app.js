var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var routes = require('./routes/index');
var mongoose = require('mongoose');

var app = express();
var db = mongoose.connection;

mongoose.connect('mongodb://localhost/qingshu');
db.on('error', function callback () {
  console.log("Connection error");
});

db.once('open', function callback () {
  console.log("Mongo working!");
});


app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'chenin',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 1000 * 60 * 6000}
}));

app.use(function (req, res, next) {
  req.session.name= 'chenin';
  next();
});
app.use('/', routes);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      layout: false
    });
  });
}


app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    layout: false
  });
});


app.listen(3000);
