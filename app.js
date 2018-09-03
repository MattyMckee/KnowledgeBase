const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const { check, validationResult } = require('express-validator/check');


//init app
const app = express();

//bring in models
let Article = require('./models/article');
let User = require('./models/user');

//connect to db
mongoose.connect('mongodb://localhost/nodekb');
var db = mongoose.connection;

//check connection
db.once('open', function(){
  console.log('connected to MongoDB');
});

//check for db errors
db.on('error', function(err){
  console.log('errpr')
});


//body parser middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//set public folder
app.use(express.static(path.join(__dirname, 'public')));


//Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//home route
app.get('/', function(req,res){
  Article.find({}, function(err, articles){

    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Article',
        articles: articles
      });
    }
  });
});

//Route files
let articles = require('./routes/articles');
let users = require('./routes/users');

app.use('/articles', articles);
app.use('/users', users);

//start server
app.listen(3000, function(){
  console.log('server started on port 3000...');
});
