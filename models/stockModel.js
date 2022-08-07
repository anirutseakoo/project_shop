const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema({
    image_name : {type:String },
    product_id : Schema.Types.ObjectId,
    user_id : Schema.Types.ObjectId,
    size : { type:String },
    color : { type:String },
    num : { type : Number },
    updated : { type: Date, default: Date.now }  
});
const stockModel = mongoose.model('Stock',stockSchema);
module.exports = stockModel;