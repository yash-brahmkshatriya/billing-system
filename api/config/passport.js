const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const config = require('./database');

const User = require('../models/user_schema');

module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = config.jwtsecret;
    opts.ignoreExpiration = false;
    passport.use(new JwtStrategy(opts,function(jwt_payload,done){
        User.findById(jwt_payload._id,function(err,user){
            if(err){return done(err,false);}
            if(user)done(null,user);
            else done(null,false);
        });
    }));
}