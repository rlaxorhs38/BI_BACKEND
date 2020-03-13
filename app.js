var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var boolParser = require('express-query-boolean');
var session = require('express-session');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

app.use(require('connect-history-api-fallback')());

app.use(session({
  secret: 'sisun',
  resave: false,
  saveUninitialized: true
}))

// CORS 설정
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({ limit : "50mb" })); 
app.use(express.urlencoded({ limit:"50mb", extended: false }));
app.use(cookieParser());
app.use(boolParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/api/common', require('./routes/common'));
app.use('/api/online', require('./routes/online'));
app.use('/api/product', require('./routes/product'));
app.use('/api/buy', require('./routes/buy'));
app.use('/api/hum', require('./routes/hum'));
app.use('/api/crm', require('./routes/crm'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/store', require('./routes/store'));
app.use('/api/fin', require('./routes/fin'));
app.use('/api/style', require('./routes/style'));
app.use('/api/wee', require('./routes/wee'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
