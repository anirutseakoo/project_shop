const User = require("../models/userModel");
const Type = require("../models/typeModel");
const Product = require("../models/productModel");
const Report = require("../models/reportModel");
const Address = require("../models/addressModel");
const Basket = require("../models/basketModel");
const Stock = require("../models/stockModel");
const Color = require("../models/colorModel");
const Check = require("../models/checkModel");
const Size = require("../models/sizeModel");
const List = require("../models/listModel");
const ListProduct = require("../models/listProductModel");
const fs = require("fs");
const bcrypt = require("bcrypt");
const moment = require("moment");
var Objectid = require("mongodb").ObjectID;

exports.login = (req, res, next) => {
  //console.log(req.user)
  if (req.user.role == "user") {
    return res.redirect("/");
  }
  if (req.user.role == "admin") {
    return res.redirect("/indexAdmin");
  }
  if (req.user.role == "ban") {
    req.logout();
    return res.redirect("/login?message=ban");
  }
  //console.log(req.body)
  //console.log(req.user)
};
exports.insertUser = async (req, res, next) => {
  //console.log(req.body)
  if (
    req.body.email == "" ||
    req.body.password == "" ||
    req.body.firstname == "" ||
    req.body.lastname == "" ||
    req.body.gender == "" ||
    req.body.phone == "" ||
    req.body.address == ""
  ) {
    return res.redirect("/login?message=null");
  }
  const checkEmail = await User.findOne({ email: req.body.email });
  //console.log(checkEmail)
  if (checkEmail !== null) {
    return res.redirect("/login?message=haveEmail");
  }

  const passwordHash = bcrypt.hashSync(req.body.password, 10);
  var obj = {
    email: req.body.email,
    password: passwordHash,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender,
    phone: req.body.phone,
    address: req.body.address,
    role: "user",
    image_name : ''
  };
  User.insertMany(obj, (err, data) => {
    if (err) res.status(500).send(err);
    return res.redirect("/login?message=login");
  });
};
exports.typeInsert = async (req, res, next) => {
  if (req.body.type == "" || req.body.gender == "") {
    return res.redirect("/typeAdmin?message=null");
  }
  var checkType = await Type.findOne({ name: req.body.type });

  if (checkType !== null) {
    return res.redirect("/typeAdmin?message=haveType");
  }

  var obj = {
    name: req.body.type,
    user_id: req.user._id,
    gender :req.body.gender
  };

  Type.insertMany(obj, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.redirect("/typeAdmin?message=success");
  });
};
exports.typeDelete = async (req, res, next) => {
  //console.log(req.params)
  var checkProduct = await Product.find({ type_id: req.params.id });
  if (checkProduct.length > 0) {
    return res.redirect("/typeAdmin?message=haveProduct");
  }
  //console.log(checkProduct.length)
  Type.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
    if (err) throw err;
    return res.redirect("/typeAdmin?message=deleted");
  });
};
exports.typeInfo = (req, res, next) => {
  //console.log(req.params.id)
  Type.findOne({ _id: req.params.id }, (err, data) => {
    if (err) throw err;
    return res.send(data);
  });
};
exports.typeEdit = async (req, res, next) => {
  //console.log(req.body)
  if (req.body.typeName == "" || req.body.typeGender == "") {
    return res.redirect("/typeAdmin?message=null");
  }
  // var checkName = await Type.findOne({ name: req.body.typeName });
  // if (checkName !== null) {
  //   return res.redirect("/typeAdmin?message=duplicate");
  // }
  var obj = {
    name: req.body.typeName,
    user_id: req.user._id,
    gender : req.body.typeGender,
    updated: new Date(Date.now()).toISOString(),
  };
  Type.findByIdAndUpdate({ _id: req.body.typeId }, obj, (err, data) => {
    if (err) {
      return res.redirect("/typeAdmin?message=duplicate");
    }
    res.redirect("/typeAdmin?message=updated");
  });
};
exports.productInsert = async (req, res, next) => {
  //console.log(req.body)
  if (
    req.body.name == "" ||
  
    req.body.detail == ""
  ) {
    return res.redirect("/productAdd?message=error");
  }
  const checkName = await Product.findOne({ name: req.body.name });
  if (checkName !== null) {
    return res.redirect("/productAdd?message=duplicate");
  }
  var obj = {
    name: req.body.name,
   
    detail: req.body.detail,
    type_id: req.body.type_id,
    user_id: req.user._id,
  };
  Product.insertMany(obj, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    //console.log(data[0]._id);
    var product_id = data[0]._id;
    res.redirect("/productStock?product_id=" + product_id);
  });
};
exports.stockInsert = async (req, res, next) => {
  console.log(req.body)
  //console.log(req.file)
  if (

    req.body.product_id == "" ||
    req.body.size == "" ||
    req.body.color == "" ||
    req.body.num == ""
  ) {
    return res.status(500).send("err");
  }
  const checkStock = await Stock.findOne({
    size: req.body.size,
    color: req.body.color,
    product_id: req.body.product_id,
  });
  if (checkStock !== null) {
    return res.redirect(
      `/productStock?product_id=${req.body.product_id}&message=duplicate`
    );
  } else {
    var obj = {
      product_id: req.body.product_id,
      user_id: req.user._id,
      size: req.body.size,
      color: req.body.color,
      num: req.body.num,
    };
    Stock.insertMany(obj, (err, data) => {
      if (err) {
        return res.status.send(err);
      }
      res.redirect(
        `/productStock?product_id=${req.body.product_id}&message=success`
      );
    });
  }
};
exports.productEdit = async (req, res, next) => {
  if (
    req.body.name == "" ||
   
    req.body.detail == ""
  ) {
    return res.redirect(
      `/productStock?product_id=${req.body.editId}&message=null`
    );
  }
  var checkName = await Product.findOne({ name: req.body.name });
  if (checkName == null) {
    checkName = {
      name: "",
    };
  }
  //console.log(checkName)

  //console.log(req.body.name)
  if (checkName == null || req.body.name == checkName.name) {
    var obj = {
      name: req.body.name,
     
      detail: req.body.detail,
      type_id: req.body.type_id,
      user_id: req.user._id,
      updated: new Date(Date.now()).toISOString(),
    };
    var product_id = req.body.editId;
    product_id = new Objectid(product_id);
    Product.findByIdAndUpdate({ _id: product_id }, obj, (err, data) => {
      if (err) {
        return res.redirect(
          `/productStock?product_id=${req.body.editId}&message=duplicate`
        );
      }
      res.redirect(
        `/productStock?product_id=${req.body.editId}&message=success`
      );
    });
  } else {
    return res.redirect(
      `/productStock?product_id=${req.body.editId}&message=duplicate`
    );
  }
};
exports.stockDelete = (req, res, next) => {
  //console.log(req.params.id)
  Stock.findByIdAndDelete({ _id: req.params.id }, (err, stockOne) => {
    if(err){
      return res.status(500).send(err)
    }
    return res.redirect(
      `/productStock?product_id=${stockOne.product_id}&message=success`
    );
  });
};
exports.stockOneInfo = (req, res, next) => {
  Stock.findOne({ _id: req.body._id }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    res.send(data);
  });
};
exports.stockEdit = async (req, res, next) => {

 var checkStock_id = await Stock.findOne({ _id: req.body.Eid })
 if((checkStock_id.product_id == req.body.Eproduct)){
    var checkStock = await Stock.findOne({
      size: req.body.Esize,
      color: req.body.Ecolor,
      product_id : req.body.Eproduct
    });
    console.log(checkStock)
    var obj = {
      size: req.body.Esize,
      color: req.body.Ecolor,
      num: req.body.Enum,
    };


  if (checkStock == null) {
    //console.log('1')
    Stock.findByIdAndUpdate({ _id: req.body.Eid }, obj, (err, data) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect(
        `/productStock?product_id=${data.product_id}&message=updated`
      );
    });
  } else {
    //console.log(checkStock.size)
    //console.log(req.body.Esize)
    if (req.body.Eid == checkStock._id) {
      if (
        checkStock.size == req.body.Esize ||
        checkStock.color == req.body.Ecolor
      ) {
        Stock.findByIdAndUpdate({ _id: req.body.Eid }, obj, (err, data) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.redirect(
            `/productStock?product_id=${data.product_id}&message=updated`
          );
        });
      } else {
        Stock.findOne({ _id: req.body.Eid }, (err, data) => {
          if (err) {
            return res.status(500).send(err);
          }
          return res.redirect(
            `/productStock?product_id=${data.product_id}&message=duplicate`
          );
        });
      }
    } else {
      if (
        checkStock.size !== req.body.Esize ||
        checkStock.color !== req.body.Ecolor
      ) {
        Stock.findByIdAndUpdate({ _id: req.body.Eid }, obj, (err, data) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.redirect(
            `/productStock?product_id=${data.product_id}&message=updated`
          );
        });
      } else {
        Stock.findOne({ _id: req.body.Eid }, (err, data) => {
          if (err) {
            return res.status(500).send(err);
          }
          return res.redirect(
            `/productStock?product_id=${data.product_id}&message=duplicate`
          );
        });
      }
    }
  }
  
 }

};
exports.editImageStock = (req, res, next) => {
  //console.log(req.file)
  //console.log(req.query)
  Stock.findOne({ _id: req.query.id }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    fs.unlink(process.env.Path_upload + data.image_name, (err) => {
      if (err) {
        console.log("failed to delete local image:" + err);
      } else {
        Stock.findByIdAndUpdate(
          { _id: req.query.id },
          { image_name: req.file.filename },
          (err, data) => {
            if (err) {
              res.status(500).send(err);
            }
            res.send(data.product_id);
          }
        );
      }
    });
  });
};
exports.stockDeleteCount = (req, res, next) => {
  Stock.findByIdAndDelete({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    if (data) {
      return res.redirect(`/adminCount?message=success`);
    }
  });
};
exports.stockEditCount = async (req, res, next) => {
  console.log(req.body);
  await Stock.findOne({ _id: req.body.Eid }, (err, id) => {
    if (err) {
      return res.status(500).send(err);
    }
    //console.log(id)
    var checkStock = Stock.findOne({
      size: req.body.Esize,
      color: req.body.Ecolor,
      product_id: id.product_id,
    });
  });
  console.log(checkStock);
  var obj = {
    size: req.body.Esize,
    color: req.body.Ecolor,
    num: req.body.Enum,
  };
  /*
    if (checkStock == null) {
        //console.log('1')
        Stock.findByIdAndUpdate({ _id: req.body.Eid }, obj, (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect(`/adminCount?message=updated`);
        });
    } else {
        //console.log(checkStock.size)
        //console.log(req.body.Esize)
        if (req.body.Eid == checkStock._id) {
        if (
            checkStock.size == req.body.Esize ||
            checkStock.color == req.body.Ecolor
        ) {
            Stock.findByIdAndUpdate({ _id: req.body.Eid }, obj, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect(`/adminCount?message=updated`);
            });
        } else {
            Stock.findOne({ _id: req.body.Eid }, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.redirect(`/adminCount?message=duplicate`);
            });
        }
        } else {
        if (
            checkStock.size !== req.body.Esize ||
            checkStock.color !== req.body.Ecolor
        ) {
            Stock.findByIdAndUpdate({ _id: req.body.Eid }, obj, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect(`/adminCount?message=updated`);
            });
        } else {
            Stock.findOne({ _id: req.body.Eid }, (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.redirect(`/adminCount?message=duplicate`);
            });
        }
        }
    }*/
};
exports.stockAdd = (req, res, next) => {
  console.log(req.body)
  if (req.body.num == "" || req.body._id == "") {
    return res.redirect("/adminCount?message=null");
  }
  Stock.findByIdAndUpdate(
    { _id: req.body._id },
    { num: req.body.num },
    (err, data) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(data);
    }
  );
};
exports.productDeleteAll = async (req, res, next) => {
  const id =req.body.id;
  //console.log(id)
  await Product.findByIdAndDelete({ _id: id }, (err, data) => {
    if (err) {
      return res.status.send(err);
    }
    Size.deleteMany({ product_id: id },(err,data)=>{
      if (err) {
        return res.status.send(err);
      }
    })
  
  });
  await Color.find({ product_id: id }, (err, data) => {
    //console.log(data)
    data.forEach((element) => {
      fs.unlink(process.env.Path_upload + element.image_name, (err) => {
        if (err) {
          console.log("failed to delete local image:" + err);
        } 
      });
    });
  });
  await Stock.deleteMany({ product_id: id }, (err, data) => {
    if (err) {
      return res.status.send(err);
    }
   
  })
 
  await Color.deleteMany({ product_id: id }, (err, data) => {
    if (err) {
      return res.status.send(err);
    }
     return res.send({ message: "success" });
  })
 
};
exports.insert_color = async(req,res,next) =>{
  console.log(req.query)
  console.log(req.file)
  
  var obj ={
    name:req.query.color,
    product_id:req.query.product_id,
    image_name : req.file.filename
  }
  var check_color = await  Color.findOne({ name:req.query.color,product_id:req.query.product_id});
  if(check_color == null){
    Color.insertMany(obj,(err,data)=>{
      if(err){
        return res.send('err')
      }
      res.send(data)
    })
  }else{
    fs.unlink(process.env.Path_upload + req.file.filename, (err) => {
      if (err) {
        console.log("failed to delete local image:" + err);
      } else {
        return res.send('err')
      }
    });
    
  }
  
}
exports.show_color = (req,res,next)=>{
  //console.log(req.body.product_id)
  Color.find({product_id:req.body.product_id}).exec((err,data)=>{
    if(err){
      return res.status(500).send(err)
    }
    //console.log(data)
    res.send(data)
  })
}

