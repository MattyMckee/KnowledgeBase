const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');


//bring in models
let User = require('../models/user');

//Register form
router.get('/register', function(req,res){

  res.render('register');
});

//Register Process
router.post('/register',[

  check('name').not().isEmpty(),
  check('email').isEmail(),
  check('username').not().isEmpty(),
  check('password').not().isEmpty(),
  check('confirmPassword').equals('password')

], function(req,res){

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {

    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });

    // bcrypt.genSalt(10, function(err, salt){
    //   bcrypt.hash(newUser.password, salt), function(err, hash){
    //     if(err){
    //       console.log(err);
    //     }else {
    //       console.log(hash);
    //       newUser.password = hash;
    //     }
    //   }
    // });

    newUser.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'You are now registered and can log in');
        res.redirect('/users/login');
      }
    });
  }
});


router.get('/login', function(req,res){
  res.render('login');
})
module.exports = router;
