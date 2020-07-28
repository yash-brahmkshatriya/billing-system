const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport');
require('../config/passport')(passport);

const Bills = require('../models/bill_schema');
const config = require('../config/database');

// get all bills
router.get('/bills',passport.authenticate('jwt',{session:false}),(req,res,next) => {
  var user = getDecodedToken(req.headers);
  Bills.find({user_id:user._id})
  .then(data => res.json(data))
  .catch(err => next(err))
})

// get cancelled bills
router.get('/bills/:cancelled',passport.authenticate('jwt',{session:false}),(req,res,next) => {
  var user = getDecodedToken(req.headers);
  Bills.find({user_id:user._id,cancelled:req.params.cancelled})
  .then(data => res.json(data))
  .catch(err => next(err))
})

// no of bills for an account
router.get('/billcnt',passport.authenticate('jwt',{session:false}),(req,res,next) => {
  var user = getDecodedToken(req.headers);
  Bills.find({user_id:user._id})
  .then(data => res.json({"count":data.length}))
  .catch(err => next(err))
})

router.get('/lastbilldet',passport.authenticate('jwt',{session:false}),(req,res,next) => {
  var user = getDecodedToken(req.headers);
  Bills.find({'user_id':user._id},'bill dc')
  .then(data => {
    var dcno = 0,billno = 0;
    for(i=0;i<data.length;i++){
      if(data[i]['bill']['num']>billno){billno = data[i]['bill']['num']}
      if(data[i]['dc']['num']>dcno){dcno = data[i]['dc']['num']}
    }
    res.json(
      {
        "bill": {
          "num":billno+1,
          "date":null
        },
        "dc": {
          "num":dcno+1,
          "date":null
        }
      }
    )
  })
  .catch(err => next(err))
})

router.get('/nextbilldet/:bdate',passport.authenticate('jwt',{session:false}), (req,res,next) => {
  var user = getDecodedToken(req.headers);
  let bdate = new Date(req.params.bdate);
  let month = bdate.getMonth()+1;
  let year = bdate.getFullYear();
  let ldate,rdate;
  if(month>=4){
    ldate = new Date(year,3,1,5,30);
    rdate = new Date(year+1,3,1,5,29,59,999);
  }
  else {
    ldate = new Date(year-1,3,1,5,30);
    rdate = new Date(year,3,1,5,29,59,999);
  }
  Bills.find({
    'user_id':user._id,
    'bill.date':{
      $gte : ldate,
      $lte : rdate
    }
  },'bill dc')
  .then(data => {
    let billno=0,dcno=0;
    for(i=0;i<data.length;i++){
      if(data[i]['bill']['num']>billno){billno = data[i]['bill']['num']}
      if(data[i]['dc']['num']>dcno){dcno = data[i]['dc']['num']}
    }
    res.json({
      'billno':billno+1,
      'dcno':dcno+1
    })
  })
  .catch(err => next(err))
})

// create bill
router.post('/create',passport.authenticate('jwt',{session:false}),(req,res,next) => {
  var user = getDecodedToken(req.headers);
  req.body.user_id = user._id;
  var bill = new Bills(req.body)
  bill.save()
  .then(data => res.json(data))
  .catch(err => next(err))
})

// cancel bill
router.put('/cancel/:id',(req,res,next) => {
  let { cancelled,cancel_reason } = req.body;
  Bills.findByIdAndUpdate(
    req.params.id,
    {$set:{cancelled:cancelled,cancel_reason:cancel_reason}},
    {useFindAndModify:false}
  )
  .then(data => res.json(data))
  .catch(err => next(err))
})

// get particular bill
router.get('/:id',passport.authenticate('jwt',{session:false}),(req,res,next) => {
  Bills.findById(req.params.id)
  .then(data => res.json(data))
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