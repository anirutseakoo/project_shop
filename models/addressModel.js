const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    user_id :  Schema.Types.ObjectId,
    name: {type:String},
    phone: {type:Number},
    province: {type:String},
    district: {type:String},
    code: {type:Number},
    address: {type:String}
});
const addressModel = mongoose.model('Address',addressSchema );
module.exports = addressModel;