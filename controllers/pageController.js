//const mongoose = require('mongoose');
const Type = require('../models/typeModel');
const Product = require('../models/productModel');
const List = require("../models/listModel");
const Check = require("../models/checkModel");
const Report = require("../models/reportModel");
const ListProduct = require("../models/listProductModel");
const Stock = require('../models/stockModel');
const Size = require('../models/sizeModel');
const Basket = require('../models/basketModel');
const Color = require('../models/colorModel');
const User = require("../models/userModel");
const Address = require("../models/addressModel");
const ejs = require('ejs')
const path = require('path')
var Objectid = require('mongodb').ObjectID;
const moment = require("moment");

moment.locale('th');

exports.indexPage = async(req, res, next) =>{
    //console.log(mongoose)
    var n_product = await Product.find({}).sort({'updated': -1}).limit(4);
    var message = req.query.message
    if(req.user){
        var user = await User.findOne({_id : req.user._id});sfsd
    }
  
    res.render('shop/index' , { n_product ,  message , user });
}
exports.loginPage = async(req, res ,next) =>{
    var message = req.query.message
    if(req.user){
        var user = await User.findOne({_id : req.user._id});
    }
    res.render('shop/login',{user,message});
}
exports.registerPage  = async(req,res,next) =>{
    //console.log(req.query)
    if(req.user){
        var user = await User.findOne({_id : req.user._id});
    }
    var message = req.query.message
    res.render('shop/register',{user , message : message});
}
//member
exports.indexUser = (req,res,next)=>{
    res.render('indexUser');
}

//Admin
exports.indexAdmin = async(req,res,next)=>{
    var reports = await Report.aggregate([
        {
            "$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product"
            }
        },
        {
            $unwind : '$product'
        },
        {
            "$lookup": {
                "from": "sizes",
                "localField": "size_id",
                "foreignField": "_id",
                "as": "size"
            }
        },
        {
            $unwind : '$size'
        },
        {
            "$lookup": {
                "from": "colors",
                "localField": "color_id",
                "foreignField": "_id",
                "as": "color"
            }
        },
        {
            $unwind : '$color'
        }
      ]);
      let sum_price = 0 
      let sum_plus  = 0 
      let sum  = 0 
      let qty = 0
      await reports.forEach((report) => {
        sum_price = sum_price + (report.qty * report.size.price)
        sum_plus = sum_plus + (report.qty * report.size.plus)
        qty = qty + report.qty
       } )
       var message = req.query.message;
       sum = sum_plus - sum_price 
       res.render('indexAdmin' , {message,reports  , sum ,sum_plus,sum_price,qty});;
}
exports.adminType = async(req,res,next) =>{
    var message = req.query.message
    Type.aggregate([
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            $unwind : '$user'
        },
        {
            $sort: {  updated: -1 }
        }
    ]).exec((err,data)=>{
        if(err){return res.status(500),send(err)}
        
        res.render('adminType',{message : message , types : data , moment: moment});
        //  console.log(data)
    })
    // Type.find({},(err,data)=>{
    //     if(err){return res.status(500),send(err)}
    //     res.render('adminType',{message : message , types : data});
    // })
}
//admin product
exports.adminProduct = (req,res,next)=>{
    var message = req.query.message
    Product.aggregate([
        {
            "$lookup": {
                "from": "types",
                "localField": "type_id",
                "foreignField": "_id",
                "as": "type"
            }
        },
        {
            $unwind : '$type'
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            $unwind : '$user'
        },
        {
            $sort: {  updated: -1 }
        }
    ]).exec((err,data)=>{
        res.render('adminProduct',{message:message , products:data , moment:moment});
    })
  
}
exports.adminAdd = (req,res,next)=>{
    var message = req.query.message

    Type.find({},(err,data)=>{  
      if(err){return res.status(500),send(err)}
      res.render('adminProductAdd',{message : message ,types : data });
    })
}
exports.productStock = (req,res,next)=>{
    var message = req.query.message
    var product_id = req.query.product_id
    if(product_id == undefined || product_id == null){
        return res.redirect('/productAdmin');
    }
    Type.find({},(err,data)=>{
        if(err){throw err;}
        res.render('adminStock',{ message , product_id , types : data });    
    })

       
}
exports.stockInfo = (req,res,next) =>{
    //console.log(req.body)
    var product_id = req.body.product_id
    product_id = new Objectid(product_id);
    Stock.aggregate([
        {
            $match: { "product_id" : product_id } 
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            $unwind : '$user'
        },
        {
            "$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product"
            }
        },
        {
            $unwind : '$product'
        },
        {
            "$lookup": {
                "from": "types",
                "localField": "product.type_id",
                "foreignField": "_id",
                "as": "type"
            }
        },
        {
            $unwind : '$type'
        },
        {
            $sort: {  updated: -1 }
        }
    ]).exec((err,data)=>{
        if(!err){
            res.send(data)
        }
    })
}
exports.stockProduct = (req,res,next) =>{
    var product_id = req.body.product_id
    product_id = new Objectid(product_id);
    Product.aggregate([
        {
            $match: { "_id" : product_id } 
        },
        {
            "$lookup": {
                "from": "types",
                "localField": "type_id",
                "foreignField": "_id",
                "as": "type"
            }
        },
        {
            $unwind : '$type'
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            $unwind : '$user'
        }
    ]).exec((err,data)=>{
        if(!err){
            res.send(data)
        }
    })
}
exports.adminCount = (req,res,next) =>{
    var message = req.query.message
    res.render('adminCount',{message});  
}
exports.adminCountInfo = (req,res,next) =>{
    Stock.aggregate([
        {
            "$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product"
            }
        },
        {
            $unwind : '$product'
        } 
          
    ]).exec((err,data)=>{ 
        if(err){return res.status(500).send(err)}
        res.send(data);
    })
  
}

