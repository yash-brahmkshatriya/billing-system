const mongoose = require('mongoose')

const bill_det = mongoose.Schema({
    user_id:{type:String,required:true},
    party_name:{type:String,required:true},
    // current bill det
    bill:{
        num:{type:Number,required:true},
        date:{type:Date,default:Date.now()}
    },
    // delivery challan
    dc:{
        num:{type:Number,required:true},
        date:{type:Date,default:Date.now()}
    },
    // purchase order
    po:{
        num:{type:Number,required:true},
        date:{type:Date,default:Date.now()}
    },
    items:[{
        description:{type:String,required:true},
        rate:{type:Number,required:true},
        qty:{type:Number,required:true},
        amt:{type:Number,required:true},
    }],
    grand_total:{type:Number,required:true},
    discountPct:{type:Number,required:true},
    cancelled:{type:Boolean,default:false},
    cancel_reason:{type:String}
})

module.exports = mongoose.model('Bills',bill_det)