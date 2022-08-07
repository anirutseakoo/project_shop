const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typeSchema = new Schema({
    name : {type:String, unique: true},
    gender : {type:String },
    user_id : Schema.Types.ObjectId,
    updated : { type: Date, default: Date.now }  
});
const typeModel = mongoose.model('Type',typeSchema);
module.exports = typeModel;