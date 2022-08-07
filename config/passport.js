const bcrypt = require('bcrypt'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      User = require('../models/userModel');

    passport.use(new LocalStrategy((username, password, done) => {
        console.log(username)
        User.findOne({email:username}).then(function(user){
            if(!user || !bcrypt.compareSync(password, user.password)){
              return done(null, false, {errors: {'email or password': 'is invalid'}})
            }
          return done(null, user)
        }).catch(done)
    }))
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
      
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });