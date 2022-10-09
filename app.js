var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var fs = require('fs')
var logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
var redis = require('redis')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//判断使用combined 或者 dev
const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
  //开发环境/测试环境
  app.use(logger('dev'));//记录accesslo
} else {
  //线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }));
}

app.use(express.json());//通过req.body拿到内容
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());//解析cookie
// app.use(express.static(path.join(__dirname, 'public')));
const redisClient = require('./db/redis');
const sessionStore = new RedisStore({
  client: redisClient
})

app.use(session({
  secret: 'WJiol_#23123_',//密匙
  cookie: {
    //path: '/',//根目录
    //httpOnly: true,//设置为true前端无法更改cookie 只能后端操作 保证安全性
    maxAge: 24 * 60 * 60 * 1000,//24小时后失效
  },
  store: sessionStore,//把session存入redis
  // resave: false,
  // saveUninitialized: false,
}))

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/user', userRouter);
app.use('/api/blog', blogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));//错误页处理
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
