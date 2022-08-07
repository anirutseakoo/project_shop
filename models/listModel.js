const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
    user_id : Schema.Types.ObjectId,
    address : {type:String},
    pay : {type: String},
    price : {type : Number},
    cost :  {type : Number},
    image_name : {type : String},
    status : {type:Number},
    detail : {type : String},
    date_after : { type: Date  },
    date_before: { type: Date,default: Date.now},
});
const listModel = mongoose.model('List',listSchema );
module.exports = listModel;