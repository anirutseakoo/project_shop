$( document ).ready(function() {
  $.post("/product_show_new",function(result_new){
    //console.log(result_new)
    var product_new = document.getElementById("product_new");
    var product_new2 = document.getElementById("product_new2");
    for (let i = 0; i < 8; i++) {
      //console.log(result_new[i]._id)
      
      $.post("/product_show_image",obj= {
      product:result_new[i]._id
      },function(show_image){
        var show_money = `${show_image.plusA.plus} - ${show_image.plusD.plus}` 
        if(show_image.plusA.plus == show_image.plusD.plus){
          show_money = `${show_image.plusA.plus}`
        }
        if(show_image.data.image_name !== undefined){

          product_new.innerHTML += `
          <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100" onclick="go_detail('${result_new[i]._id}')">
          <div class="card card-span h-100 text-white">
            <img class="img-fluid h-100" src="upload/${show_image.data.image_name}" />
            <div class="card-img-overlay ps-0"> </div>
            <div class="card-body ps-0 bg-200">
              <h5 class="fw-bold text-1000 text-truncate">
              ${result_new[i].name  }
            
              </h5>
              <div class="fw-bold">
                <span class="text-600 me-2 ">ราคา</span>
                <span class="text-primary">${show_money} บาท</span> <br/>
               
              </div>
              
            </div><a class="stretched-link" href="#"></a>
          </div>
        </div>

          `
          product_new2.innerHTML += `
          <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100" onclick="go_detail('${result_new[i]._id}')">
          <div class="card card-span h-100 text-white">
            <img class="img-fluid h-100" src="upload/${show_image.data.image_name}" />
            <div class="card-img-overlay ps-0"> </div>
            <div class="card-body ps-0 bg-200">
              <h5 class="fw-bold text-1000 text-truncate">
              ${result_new[i].name  }
            
              </h5>
              <div class="fw-bold">
                <span class="text-600 me-2 ">ราคา</span>
                <span class="text-primary">${show_money} บาท</span> <br/>
               
              </div>
              
            </div><a class="stretched-link" href="#"></a>
          </div>
        </div>

          `
       
        }
      })

      
    }
  });
  $.post("/product_show_dee",function(result_dee){
    //console.log(result_new)
    var product_new = document.getElementById("product_dee");
    var product_new2 = document.getElementById("product_new2");
    for (let i = 0; i < 8; i++) {
      console.log(result_dee[i].product._id)
      console.log(result_dee)
      $.post("/product_show_image",obj= {
      product:result_dee[i].product._id
      },function(show_image){
        console.log(show_image)
        var show_money = `${show_image.plusA.plus} - ${show_image.plusD.plus}` 
        if(show_image.plusA.plus == show_image.plusD.plus){
          show_money = `${show_image.plusA.plus}`
        }
        
        if(show_image.data.image_name !== undefined){

          product_new.innerHTML += `
          <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100" onclick="go_detail('${result_dee[i].product._id}')">
          <div class="card card-span h-100 text-white">
            <img class="img-fluid h-100" src="upload/${result_dee[i].color.image_name}" />
            <div class="card-img-overlay ps-0"> </div>
            <div class="card-body ps-0 bg-200">
              <h5 class="fw-bold text-1000 text-truncate">
              ${result_dee[i].product.name }
            
              </h5>
              <div class="fw-bold">
                <span class="text-600 me-2 ">ราคา</span>
                <span class="text-primary">${show_money} บาท</span> <br/>
               
              </div>
              
            </div><a class="stretched-link" href="#"></a>
          </div>
        </div>

          `
          product_new2.innerHTML += `
          <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100" onclick="go_detail('${result_dee[i].product._id}')">
          <div class="card card-span h-100 text-white">
            <img class="img-fluid h-100" src="upload/${result_dee[i].image_name}" />
            <div class="card-img-overlay ps-0"> </div>
            <div class="card-body ps-0 bg-200">
              <h5 class="fw-bold text-1000 text-truncate">
              ${result_dee[i].product.name }
            
              </h5>
              <div class="fw-bold">
                <span class="text-600 me-2 ">ราคา</span>
                <span class="text-primary">${show_money} บาท</span> <br/>
               
              </div>
              
            </div><a class="stretched-link" href="#"></a>
          </div>
        </div>

          `
       
        }
      })

      
    }
  });
  $.post("/product_show_all",function(result){
    //console.log(result)
    var product_all = document.getElementById("product_all");
    for (let i = 0; i < result.length; i++) {
      //console.log(result[i]._id)
      var obj = {
      product:result[i]._id
      }
      $.post("/product_show_image",obj,function(show_image){
        //  console.log(show_image)
        var show_money = `${show_image.plusA.plus} - ${show_image.plusD.plus}` 
        if(show_image.plusA.plus == show_image.plusD.plus){
          show_money = `${show_image.plusA.plus}`
        }
        if(show_image.data.image_name){
          product_all.innerHTML += `
          <div class="col-sm-6 col-md-3 mb-3 mb-md-0 h-100" onclick="go_detail('${result[i]._id}')">
          <div class="card card-span h-100 text-white">
            <img class="img-fluid h-100" src="upload/${show_image.data.image_name}" />
            <div class="card-img-overlay ps-0"> </div>
            <div class="card-body ps-0 bg-200">
              <h5 class="fw-bold text-1000 text-truncate">
              ${result[i].name  }
            
              </h5>
              <div class="fw-bold">
                <span class="text-600 me-2 ">ราคา</span>
                <span class="text-primary">${show_money} บาท</span> <br/>
               
              </div>
              
            </div><a class="stretched-link" href="#"></a>
          </div>
        </div>

          `
        }
      })

      
    }
    });
 
  
});

    
  go_detail=(id)=>{
    window.location.href = "/detail?product_id="+id  
  }

   