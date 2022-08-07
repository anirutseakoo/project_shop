$( document ).ready(function() {
  $.post("/productNew_show",function(result){
    /*console.log(result)*/
     var product_new1 = document.getElementById("product_new1");
     for (let i = 0; i < result.length; i++) {
      //console.log(result[i]._id)
      obj = {
       product:result[i]._id
      }
      $.post("/product_show_image",obj,function(show_image){
        //console.log(show_image)
        var show_money = `${show_image.plusA.plus} - ${show_image.plusD.plus}` 
        if(show_image.plusA.plus == show_image.plusD.plus){
          show_money = `${show_image.plusA.plus}`
        }
        if(show_image.data.image_name !== undefined){
          product_new1.innerHTML += `
          <div class="col-xl-3 col-sm-6    cardHover " onclick="go_detail('${result[i]._id}')">
            <img src="upload/${show_image.data.image_name}" class="product_image" >
            <div class="card-body">
              <h5  class="text-right product_head" >${result[i].name  }</h5>
              <p>ราคา ${show_money} บาท</p> 
            </div>
          </div>
          `
        }
       })
  
  
      
     }
   });
});
go_detail=(id)=>{
  window.location.href = "/product_detail?product_id="+id  
}

