$( document ).ready(function() {   
  //console.log(message)
  if(message == 'error'){   
    Swal.fire(
      'คำเตือน!!',
      'กรุณากรอกข้อมูลก่อนเพิ่ม',
      'warning'
    )
  }
  if(message == 'duplicate'){ 
    Swal.fire(
      'คำเตือน!!',
      'มีชื่อสินค้านี้เเล้ว',
      'error'
    )
  }
 

});
checkData=()=>{
  event.preventDefault();
  var form = document.forms["productAdd"];
  var name = $('#name').val();
  var type_id = $('#type_id').val();
 
  var detail  = $('#detail').val();

  if(name == ''  || type_id == ''  || detail == '' ){
    Swal.fire(
      'เกิดข้อผิดพลาด?',
      'กรุณากรอกข้อมูลให้ครบถ้วน',
      'warning'
    )
  }else{
    form.submit();
  }
}

//clear url query 
if (uri.indexOf("?") > 0) {
  var clean_uri = uri.substring(0, uri.indexOf("?"));
   window.history.replaceState({}, document.title, clean_uri);
}