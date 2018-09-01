const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//init app
const app = express();

//bring in models
let Article = require('./models/article');

//connect to db
mongoose.connect('mongodb://localhost/nodekb');
var db = mongoose.connection;

//check connection

db.once('open', function(){
  console.log('connected to MongoDB');
})

//check for db errors
db.on('error', function(err){
  console.log('errpr')
});


//body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//set public folder

app.use(express.static(path.join(__dirname, 'public')));

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

//get single articles
app.get('/article/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('article',{
      article:article
  });
  });
});

//add article
app.get('/articles/add', function(req, res){
  res.render('add_article',{
    title: 'Add Article'
  })
});

//load edit article
app.get('/article/edit/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article',{
      title: 'Edit Article',
      article:article
  });
  });
});


//add submit post route

app.post('/article/add', function(req, res){
  let article = new Article();

  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err)
    } else {
      res.redirect('/');
    }
  })

});


//update submit article
app.post('/article/edit/:id', function(req, res){
  let article  = {};

  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query  = {_id: req.params.id}

  Article.update(query,article, function(err){
    if(err){
      console.log(err)
    } else {
      res.redirect('/');
    }
  });

});

app.delete('/article/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});


//start server
app.listen(3000, function(){
  console.log('server started on port 3000...');
});