exports.adminCountInfo_filter = (req,res,next) =>{
    var  find_ = 0
    console.log(req.body)
    if(parseInt(req.body.num) !== 0){
        find_ = {$gt : 0, $lt : 10}
    }
    console.log(find_)
    Stock.aggregate([
        {
            $match: { "num" : find_ } 
        },
        {
            "$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product"
            }
        },
        {
            $unwind : '$product'
        } 
          
    ]).exec((err,data)=>{ 
        if(err){return res.status(500).send(err)}
        console.log(data)
        res.send(data);
    })
  
}
exports.stockOneInfo_image = (req,res,next)=>{
    //console.log(req.body)
    Color.findOne({product_id : req.body.product_id , name : req.body.color},(err,data)=>{
        if(err){
            return res.status(500).send(err)
        }
        //console.log(data)
        res.send(data.image_name)
    })
}
exports.showType = async(req,res,next) =>{
    var female = await Type.find({gender:"หญิง"})
    var man = await Type.find({gender:"ชาย"})
    var kid = await Type.find({gender:"เด็ก"})
    obj={
        female,
        man,
        kid
    }
    return res.send(obj)
}

exports.product_show_all = (req,res,next) => {
   Product.find({},(err,data)=>{
       if(err){
           return res.status(500).send(err);
       }
       res.send(data)
   })
}
exports.product_show_image = async(req,res,next) =>{
    //console.log(req.body)
    req.body.product = new Objectid(req.body.product);
    var plusA = await Size.findOne({product_id : req.body.product}).sort({'plus':'ascending'}).limit(1);
    var plusD = await Size.findOne({product_id : req.body.product}).sort({'plus':'descending'}).limit(1);
    Color.find({product_id : req.body.product},(err,data)=>{
        if(err){
            return res.status(500).send(err);
        }
        //console.log(data)
        res.send(obj = { data :data[0] , plusA , plusD});
    })
}
exports.product_show_new = (req,res,next) => {
    Product.find({}).sort({'updated': -1}).limit(8).exec((err,data)=>{
        if(err){
            return res.status(500).send(err);
        }
        res.send(data);
    })
 }
 exports.product_show_dee = async(req,res,next) => {
    var reports = await Report.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "product_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        }
        ,
        {
          $lookup: {
            from: "colors",
            localField: "color_id",
            foreignField: "_id",
            as: "color",
          },
        },
        {
          $unwind: "$color",
        }   ,
        {
          $lookup: {
            from: "sizes",
            localField: "size_id",
            foreignField: "_id",
            as: "size",
          },
        },
        {
          $unwind: "$size",
        },
        { 
            $sort: { "qty" : -1 } 
        },
        { $limit : 8 }    
      ])
     res.send(reports)
 }
