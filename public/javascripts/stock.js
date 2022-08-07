$( document ).ready(function() {   
    if(message == 'null'){
      Swal.fire(
        'คำเตือน!!',
        'กรุณากรอกข้อมูลก่อนเพิ่ม',
        'warning'
      )
    }
    if(message == 'success'){
      Swal.fire(
        'สำเร็จ!!',
        'เพิ่มข้อมูลสำเร็จ',
        'success'
      )
    }
    if(message == 'updated'){
      Swal.fire(
        'สำเร็จ!!',
        'เเก้ไขข้อมูลสำเร็จ',
        'success'
      )
    }
    if(message == 'image'){
      Swal.fire(
        'สำเร็จ!!',
        'เปลี่ยนรูปภาพสำเร็จ',
        'success'
      )
    }
    if(message == 'duplicate'){ 
      Swal.fire(
        'คำเตือน!!',
        'สิ่งที่กรอกมามีการใช้งานเเล้วหรือใช้งานอยู่',
        'error'
      )
    }
    $.post("/stockInfo",{ product_id : product_id}, function(result){
      //console.log(result.length)
      var stockTbody = document.getElementById("stockTbody");
      for(let i = 0; i < result.length; i++ ){
        var tr = document.createElement('tr');
    
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var td4 = document.createElement('td');
        var td5 = document.createElement('td');
        var td6 = document.createElement('td');
      
        td2.innerHTML += result[i].size;
        td3.innerHTML += result[i].color;
        td4.innerHTML += result[i].num;
        td5.innerHTML += ` <a class="btn btn-outline-primary" onclick="stockInfo('${result[i]._id}');">เเก้ไข</a>`;
        td6.innerHTML += ` <a class="btn btn-outline-danger"  onclick="stockDelete('${result[i]._id}');">ลบ</a>`;
        tr.append(td2,td3,td4,td5,td6); 
            
        stockTbody.appendChild(tr);
      }
    });
    $.post("/stockProduct",{ product_id : product_id}, function(result){
      //console.log(result)
      result = result[0]
      var name = document.getElementById("productName");
      //var gender = document.getElementById("productGender");
      var type = document.getElementById("productType");
      var price = document.getElementById("productPrice");
      var price_sell = document.getElementById("productPriceSell");
      var user = document.getElementById("productUser");
      var detail = document.getElementById("productDetail")
      name.innerHTML += result.name
      //gender.innerHTML += result.gender
      type.innerHTML += result.type.name
      price.innerHTML += result.price
      price_sell.innerHTML += result.price_sell
      detail.innerHTML += result.detail
      user.innerHTML += result.user.firstname + '' + result.user.lastname
    });
});
$( document ).ready(function() {
  var show_color = document.getElementById("show_color");
  var color = document.getElementById("color")
  var show_size = document.getElementById("show_size");
  var size = document.getElementById("size");
  var Esize =  document.getElementById("Esize");
  var Ecolor =  document.getElementById("Ecolor");
  $.post("/show_color",obj = {product_id},function(data){
    for (let i = 0; i < data.length; i++) {
      show_color.innerHTML += `
    
    <tr>
      <td style="width: 100px;">
        <img class="stockImage" src="upload/${data[i].image_name}" alt="">
        <input type="file" class="form-control form-control-sm" id="colorImage${i}" onchange="edit_colorImage('${data[i]._id}','${i}')"  placeholder="กรุณาเลือกเพื่อเปลี่ยนเเปลงรูปภาพ">  
      </td>
      <td>${data[i].name}</td>
      <td><span class="text-danger"><i class="fa fa-times" aria-hidden="true" onclick="delete_color('${data[i]._id}','${data[i].name}')"></i></span>  </td>
      <td><span class="text-primary"><i class="fa fa-pen" aria-hidden="true" onclick="info_color('${data[i]._id}','${data[i].name}')"></i></span>  </td>
    </tr>
    
      `
      color.innerHTML += `
        <option value="${data[i].name}" >${data[i].name}</option>
      `
      Ecolor.innerHTML +=`
        <option value="${data[i].name}" >${data[i].name}</option>
      `
    }
  })
  $.post("/show_size",obj = {product_id},function(data){
    for (let i = 0; i < data.length; i++) {
      show_size.innerHTML += `
      <tr>        
        <td>${data[i].name}</td>
        <td>${data[i].price}</td>
        <td>${data[i].plus}</td>
        <td><span class="text-danger"><i class="fa fa-times" aria-hidden="true" onclick="delete_size('${data[i]._id}','${data[i].name}')"></i></span>  </td>
        <td><span class="text-primary"><i class="fa fa-pen" aria-hidden="true" onclick="info_size('${data[i]._id}','${data[i].name}','${data[i].price}','${data[i].plus}')"></i></span>  </td>
      </tr>
    
      `
      size.innerHTML += `
        <option value="${data[i].name}" >${data[i].name}</option>
      `
      Esize.innerHTML +=`
        <option value="${data[i].name}" >${data[i].name}</option>
      `
    
    }
  })
});
insertSize=()=>{
  var size1 = document.getElementById("size")
  var Esize =  document.getElementById("Esize");

  var size = $("#db_size").val()
  var price = $("#db_price").val()
  var plus = $("#db_plus").val()
  if(size == ''||price == '' ||plus == ''  || plus < 0 || price < 0){
    if(plus < 0 || price < 0){
      Swal.fire(
      'เกิดข้อผิดพลาด!!',
      'กรุณากรอกจำนวนให้ถูกต้อง',
      'warning'
    )
    }else{
      Swal.fire(
      'เกิดข้อผิดพลาด!!',
      'กรุณากรอกข้อมูล',
      'warning'
    )
    }
   
  }else{
    obj = {
      size : size,
      plus:  plus,
      price : price,
      product_id : product_id
    }

    $.post("/insert_size",obj,function(data){
      if(data == 'err'){
        Swal.fire(
        'เกิดข้อผิดพลาด!!',
        'ใช้Sizeนี้แล้ว',
        'warning'
        )
      }else{
        window.location.href = "/productStock?product_id="+product_id
      }
      
        $("#db_size").val('')
        $("#db_plus").val('')
    
    

    })
  }
}