exports.insert_size = async(req,res,next) =>{
 // console.log(req.body)


  var obj ={
    name:req.body.size,
    product_id:req.body.product_id,
    plus : req.body.plus,
    price : req.body.price
  }
  
  var check_size = await Size.findOne({
    name:req.body.size,
    product_id:req.body.product_id
  })
  if(check_size == null){
    Size.insertMany(obj,(err,data)=>{
      if(err){
        return res.send('err')
      }
      return res.send(data)
    })
  }else{
    return res.send('err')
  }
 

}
exports.show_size = (req,res,next)=>{
  //console.log(req.body.product_id)
  Size.find({product_id:req.body.product_id}).exec((err,data)=>{
    if(err){
      return res.status(500).send(err)
    }
    //console.log(data)
    res.send(data)
  })
}
exports.delete_size = async(req,res,next)=>{
  //console.log(req.body.id)
  var check_size = await Stock.findOne({size:req.body.name,product_id:req.body.product_id});
  if(check_size == null){
    Size.findByIdAndDelete({_id:req.body.id},(err,data)=>{
      if(err){
        return res.status(500).send(err)
      }
      //console.log(data)
      res.send(data)
      
    })
  }else{
    return res.send('err')
  }
  
}
exports.delete_color = async(req,res,next)=>{
  //console.log(req.body.id)
  var check_color = await Stock.findOne({color:req.body.name,product_id:req.body.product_id});
  if(check_color == null){
    Color.findByIdAndDelete({_id:req.body.id},(err,data)=>{
      if(err){
        return res.status(500).send(err)
      }
      fs.unlink(process.env.Path_upload + data.image_name, (err) => {
        if (err) {
          console.log("failed to delete local image:" + err);
        } else {
          res.send(data)
        }
      });
      //console.log(data)
      
      
    })
  }else{
    return res.send('err')
  }
  
}
exports.edit_colorImage = (req,res,next) => {
  //console.log(req.query);
  //console.log(req.file);
  Color.findOne({ _id: req.query._id }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    fs.unlink(process.env.Path_upload + data.image_name, (err) => {
      if (err) {
        console.log("failed to delete local image:" + err);
      } else {
        Color.findByIdAndUpdate(
          { _id: req.query._id },
          { image_name: req.file.filename },
          (err, data) => {
            if (err) {
              res.status(500).send(err);
            }
            //console.log(data)
            res.send({message:"success"});
          }
        );
      }
    });
  });

}
exports.check_edit_color = (req,res,next) =>{
  Stock.findOne({product_id:req.body.product_id , color :req.body.color},(err,data)=>{
    if (err) {
      res.status(500).send(err);
    }
    res.send(data)
  })
}
exports.check_edit_size = (req,res,next) =>{
  Stock.findOne({product_id:req.body.product_id , size :req.body.size},(err,data)=>{
    if (err) {
      res.status(500).send(err);
    }
    res.send(data)
  })
}
exports.edit_color = async(req,res,next)=>{
  //console.log(req.body)
  var check_color = await Color.findOne({name:req.body.name,product_id:req.body.product_id});
  if(check_color == null){
    Color.findByIdAndUpdate({_id:req.body._id},{name:req.body.name},(err,data)=>{
      if (err) {
        res.status(500).send(err);
      }
      //console.log(data)
      res.send({message:"success"});
    })
  }else{
    return res.send('err')
  }
 
}
exports.edit_size = async(req,res,next)=>{
  //console.log(req.body)
  var check_size = await Size.findOne({name:req.body.name.toUpperCase(),product_id:req.body.product_id});
  console.log(check_size)
  if(check_size == null){
    Size.findByIdAndUpdate({_id:req.body._id},{
      name:req.body.name , 
      plus:req.body.plus ,
      price:req.body.price
     },(err,data)=>{
      if (err) {
        res.status(500).send(err);
      }
      //console.log(data)
      res.send({message:"success"});
    })
  }else{
    var check_size_ = await Size.findOne({product_id:req.body.product_id});
    if(check_size_ == null){
      return res.send('err')
    }else{
      Size.findByIdAndUpdate({_id:req.body._id},{
     
        plus:req.body.plus ,
        price:req.body.price
       },(err,data)=>{
        if (err) {
          res.status(500).send(err);
        }else{
          res.send({message:"success"});
        }
        //console.log(data)
       
      })
    }
   
  }
 
}
exports.user_edit = async(req,res,next) =>{
  console.log(req.body)
  var check_user = await User.findOne({_id:req.query._id})
  if(check_user.email == req.body.email){
    User.findByIdAndUpdate({_id:req.query._id},req.body,(err,data)=>{
      if (err) {
        res.status(500).send(err);
      }
      //console.log(data)
      res.redirect(`/change_user?message=success`)

    })
  }else{
    var check_email = await User.findOne({email:req.body.email});
    //console.log(check_email)
    if(check_email == null){
      User.findByIdAndUpdate({_id:req.query._id},req.body,(err,data)=>{
        if (err) {
          res.status(500).send(err);
        }
        //console.log(data)
        res.redirect(`/change_user?message=success`)
      })
    }else{

      User.findByIdAndUpdate({_id:req.query._id},obj = {
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        gender : req.body.gender,
        phone : req.body.phone,
        address : req.body.address
      },(err,data)=>{
        if (err) {
          res.status(500).send(err);
        }
        //console.log(data)
        res.redirect(`/change_user?message=success_nomail`)
      })
    }
  }
}
exports.edit_userImage = async(req,res,next) =>{
  //console.log(req.file.filename)
  //console.log(req.query)
  var check_image = await User.findOne({_id:req.query._id});
  //console.log(check_image)
  //console.log(check_image.image_name)
  if(check_image.image_name == ''){
    User.findByIdAndUpdate({_id:req.query._id},{image_name : req.file.filename},(err,data)=>{
      if (err) {
        return res.status(500).send(err);
      }
      res.send({message:"success"})
    })
  }else{
    fs.unlink(process.env.Path_upload + check_image.image_name, (err) => {
      if (err) {
        console.log("failed to delete local image:" + err);
      } else {
        User.findByIdAndUpdate({_id:req.query._id},{image_name : req.file.filename},(err,data)=>{
          if (err) {
            return res.status(500).send(err);
          }
          res.send({message:"success"})
        })
      }
    });
  }
}
exports.edit_password = async(req,res,next)=>{
  //console.log(req.query)
  if(req.body.old_password == '' || req.body.new_password == '' || req.body.con_password == ''){
    res.redirect(`/change_user?message=null`)
    //console.log('null')
  }else{
    if(req.body.new_password == req.body.con_password){
      User.findOne({_id:req.query._id},(err,data)=>{
        if (err) {
          res.status(500).send(err);
        }
       
        console.log(bcrypt.compareSync(req.body.old_password, data.password))
        if(bcrypt.compareSync(req.body.old_password, data.password) ){
          const passwordHash = bcrypt.hashSync(req.body.new_password, 10);
          User.findByIdAndUpdate({_id:req.query._id},{password : passwordHash},(err,success)=>{
            if(!err){
              res.redirect(`/change_user?message=success`)
            }
          })
          //console.log('canchange')
        }else{
          res.redirect(`/change_user?message=dont_`)
        }
      })
    }else{
      //console.log('!null')
      res.redirect(`/change_user?message=null_`)
    }
  }
}
exports.user_address= async (req, res) => {
  Address.insertMany(
    {
      user_id: req.user._id,
      name: req.body.name,
      phone: req.body.phone,
      province: req.body.province,
      district: req.body.district,
      code: req.body.code,
      address: req.body.address,
    },
    (err, data) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect("address?message=address");
    }
  );
};
exports.user_address_pay= async (req, res) => {
  Address.insertMany(
    {
      user_id: req.user._id,
      name: req.body.name,
      phone: req.body.phone,
      province: req.body.province,
      district: req.body.district,
      code: req.body.code,
      address: req.body.address,
    },
    (err, data) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect("/pay");
    }
  );
};
exports.info_address = async (req, res) => {
  Address.findOne({ _id: req.body._id }, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.send(data);
  });
};
exports.user_address_n = async (req, res) => {

  Address.findByIdAndUpdate(
    {
      _id: req.query._id,
    },
    {
      name: req.body.name,
      phone: req.body.phone,
      province: req.body.province,
      district: req.body.district,
      code: req.body.code,
      address: req.body.address,
    },
    (err, data) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect("address?message=updated");
    }
  );
};
exports.delete_address = (req, res) => {
  Address.findOneAndDelete({ _id: req.query._id }, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("address?message=deleted");
  });
};


