var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');// httpリクエストのログを吐き出す
// var favicon = require('server-favicon');// ファビコン(画像icon)を表示する
var bodyParser = require('body-parser');
var session = require('express-session');
var validator = require('express-validator');

var index = require('./routes/index');
var users = require('./routes/users');
var home = require('./routes/home');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); //viewテンプレートが入ったフォルダ設定
app.set('view engine', 'ejs');// viewテンプレートエンジン設定

app.use(logger('dev'));// ログの出力方法の設定
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());

var session_opt = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 60 * 60 * 1000}
};
app.use(session(session_opt));

app.use('/', index);
app.use('/users', users);
app.use('/home', home);

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