insertColor=()=>{
  var color1 = document.getElementById("color")
  var Ecolor =  document.getElementById("Ecolor");
  var color = $("#db_color").val();
  var pathImage = $("#db_image")[0].files[0];
  console.log($("#db_image").val())
  var image = new FormData();
  image.append('image',pathImage)
  if(color == '' || $("#db_image").val() == ''){
    Swal.fire(
      'เกิดข้อผิดพลาด!!',
      'กรุณากรอกข้อมูล',
      'warning'
    )
  }else{
  
    $.ajax({
      url: '/insert_color?color='+color+'&&product_id='+product_id,
      data: image,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      type: 'POST', // For jQuery < 1.9
      success: function(data){
        if(data == 'err'){
        Swal.fire(
        'เกิดข้อผิดพลาด!!',
        'ใช้สีนี้แล้ว',
        'warning'
        )
      }else{
          window.location.href = "/productStock?product_id="+product_id
      }
       
      }
    });

  }
}
edit_colorImage=(id,i)=>{
//console.log(i)
var pathImage = $("#colorImage"+i)[0].files[0];
var image = new FormData();
image.append('image',pathImage)
$.ajax({
  url: '/edit_colorImage?_id='+id,
  data: image,
  cache: false,
  contentType: false,
  processData: false,
  method: 'POST',
  type: 'POST', // For jQuery < 1.9
  success: function(data){
      if(data.message == 'success'){
        window.location.href = "/productStock?product_id="+product_id
      }
      /*if(data){
        window.location.href = `/productStock?product_id=${data}&message=image`
      }*/
  }
});

}
info_color=(id,name)=>{
  $.post("/check_edit_color",{ color:name ,product_id : product_id}, function(result){
    if(result._id){
      Swal.fire(
        'เกิดข้อผิดพลาด!!',
        'กรุณา clear สินค้าใน stock ที่่ใช้สีนี้ก่อนเปลี่ยนเเปลง',
        'warning'
        )
    }else{
      $('#edit_color').val(name);
      $('#edit_id').val(id);
      $('#colorModal').modal();
    }
  });

}
info_size=(id,name,price,plus)=>{
  $.post("/check_edit_size",{ size:name ,product_id : product_id}, function(result){
    if(result._id){
      Swal.fire(
        'เกิดข้อผิดพลาด!!',
        'กรุณา clear สินค้าใน stock ที่่ใช้ Size นี้ก่อนเปลี่ยนเเปลง',
        'warning'
        )
    }else{
      $('#edit_size').val(name);
      $('#edit_id0').val(id);
      $('#edit_price').val(price);
      $('#edit_plus').val(plus);
      $('#sizeModal').modal();
    }
  });

 
}
edit_size=()=>{
  var name = $('#edit_size').val();
  var _id = $('#edit_id0').val();
  var price = $('#edit_price').val();
  var plus = $('#edit_plus').val();
  var obj = {
    name,_id,price,plus,product_id
  }
  $.post("/edit_size",obj ,function(data){
    if(data.message == 'success'){
      window.location.href = "/productStock?product_id="+product_id
    }else{
      Swal.fire(
        'เกิดข้อผิดพลาด!!',
        'ใช้Sizeนี้แล้ว',
        'warning'
        )
    }
  })
}
edit_color=()=>{
  var name = $('#edit_color').val();
  var _id =$('#edit_id').val();
  $.post("/edit_color",obj = {name,_id,product_id},function(data){
    if(data.message == 'success' ){
      window.location.href = "/productStock?product_id="+product_id
    }else{
      Swal.fire(
        'เกิดข้อผิดพลาด!!',
        'ใช้สีนี้แล้ว',
        'warning'
        )
    }
  })
}

