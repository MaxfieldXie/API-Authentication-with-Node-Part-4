const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


passport.serializeUser((user, done) => {
  done(null,user.id);
});



passport.deserializeUser(async (id, done) => {
  try{
      const user = await User.findById(id);
      done(null, user);
  } catch(error){
    done(error,null);
  }

});
passport.use('local', new LocalStrategy({
  usernameFile: 'email',
  passwordField: 'password',
  passReqToCallback: false
}, async (email, password, done) => {
  try {

    //if check if the email already in use.
    const user = await User.findOne({'emai': email}); 
    if(!user){
      return done(null, false, {message: 'unkown user'});
    }
    const isvalid = User.compareParePasswords(password, user,password);
    if(isvalid){
      return done(null,user);
    }else{
      return done(null,false,{message: 'Unknown Password'});
      
    }
      


  }catch(error){
    return done(error, false);  

  }


}));
