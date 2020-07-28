const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user_schema');
// const { use } = require('passport');

// passport.use(new LocalStrategy({
//     usernameField: 'email'
//   },
//   function(username, password, done) {
//     User.findOne({ email: username }, function (err, user) {
//       if (err) { return done(err); }
//       // Return if user not found in database
//       if (!user) {
//         return done(null, false, {
//           message: 'User not found'
//         });
//       }
//       // Return if password is wrong
//       if (!user.validPassword(password)) {
//         return done(null, false, {
//           message: 'Password is wrong'
//         });
//       }
//       // If credentials are correct, return the user object
//       return done(null, user);
//     });
//   }
// ));

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({usernameField:'email'},(email,password,next)=>{
      User.findOne({email:email})
      .then(user => {
        if(!user){
          return next(null,false,{success:false,message:'Email not registered'})
        }
        if(user.validPassword(password)){
          return next(null,user)
        } else {
          return next(null,false,{success:false,message:"Password Incorrect"})
        }
      })
    })
  )
  passport.serializeUser((user,next)=>{
    next(null,user._id)
  })
  passport.deserializeUser((id,next)=>{
    User.findById(id,(err,user)=>{
      next(err,user)
    })
  })
}