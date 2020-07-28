const mongoose = require('mongoose')
const crypto = require('crypto')

const user_det = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    pfname:{
        type:String,
        required:true
    },
    plname:{
        type:String,
        required:true
    },
    company_name:{
        type:String,
        required:true
    },
    phn_no:{
        type:String,
        required:true
    },
    address:{
        place_no:{
            type:String,
            required:true
        },
        street:{
            type:String,
        },
        locality:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        }
    },
    hash:String,
    salt:String
})

user_det.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64,`sha512`).toString('hex');
}

user_det.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password,this.salt,1000,64,`sha512`).toString('hex');
    return this.hash === hash;
}

module.exports = mongoose.model('USER',user_det)