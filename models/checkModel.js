const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkSchema = new Schema({
    list_id : Schema.Types.ObjectId ,
    user_id : Schema.Types.ObjectId ,
    cost : {type:Number},
    updated : {type: Date }
});
const checkModel = mongoose.model('Check',checkSchema );
module.exports = checkModel;