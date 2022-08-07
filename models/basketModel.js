const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const basketSchema = new Schema({
    product_id : Schema.Types.ObjectId ,
    color_id  : Schema.Types.ObjectId ,
    size_id : Schema.Types.ObjectId ,
    user_id : Schema.Types.ObjectId ,
    stock_id : Schema.Types.ObjectId,
    qty : {type:Number} ,
    status : {type:Number},
    updated : {type: Date, default: Date.now }
});
const basketModel = mongoose.model('Basket',basketSchema );
module.exports = basketModel;