exports.productAllv2 = (req,res,next) =>{
    res.render('indexAllv2');
}
exports.productNew = (req,res,next) =>{
    res.render('indexNew');
}
exports.productNew_show = (req,res,next) => {
    Product.find({}).sort({'updated': -1}).limit(10).exec((err,data)=>{
        if(err){
            return res.status(500).send(err);
        }
        res.send(data);
    })
 }
exports.product_type = (req,res,next) =>{
    res.render('indexType',{data:req.query.id})  
}
exports.productType_show = (req,res,next) =>{
    //console.log(req.body)
    Product.find({type_id:req.body.id_find}).sort({'updated': -1}).exec((err,data)=>{
        if(err){
            return res.status(500).send(err);
        }
        res.send(data);
        //console.log(data)
    })
}
exports.product_detail = (req,res,next) =>{
    //console.log(req.query.product_id)
    res.render('productDetail',{_id:req.query.product_id});
   
}
exports.product_detail_one = async(req,res,next) =>{
    req.body.product_id = new Objectid(req.body.product_id);
    var plusA = await Size.findOne({product_id : req.body.product_id}).sort({'plus':'ascending'}).limit(1);
    var plusD = await Size.findOne({product_id : req.body.product_id}).sort({'plus':'descending'}).limit(1);
    Product.aggregate([
        {
            $match: { "_id" : req.body.product_id } 
        },
        {
            "$lookup": {
                "from": "types",
                "localField": "type_id",
                "foreignField": "_id",
                "as": "type"
            }
        }
    ]).exec((err,product)=>{
        if(err){
            return res.status(500).send(err)
        }
        
        Color.find({product_id:req.body.product_id},(fail,color)=>{
            if(!fail){
                obj = {
                    product,color,plusA,plusD
                }
                return res.send(obj)
            }
        })    
    })
}
exports.product_detail_color = (req,res,next) => {
    req.body.product_id = new Objectid(req.body.product_id);
    Color.find({product_id:req.body.product_id},(err,data)=>{
        if(err){
            return res.status(500).send(err);
        }
        res.send(data);
    })
}
exports.product_detail_size = (req,res,next) => {
    req.body.product_id = new Objectid(req.body.product_id);
    Size.find({product_id:req.body.product_id},(err,data)=>{
        if(err){
            return res.status(500).send(err);
        }
        res.send(data);
    })
}

exports.show_stock_count = async(req,res,next) =>{
    //console.log(req.body)
    var size = await Size.findOne({
        name:req.body.size,
        product_id: req.body.product_id
    });
    req.body.product_id = new Objectid(req.body.product_id);
    await Stock.findOne({
        size:req.body.size, 
        color:req.body.color,
        product_id: req.body.product_id 
    },(err,data)=>{
        if(err){
            return res.status(500).send(err);
        }
        return res.send({data , size});
       
    })
}
exports.product_match_size =async(req,res,next) =>{
    //console.log(req.body)
    req.body.product_id = new Objectid(req.body.product_id);
    await Stock.find({
        size:req.body.size,
        product_id: req.body.product_id 
    },(err,data)=>{
        if(err){
            return res.status(500).send(err);
        }
        //console.log(data)
        return res.send(data);
    })
   
}
exports.product_match_color =async(req,res,next) =>{
    //console.log(req.body)
    req.body.product_id = new Objectid(req.body.product_id);
    await Stock.find({
        color:req.body.color,
        product_id: req.body.product_id 
    },(err,data)=>{
        if(err){
            return res.status(500).send(err);
        }
        //console.log(data)
        return res.send(data);
    })
   
}
exports.show_user = async(req,res,next) =>{
    //console.log(req.user._id)
    await User.findById({_id : req.user._id},(err,data)=>{
        if(err){
            return res.status(500).send(err);
        }
        //console.log(data)
        return res.send(data);
    })
    
}
exports.user_edit = (req,res,next) =>{
    //console.log(req.query);
    var message = req.query.message
    User.findOne({_id:req.query._id},(err,data)=>{
        if(err){
            return res.status(500).send(err);
        }
        //console.log(data)
        return res.render('userEdit',{data,message});
    })
}
exports.list = async(req,res,next) =>{
    if(req.user){
        var user = await User.findOne({_id : req.user._id});
    }
    res.render('shop/list',{user});
}
exports.detail = async(req,res,next) =>{
    if(req.user){
        var user = await User.findOne({_id : req.user._id});
    }
    res.render('shop/detail',{_id:req.query.product_id , user});
}

