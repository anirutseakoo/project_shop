const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    list_id : Schema.Types.ObjectId ,
    product_id : Schema.Types.ObjectId ,
    color_id  : Schema.Types.ObjectId ,
    size_id : Schema.Types.ObjectId ,
    user_id : Schema.Types.ObjectId ,
    stock_id : Schema.Types.ObjectId,
    qty : {type:Number},
    updated : { type: Date, default: Date.now }
 
});
const reportModel = mongoose.model('Report',reportSchema );
module.exports = reportModel;