exports.basket = async(req,res,next)=>{
  console.log(req.body)
  var color_id = await Color.findOne({product_id : req.body.product_id , name : req.body.color_});
  var size_id = await Size.findOne({product_id : req.body.product_id , name : req.body.size_});
  var stock_id = await Stock.findOne({product_id : req.body.product_id , size : req.body.size_ ,color : req.body.color_});
  var check_basket = await Basket.findOne({
    product_id: req.body.product_id,
    user_id: req.user._id,
    color_id : color_id._id,
    size_id : size_id._id,
  });
  if (check_basket == null) {
    Basket.insertMany(
      {
        qty: Number(req.body.num),
        product_id: req.body.product_id,
        user_id: req.user._id,
        color_id : color_id._id,
        size_id : size_id._id,
        stock_id : stock_id._id,
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
  } else {
    //console.log(check_basket.qty + Number(req.body.qty))
    Basket.findByIdAndUpdate(
      {
        _id: check_basket._id,
      },
      {
        qty: Number(req.body.num) + check_basket.qty,
        status: req.body.status
      },
      (err, data) => {
        if (err) {
          return res.send(err);
        } else {
          return res.send({ message: "success" });
        }
      }
    );
  }
}


exports.list = async(req,res) =>{
  //console.log(req.body)
  const date = new Date();

  //console.log(num_)
  var baskets = await Basket.find({ user_id : req.user._id , status : 1});
  await List.insertMany({
    user_id : req.user._id,
    address : req.body.address,
    pay : req.body.pay,
    price : req.body.money,
    cost : req.body.cost,
    status : 0 ,
    date_after :  date.setDate(date.getDate() + 1)
  },(err,data)=>{
    if (err) {
      return res.status(500).send(err);
    }else{
      //console.log(data)
      
      baskets.forEach(basket => 
        
        ListProduct.insertMany({
          user_id : req.user._id ,
          list_id : data[0]._id,
          product_id : basket.product_id,
          qty : basket.qty,
          product_id : basket.product_id ,
          color_id  :basket. color_id ,
          size_id : basket.size_id ,
          user_id : basket.user_id,
          stock_id :basket.stock_id
        })
      )
      
    }
 
  })
 
  await Basket.deleteMany({ user_id : req.user._id , status : 1})
  res.send({message:'success'})
  
}
exports.list_product = async(req,res) =>{
  req.body.list_id = new Objectid(req.body.list_id);
  var list_products = await ListProduct.aggregate([
    {
      $match: { list_id : req.body.list_id}
    },
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
    }    
      
  ]);
  //console.log(list_products)
  return res.send(list_products);
}
exports.change_bank = async(req,res) =>{
  //console.log(req.body)
  List.findByIdAndUpdate(
    {
      _id : req.body._id
    },{
      pay : req.body.pay
    },(err,data)=>{
      if(err){
        return res.status(500).send(err)
      }
      return res.send({message:"success"})
    }
  )
}
exports.list_image = async(req,res) => {
  List.findByIdAndUpdate(
    {
      _id : req.params.id
    },{
      image_name : req.file.filename,
      status : 1
    }
  ).exec((err,data)=>{
    if(err){
      return res.status.send(err)
    }
  })
  var listProduct= await ListProduct.find({list_id : req.params.id});
  for (let i = 0; i < listProduct.length; i++) {
    var color = await Color.findOne({_id : listProduct[i].color_id});
    var size = await Size.findOne({_id : listProduct[i].size_id});
    //var stock = await Stock.findOne({_id : listProduct[i].stock_id});
    var stock = await Stock.findOne(
      {
        product_id : listProduct[i].product_id ,
        color : color.name ,
        size : size.name
      })
    await Stock.findByIdAndUpdate(
      {
        _id : stock._id
      },{
        num : stock.num - listProduct[i].qty
      }
    )
  }
  return res.send({message:'success'})
  
}
exports.change_cancel = async(req,res) =>{
  console.log(req.params)
  console.log(req.body)
  var listProduct= await ListProduct.find({list_id : req.params.id});
  for (let i = 0; i < listProduct.length; i++) {
    var color = await Color.findOne({_id : listProduct[i].color_id});
    var size = await Size.findOne({_id : listProduct[i].size_id});
    //var stock = await Stock.findOne({_id : listProduct[i].stock_id});
    var stock = await Stock.findOne(
      {
        product_id : listProduct[i].product_id ,
        color : color.name ,
        size : size.name
      })
    await Stock.findByIdAndUpdate(
      {
        _id : stock._id
      },{
        num : stock.num + listProduct[i].qty
      }
    )
  }
  List.findByIdAndUpdate(
      {
          _id : req.params.id
      },{
          status : 4
      }
  ).exec((err,data)=>{
      if(err){
          return res.status(500).send(err)
      }else{
          res.send('success')
         
      }
  })
}

exports.change_status2 = (req,res) =>{
  List.findByIdAndUpdate(
      {
          _id : req.body.list_id
      },{
          status : 2
      }
  ).exec((err,data)=>{
      if(err){
          return res.status(500).send(err)
      }else{
          return res.send({message:'success'})
      }
  })
}
exports.change_status3 = (req,res) =>{
  //console.log(req.params)
  //console.log(req.body)
  List.findByIdAndUpdate(
      {
          _id : req.params.id
      },{
          detail : 'บริษัทที่จัดส่ง'  + ' : ' + req.body.text_deriver + ' เลขที่พัสดุ :' + req.body.no_deriver ,
          status : 3
      }
  ).exec((err,data)=>{
    
      //console.log(data)

      if(err){
          return res.status(500).send(err)
      }else{
          req.params.id = new Objectid(req.params.id);
          ListProduct.aggregate([
              {
                  $match:{ list_id : req.params.id  }
              },
              {
                  "$lookup": {
                      "from": "lists",
                      "localField": "list_id",
                      "foreignField": "_id",
                      "as": "list"
                  }
              },
              {
                  $unwind : '$list'
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
              ,
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
            ]).exec((err,data)=>{
                if(err){

                }else{
                 data.forEach(r => 
                   Report.findOne({
                     product_id : r.product._id , 
                     color_id : r.color_id,
                     size_id : r.size_id
                    },(err,result)=>{
                       console.log(r)
                       if(result == null){
                          Report.insertMany(
                              {
                                  product_id : r.product_id ,
                                  color_id : r.color_id,
                                  size_id : r.size_id,
                                  stock_id :r.stock_id,
                                  qty : r.qty
                              }
                          )
                      }else{
                         //console.log(result._id.toString())
                         //console.log(result)
                         result._id= new Objectid(result._id.toString());
                         Report.findByIdAndUpdate(
                             { _id : result._id },
                             { qty : result.qty + r.qty }
                         ,(err,data)=>{
                             console.log(err)
                             console.log(data)
                         })
                      }
                   })
                 )
                 res.redirect("/admin_done?message=success_")
                }
            })
          
          
      }
  })
}
exports.check = async(req,res) =>{

  var check = await Check.findOne({user_id : req.user._id});
 
  if(check == null){
    Check.insertMany({
      user_id : req.user._id ,
      list_id : req.body.list_id,
      cost : req.body.cost,
    },(err,data)=>{
      if(err){
        return res.status(500).send(err)
      }else{
        return res.send({message:'success'})
      }
    })
  }else{
    Check.findByIdAndUpdate(
      {
        _id : check._id
      },{
        list_id : req.body.list_id,
        cost : req.body.cost,
      },(err,data)=>{
        if(err){
          return res.status(500).send(err)
        }else{
          return res.send({message:'success'})
        }
      })
  }
}

