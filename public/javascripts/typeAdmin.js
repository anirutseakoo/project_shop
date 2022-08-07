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
    if(message == 'haveType'){
        Swal.fire(
          'ไม่สามารถเพิ่มข้อมูลได้!!',
          'มีข้อมูลนี้ในระบบเเล้ว',
          'error'
        )
    }
    if(message == 'deleted'){
      Swal.fire(
        'สำเร็จ!!',
        'ลบข้อมูลสำเร็จ',
        'success'
      )
      
  }
  if(message == 'updated'){
    Swal.fire(
      'สำเร็จ!!',
      'เเกไข้ข้อมูลสำเร็จ',
      'success'
    )
    
  }
  if(message == 'haveProduct'){ 
    Swal.fire(
      'ไม่สามารถลบได้!!',
      'มีการใช้ประเภทนี้ในระบบกรุณาเคลียสินค้าก่อนลบ',
      'error'
    )
  }
  if(message == 'duplicate'){ 
    Swal.fire(
      'ไม่สามารถใช้ชื่อนี้ได้!!',
      'มีการใช้ชื่อสินค้านี้แล้ว',
      'error'
    )
  }
});
function typeEdit(id){
  event.preventDefault();
  $.post("/typeInfo/"+id,function(data){
    $('#typeId').val(data._id);
    $('#typeName').val(data.name);
    $('#typeGender').val(data.gender);
    $('#editModal').modal();
})
  
}
function confirmDelete(data){
  event.preventDefault();
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
          window.location.href = `/typeDelete/${data}`
      }
  })
}
//clear url query 
if (uri.indexOf("?") > 0) {
    var clean_uri = uri.substring(0, uri.indexOf("?"));
     window.history.replaceState({}, document.title, clean_uri);
}