const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const colorSchema = new Schema({
    name : {type:String},
    image_name : {type:String},
    product_id : Schema.Types.ObjectId,
    updated : { type: Date, default: Date.now }  
});
const colorModel = mongoose.model('Color',colorSchema );
module.exports = colorModel;