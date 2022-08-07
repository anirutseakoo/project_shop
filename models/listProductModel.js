const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListProductSchema = new Schema({
    list_id : Schema.Types.ObjectId ,
    product_id : Schema.Types.ObjectId ,
    color_id  : Schema.Types.ObjectId ,
    size_id : Schema.Types.ObjectId ,
    user_id : Schema.Types.ObjectId ,
    stock_id : Schema.Types.ObjectId,
    qty : {type:Number} 
});
const ListProductModel = mongoose.model('ListProduct',ListProductSchema );
module.exports = ListProductModel;