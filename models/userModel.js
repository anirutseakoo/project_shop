const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    //email password fname lname gender phone  address 
    email : { type : String , trim : true , unique: true},
    password : { type : String },
    image_name : { type : String },
    firstname : { type : String },
    lastname : { type : String },
    gender : { type : String },
    phone : { type : Number },
    address : { type : String },
    role : { type : String} ,
    updated: { type: Date, default: Date.now },
});

const userModel = mongoose.model('User',userSchema);
module.exports = userModel;