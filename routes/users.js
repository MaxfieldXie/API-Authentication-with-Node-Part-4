const express = require('express');
const router = express.Router();
const Joi = require('joi');
const User = require('../models/user');   
const passport = require('passport');


const userSchema = Joi.object().keys({
  email:Joi.string().email().required(),
  username:Joi.string().required(),
  password:Joi.string().regex(/^[a-zA-Z0-9]{3,15}$/).required(),
  confirmationPassword:Joi.any().valid(Joi.ref('password')).required()
});



router.route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post(async (req, res, next) => {
    try{
        const result =  Joi.validate(req.body,userSchema);
        console.log('result',result);
      
        if(result.error) {
          req.flash('error', 'Data is not valid, please try again');
          res.redirect('/Users/register');
          return;
      }
      //  checking if email is already taken
      const user =  await User.findOne({'email':result.value.email });
        if (user){
          req.flash('error','Email is already in use');
          res.redirect('/Users/register');
          return;
        }



      // Hash the password
      const hash = await User.hashPassword(result.value.password); 
      console.log('hash',hash);
  } catch(error) {
    next(error);
  }
  });

router.route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post(passport.authenticate('local',{
      successRedirect: '/Users/dashboard',
      failureRedicrt: '/users/login',
      failureFlash: true
  }));


router.route('/dashboard')
  .get((req,res) => {
//    console.log('req.user',req.user);
//    res.render('dashboard');
  })  

router.route('/logout')
  .get((req,res) => {
      req.logout();
      req.flash('success','Successfully logged out. Hope to see you soon!');
      res.redirect('/');
//    console.log('req.user',req.user);
//    res.render('');
  })  

module.exports = router;