exports.change_user = async(req,res,next) =>{
    var message = req.query.message
    if(req.user){
        var user = await User.findOne({_id : req.user._id});
    }
    
    res.render('shop/change',{_id:req.query.product_id , user  , data:user , message});
}

exports.address = async(req,res,next) =>{
    var message = req.query.message;
    var user = undefined;
    if (req.user) {
      user = await User.findOne({ _id: req.user._id });
    }
    var address = await Address.find({ user_id: req.user._id });
    res.render("shop/address", { user, message, address });
}
exports.basket = async(req,res,next) =>{
    var message = req.query.message;
    req.user._id = new Objectid(req.user._id);
    var baskets = await Basket.aggregate([
        {
            $match: { user_id: req.user._id },
          },
        {
            "$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product"
            }
        },
        {
            $unwind : '$product'
        },
        {
            "$lookup": {
                "from": "colors",
                "localField": "color_id",
                "foreignField": "_id",
                "as": "color"
            }
        },
        {
            $unwind : '$color'
        },
        {
            "$lookup": {
                "from": "sizes",
                "localField": "size_id",
                "foreignField": "_id",
                "as": "size"
            }
        },
        {
            $unwind : '$size'
        },
        {
            "$lookup": {
                "from": "stocks",
                "localField": "stock_id",
                "foreignField": "_id",
                "as": "stock"
            }
        },
        {
            $unwind : '$stock'
        }
        
        
    ])
    var user = undefined;
    if (req.user) {
      user = await User.findOne({ _id: req.user._id });
    }
    
    //console.log(baskets)
    res.render("shop/basket", { user, message , baskets});
}


