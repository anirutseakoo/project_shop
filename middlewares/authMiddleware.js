const User = require('../models/userModel');
exports.isLoggedAll = async(req,res,next)=>{
    var user = req.user
    if(user){
        await User.findOne({_id:user._id},(err,data)=>{
            //console.log(data)
            if(data.role == 'admin'){
                res.redirect('/indexAdmin');
            }
             
        })
    }
    next()     
}
exports.isLoggedAdmin = async(req,res,next)=>{
    var user = req.user
    if(user){
        await User.findOne({_id:user._id},(err,data)=>{
             if(data.role == "admin"){
                 next();
             }else{
                res.redirect('/') 
             }
        })    
    }else{
        res.redirect('/')
    }
}
exports.isLoggedUser = async(req,res,next)=>{
    var user = req.user
    if(user){
        await User.findOne({_id:user._id},(err,data)=>{
             if(data.role == "user"){
                 next();
             }else{
                res.redirect('/') 
             }
        })    
    }else{
        res.redirect('/')
    }
}