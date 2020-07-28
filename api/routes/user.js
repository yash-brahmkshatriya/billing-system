const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport');
require('../config/passport')(passport);

const User = require('../models/user_schema')
const config = require('../config/database')

router.post('/register',(req,res,next)=>{
  User.findOne({email:req.body.email},(err,user_exists)=>{
    if(err){res.status(400).json(err)}
    else if(user_exists){res.status(222).json({"success":false,"message":"User already exists"})}
    else {
      var cuser = new User(req.body)
      cuser.setPassword(req.body.password)
      cuser.save().then(user =>{
        res.status(200).json({"success":true})
      })
      .catch(err => res.json({"success":false,"message":"Some Error Occurred. Please try again"}))
    }
  })
})

router.post('/login',(req,res,next) => {
  User.findOne({email:req.body.email},(err,user) => {
    if(err)next(err);
    if(!user){
      res.json({'message':'Invalid email or password'});
    } else {
      if(user.validPassword(req.body.password)){
        var token = jwt.sign({'_id':user._id},config.jwtsecret,{expiresIn:"1d"});
        res.json({'token':'JWT '+token});
      } else {
        res.json({'message':'Invalid email or password'});
      }
    }
  })
})

// update
router.get('/update',passport.authenticate('jwt',{session:false}),(req,res)=>{
  var user = getDecodedToken(req.headers);
  User.findById(user.id,(err,details)=>{
    if(err){res.status(400).json(err)}
    else {res.json(details)}
  })
})

router.put('/update',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
  var user = getDecodedToken(req.headers);
  User.findByIdAndUpdate(user._id,{$set:req.body},{useFindAndModify:false})
  .then(data => {
    res.json(data)
  })
  .catch(err => next(err))
})


router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next) => {
  var user = getDecodedToken(req.headers);
  User.findById(user._id)
  .then(data => res.json(data))
  .catch(err => next(err))
})

router.put('/changePwd',passport.authenticate('jwt',{session:false}),(req,res,next) => {
  var user_id = getDecodedToken(req.headers)._id;
  User.findById(user_id)
  .then(user => {
    if(user.validPassword(req.body.password)){
      user.setPassword(req.body.newpassword);
      User.findByIdAndUpdate(user_id,{$set:user},{useFindAndModify:false})
      .then(data => res.json({'success':true}))
      .catch(err => next(err))
    } else {
      res.json({'msg':'Entered Old Password is wrong'})
    }
  })
  .catch(err => next(err))
})

getToken = function(headers) {
  if(headers && headers.authorization){
    var parted = headers.authorization.split(' ');
    if(parted.length === 2){
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
}

getDecodedToken = function(headers) {
  var token = getToken(headers);
  var details = jwt.verify(token,config.jwtsecret);
  return details;
}

module.exports = router