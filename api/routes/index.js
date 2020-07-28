const express = require('express')
const router = express.Router()
const { ensureAuthenticated,forwardAuthenticated } = require('../config/auth')

router.get('/',forwardAuthenticated,(req,res)=>{
    res.send('jalsa')
})

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    // res.send('Its dashboard').json({
    //     cuser:req.user
    // })
    res.json({cuser:req.user})
    // res.send('Its dashboard')
})

module.exports = router