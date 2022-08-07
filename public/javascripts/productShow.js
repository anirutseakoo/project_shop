    $.post("/product_show_all",function(result){
    //console.log(result)
     var product_all = document.getElementById("product_all");
     for (let i = 0; i < result.length; i++) {
      //console.log(result[i]._id)
      obj = {
       product:result[i]._id
      }
       $.post("/product_show_image",obj,function(show_image){
         if(show_image.image_name !== undefined){
           product_all.innerHTML += `
           <div class="col-xl-3 col-sm-6    cardHover ">
             <img src="upload/${show_image.image_name}" class="product_image" >
             <div class="card-body">
               <h5  class="text-right product_head" >${result[i].name}</h5>
               <p>ราคา ${result[i].price_sell} บาท</p> 
             </div>
           </div>
           `
         }
       })
  
      
     }
   });
   $.post("/product_show_new",function(result){
    //console.log(result)
     var product_new = document.getElementById("product_new");
     for (let i = 0; i < result.length; i++) {
      //console.log(result[i]._id)
      obj = {
       product:result[i]._id
      }
       $.post("/product_show_image",obj,function(show_image){
         if(show_image.image_name !== undefined){
           product_new.innerHTML += `
           <div class="col-xl-3 col-sm-6    cardHover ">
             <img src="upload/${show_image.image_name}" class="product_image" >
             <div class="card-body">
               <h5  class="text-right product_head" >${result[i].name}</h5>
               <p>ราคา ${result[i].price_sell} บาท</p> 
             </div>
           </div>
           `
         }
       })
  
      
     }
   });
   $.post("/productNew_show",function(result){
    //console.log(result)
     var product_new1 = document.getElementById("product_new1");
     for (let i = 0; i < result.length; i++) {
      //console.log(result[i]._id)
      obj = {
       product:result[i]._id
      }
       $.post("/product_show_image",obj,function(show_image){
         if(show_image.image_name !== undefined){
           product_new1.innerHTML += `
           <div class="col-xl-3 col-sm-6    cardHover ">
             <img src="upload/${show_image.image_name}" class="product_image" >
             <div class="card-body">
               <h5  class="text-right product_head" >${result[i].name}</h5>
               <p>ราคา ${result[i].price_sell} บาท</p> 
             </div>
           </div>
           `
         }
       })
  
      
     }
   });