productOneInfo=(data)=>{
  $.post("/stockProduct",{ product_id : data}, function(result){
    $('#name').val(result[0].name);
    $('#type_id').val(result[0].type_id);
    $('#gender').val(result[0].gender);
   
    $('#detail').val(result[0].detail);
    $('#editId').val(result[0]._id);
    $('#editModal').modal();
    
  });
}
checkData=()=>{
  event.preventDefault();
  var form = document.forms["productEdit"];
  var name = $('#name').val();

  var type_id = $('#type_id').val();
  var price = $('#price').val();
  var price_sell = $('#price_sell').val();
  var detail  = $('#detail').val();
  if(name == ''  || type_id == '' || price == '' || detail == '' || price_sell == ''){
    Swal.fire(
      'เกิดข้อผิดพลาด?',
      'กรุณากรอกข้อมูลให้ครบถ้วน',
      'warning'
    )
  }else{
    form.submit();
  }
}
stockDelete=(id)=>{
  Swal.fire({
  title: 'ต้องการลบข้อมูลหรือไม่?',
  text: "ถ้าคุณต้องการลบข้อมูลกรุณากดตกลง!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'ตกลง',
  cancelButtonText: 'ยกเลิก'
  }).then((result) => {
    if (result.isConfirmed == true) {
      window.location.href = `/stockDelete/${id}`
    }
  })
} 
confirmInsert=()=>{
  event.preventDefault();
  var form = document.forms["stockFrom"];
 
  var size = document.getElementById("size").value;
  var color = document.getElementById("color").value;
  var num = document.getElementById("num").value;
  
  if( size == '' || color == '' || num == ''){
    Swal.fire(
      'คำเตือน!!',
      'กรุณากรอกข้อมูลให้ครบถ้วน',
      'warning'
    )
  }else{
    form.submit();
  }
}
stockInfo=(id)=>{
  $.post("/stockOneInfo",{ _id : id}, function(result){
    //console.log(result)
    $("#Eid").val(result._id);
    $("#Esize").val(result.size);
    $("#Ecolor").val(result.color);
    $("#Enum").val(result.num);
    $("#modalEdit").modal();
  });
}  
confirmEdit=()=>{
   event.preventDefault();
   var form = document.forms["stockEditFrom"];
   var Eid =  $("#Eid").val();
   var size =  $("#Esize").val();
   var color = $("#Ecolor").val();
   var num = $("#Enum").val();
   if(size == '' || color == '' || num == '' || Eid == ''){
    Swal.fire(
      'คำเตือน!!',
      'กรุณากรอกข้อมูลให้ครบถ้วน',
      'warning'
    )
   }else{
     form.submit();
   }
}
changeImage=(id,i)=>{
    //console.log(i)
    var pathImage = $("#changeImage"+i)[0].files[0];
    var image = new FormData();
    image.append('image',pathImage)
    $.ajax({
      url: '/editImageStock?id='+id,
      data: image,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      type: 'POST', // For jQuery < 1.9
      success: function(data){
          if(data){
            window.location.href = `/productStock?product_id=${data}&message=image`
          }
      }
    });
    
}
productDelete=(id)=>{  
  Swal.fire({
    title: 'ต้องการลบข้อมูลหรือไม่?',
    text: "ถ้าคุณต้องการลบข้อมูลกรุณากดตกลง!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ตกลง',
    cancelButtonText: 'ยกเลิก'
    }).then((result) => {
    if (result.isConfirmed == true) {
      $.post("/productDeleteAll",{ id : id}, function(message){
        if(message.message == 'success'){
          
          window.location.href = `/productAdmin?message=deleted`
        }
      });
    }
  })
}



delete_color=(id,name)=>{
  obj = {
    id : id,
    name : name,
    product_id : product_id
  }
  $.post("/delete_color",obj,function(data){
    if(data == 'err'){
      Swal.fire(
      'เกิดข้อผิดพลาด!!',
      'ไม่สามาลบได้มีการใช้สีนี้ในระบบ',
      'warning'
    )
    }else{
      window.location.href = "/productStock?product_id="+product_id
    }
  })
}
delete_size=(id,name)=>{
  obj = {
    id : id,
    name : name,
    product_id : product_id
  }
  $.post("/delete_size",obj,function(data){
    if(data == 'err'){
      Swal.fire(
      'เกิดข้อผิดพลาด!!',
      'ไม่สามาลบได้มีการใช้ Size นี้ในระบบ',
      'warning'
    )
    }else{
      window.location.href = "/productStock?product_id="+product_id
    }
   
  })
}
if (uri.indexOf("&") > 0) {
  var clean_uri = uri.substring(0, uri.indexOf("&"));
   window.history.replaceState({}, document.title, clean_uri);
}