exports.basket_status = async (req, res) => {
    Basket.findByIdAndUpdate(
      {
        _id: req.body._id,
      },
      {
        status: req.body.status,
      },
      (err, data) => {
        if (err) {
          return res.send(err);
        } else {
          return res.send({ message: "success" });
        }
      }
    );
  };
  exports.basket_qty = async (req, res) => {
 
    Basket.findByIdAndUpdate(
      {
        _id: req.body.basket_id,
      },
      {
        qty: req.body.qty,
      },
      (err, data) => {
        if (err) {
          return res.send(err);
        } else {
          return res.send({ message: "success" });
        }
      }
    );
  };

  exports.basket_delete = async (req, res, next) => {
    Basket.findByIdAndDelete(
      {
        _id: req.query._id,
      },
      (err, data) => {
        if (err) {
          return res.send(err);
        } else {
          res.redirect("/basket?message=deleted");
        }
      }
    );
  };

  exports.basket_sum = async (req, res, next) => {
      console.log('-----------------------------')
    req.user._id = new Objectid(req.user._id);
    var baskets = await Basket.aggregate([
      {
        $match: { $and: [{ user_id: req.user._id }, { status: 1 }] },
      },
      {
        $lookup: {
          from: "sizes",
          localField: "size_id",
          foreignField: "_id",
          as: "size",
        },
      },
      {
        $unwind: "$size",
      },
    ]);
    let sum = 0;
    let qty = 0
    let cost = 0;
    let sum_all = 0
    //console.log(baskets)
    await baskets.forEach((basket) => (sum = sum + basket.qty * basket.size.plus));
    await baskets.forEach((basket) => (qty = qty + basket.qty ));

    if(qty < 11){
        cost = 50
    }else if(qty < 21){
        cost = 80
    }else{
        cost = 110
    }
    sum_all = sum + cost
    //console.log(sum)
    return res.send({sum:sum , cost , qty , sum_all});
  };

  exports.pay = async(req,res,next) =>{
    var message = req.query.message;
    req.user._id = new Objectid(req.user._id);
    var baskets = await Basket.aggregate([
        {
            $match: { $and: [{ user_id: req.user._id }, { status: 1 }] },
          },
        {
            "$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product"
            }
        },
        {
            $unwind : '$product'
        },
        {
            "$lookup": {
                "from": "colors",
                "localField": "color_id",
                "foreignField": "_id",
                "as": "color"
            }
        },
        {
            $unwind : '$color'
        },
        {
            "$lookup": {
                "from": "sizes",
                "localField": "size_id",
                "foreignField": "_id",
                "as": "size"
            }
        },
        {
            $unwind : '$size'
        },
        {
            "$lookup": {
                "from": "stocks",
                "localField": "stock_id",
                "foreignField": "_id",
                "as": "stock"
            }
        },
        {
            $unwind : '$stock'
        }
        
        
    ])
    var user = undefined;
    if (req.user) {
      user = await User.findOne({ _id: req.user._id });
    }
    var address = await Address.find({user_id:req.user._id});
    //console.log(baskets)
    res.render("shop/pay", { user, message , baskets , address});
}
exports.paid = async(req,res) =>{
    var message = req.query.message;
    var user = undefined;
    if (req.user) {
        user = await User.findOne({ _id: req.user._id });
    }
    req.user._id = new Objectid(req.user._id);
    var lists = await List.aggregate([
        {
        $match: { $and: [{ user_id: req.user._id }, { status: 0 }] },     
        }
    ]);
    res.render('shop/paid' , {message , user , lists , moment});
}
exports.wait= async(req,res) =>{
    var message = req.query.message;
    var user = undefined;
    if (req.user) {
        user = await User.findOne({ _id: req.user._id });
    }
    req.user._id = new Objectid(req.user._id);
    var lists = await List.aggregate([
        {
        $match: { $and: [{ user_id: req.user._id }, { status: 1 }] },     
        }
    ]);
    res.render('shop/wait' , {message , user , lists , moment});
}
exports.send= async(req,res) =>{
    var message = req.query.message;
    var user = undefined;
    if (req.user) {
        user = await User.findOne({ _id: req.user._id });
    }
    req.user._id = new Objectid(req.user._id);
    var lists = await List.aggregate([
        {
        $match: { $and: [{ user_id: req.user._id }, { status: 2 }] },     
        }
    ]);
    res.render('shop/send' , {message , user , lists , moment});
}
exports.done= async(req,res) =>{
    var message = req.query.message;
    var user = undefined;
    if (req.user) {
        user = await User.findOne({ _id: req.user._id });
    }
    req.user._id = new Objectid(req.user._id);
    var lists = await List.aggregate([
        {
        $match: { $and: [{ user_id: req.user._id }, { status: 3 }] },     
        }
    ]);
    res.render('shop/done' , {message , user , lists , moment});
}
exports.cancel= async(req,res) =>{
    var message = req.query.message;
    var user = undefined;
    if (req.user) {
        user = await User.findOne({ _id: req.user._id });
    }
    req.user._id = new Objectid(req.user._id);
    var lists = await List.aggregate([
        {
        $match: { $and: [{ user_id: req.user._id }, { status: 4 }] },     
        }
    ]);
    res.render('shop/cancel' , {message , user , lists , moment});
}
exports.send= async(req,res) =>{
    var message = req.query.message;
    var user = undefined;
    if (req.user) {
        user = await User.findOne({ _id: req.user._id });
    }
    req.user._id = new Objectid(req.user._id);
    var lists = await List.aggregate([
        {
        $match: { $and: [{ user_id: req.user._id }, { status: 2 }] },     
        }
    ]);
    res.render('shop/send' , {message , user , lists , moment});
}
exports.admin_paid = async(req,res)=>{
    var message = req.query.message;
    var lists = await List.aggregate([
        {
        $match: { status: 1 } 
        } ,
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            $unwind : '$user'
        },  
    ]);
    res.render('admin_paid' , {message  , lists , moment});;
}
exports.admin_send = async(req,res)=>{
    var message = req.query.message;
    var lists = await List.aggregate([
        {
        $match: { status: 2 } 
        } ,
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            $unwind : '$user'
        },  
    ]);
    res.render('admin_send' , {message  , lists , moment});;
}
exports.admin_success = async(req,res)=>{
    var message = req.query.message;
    var lists = await List.aggregate([
        {
        $match: { status: 3 } 
        } ,
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            $unwind : '$user'
        },  
    ]);
    res.render('admin_success' , {message  , lists , moment});;
}

