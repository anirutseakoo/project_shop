const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sizeSchema = new Schema({
    name : {type:String , uppercase: true},
    price :{type:Number},
    plus : {type:Number},
    product_id : Schema.Types.ObjectId,
    updated : { type: Date, default: Date.now }  
});
const sizeModel = mongoose.model('Size',sizeSchema );
module.exports = sizeModel;