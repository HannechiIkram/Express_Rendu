var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactsRouter = require('./routes/contacts');

// Importation de la bibliothèque Mongoose
const mongoose = require('mongoose');

// Chargement de la configuration de la base de données depuis le fichier mongodb.json
const configDB = require('./database/mongodb.json');

// Configuration de la connexion à MongoDB ( avec promess )
mongoose.connect(configDB.mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true, bufferCommands: false })  .then(() => {
    console.log("Connected to DB !!");
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error);
  });

  

//var productsRouter = require('./routes/products.json');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contacts', contactsRouter);


//app.use('/products',productsRouter);

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