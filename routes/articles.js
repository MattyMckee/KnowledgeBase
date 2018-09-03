const express = require('express');
const router = express.Router();

//bring in models
let Article = require('../models/article');

//add article
router.get('/add', function(req, res){
  console.log('hit');
  res.render('add_article',{
    title: 'Add Article'
  });
});

//load edit article
router.get('/edit/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article',{
      title: 'Edit Article',
      article:article
  });
  });
});

//add submit post route
router.post('/add', function(req, res){
  let article = new Article();

  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err)
    } else {
      req.flash('success', 'Article Added');
      res.redirect('/');
    }
  })
});

//update submit article
router.post('/edit/:id', function(req, res){
  let article  = {};

  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query  = {_id: req.params.id}

  Article.update(query,article, function(err){
    if(err){
      console.log(err)
    } else {
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
});

//delete article
router.delete('/:id', function(req, res){

  let query = {_id:req.params.id}
  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    req.flash('danger', 'Article Deleted');
    res.send('Success');
  });
});

//get single articles
router.get('/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('article',{
      article:article
  });
  });
});

module.exports = router;
