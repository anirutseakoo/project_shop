const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name : {type:String , unique: true},
    gender : {type : String},
    type_id : Schema.Types.ObjectId,
    user_id : Schema.Types.ObjectId,
  
    detail : {type : String},
    updated : { type: Date, default: Date.now }  
});
const productModel = mongoose.model('Product',productSchema);
module.exports = productModel;