exports.admin_cancel = async(req,res)=>{
    var message = req.query.message;
    var lists = await List.aggregate([
        {
        $match: { status: 4 } 
        } ,
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            $unwind : '$user'
        },  
    ]);
    res.render('admin_cancel' , {message  , lists , moment});;
}

exports.report = async(req,res) => {
    var reports = await Report.aggregate([
        {
            "$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product"
            }
        },
        {
            $unwind : '$product'
        },
        {
            "$lookup": {
                "from": "sizes",
                "localField": "size_id",
                "foreignField": "_id",
                "as": "size"
            }
        },
        {
            $unwind : '$size'
        },
        {
            "$lookup": {
                "from": "colors",
                "localField": "color_id",
                "foreignField": "_id",
                "as": "color"
            }
        },
        {
            $unwind : '$color'
        }
      ]);
      let sum_price = 0 
      let sum_plus  = 0 
      let sum  = 0 
      let qty = 0
      await reports.forEach((report) => {
        sum_price = sum_price + (report.qty * report.size.price)
        sum_plus = sum_plus + (report.qty * report.size.plus)
        qty = qty + report.qty
       } )
       var message = req.query.message;
       sum = sum_plus - sum_price 
       res.render('report' , {message,reports  , sum ,sum_plus,sum_price,qty});;
}

exports.manage = async(req,res)=>{
    var message = req.query.message
    User.find({role:'user'},(err,data)=>{
        if(err){
            return res.send(err)
        }else{
            res.render('manage',{users:data , message});
        }
    })
}
exports.delete_user = async(req,res)=>{
    User.findByIdAndUpdate(
        {
            _id:req.query._id
        },{
            role : "ban"
        },((err,data)=>{
            if(err){
                return res.send(err)
            }else{
             res.redirect('/manage?message=deleted');
            }
        })
    )
   
}

exports.check =  async(request, response) => {

    var check = await Check.findOne({user_id : request.user._id});
    console.log(check)
    check.list_id = new Objectid(check.list_id );
    var product = await ListProduct.aggregate([
        {
            $match: { list_id: check.list_id } 
        } ,
        {
            "$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product"
            }
        },
        {
            $unwind : '$product'
        },
        {
            "$lookup": {
                "from": "sizes",
                "localField": "size_id",
                "foreignField": "_id",
                "as": "size"
            }
        },
        {
            $unwind : '$size'
        },
        {
            "$lookup": {
                "from": "colors",
                "localField": "color_id",
                "foreignField": "_id",
                "as": "color"
            }
        },
        {
            $unwind : '$color'
        }
      ]);
    console.log(product)
    const filePath = path.join(__dirname  ,'../views/print',"print.ejs")
    ejs.renderFile(filePath, { check , product }, (err, html) => {
        if(err) {
            return response.send(err)
        }
    
        // enviar para o navegador
        return response.send(html)
    })
   
}