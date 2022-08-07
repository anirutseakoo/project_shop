$( document ).ready(function() {   
    if(message == 'null'){
      Swal.fire(
        'เกิดข้อผิดพลาด?',
        'กรุณากรอกข้อมูลให้ครบถ้วน',
        'warning'
      )
    }
    if(message == 'haveEmail'){
      Swal.fire(
        'เกิดข้อผิดพลาด?',
        'มีคนใช้อีเมล์นี้เเล้ว',
        'warning'
      )
    }
});
  checkValues=()=>{
    event.preventDefault();
    
    var pattern = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8}$/;
    var email = $("#email").val();
    var password = $("#password_").val();
    var confirmPassword = $("#confirmPassword").val(); 
    var firstname = $("#firstname").val();
    var lastname = $("#lastname").val();
    var gender = $("#gender").val();
    var phone = $("#phone").val();
    var address = $("#address").val();
    if(email == '' || password == '' || confirmPassword == '' || firstname == '' || lastname == '' || gender == '' ||
      phone == '' || address == ''  
    ){
      Swal.fire(
        'เกิดข้อผิดพลาด?',
        'กรุณากรอกข้อมูลให้ครบถ้วน',
        'warning'
      )
    }else{
      if(password !== confirmPassword){
        Swal.fire(
          'เกิดข้อผิดพลาด?',
          'รหัสผ่านของท่านไม่ตรงกัน',
          'warning'
        )
      }else if(!password.match(pattern) && !confirmPassword.match(pattern)){
        Swal.fire(
          'เกิดข้อผิดพลาด?',
          'รหัสผ่านของท่านให้ตรงตามเงื่อนไขที่กำหนด',
          'warning'
        )
      }else{
        
        $( "#registerForm" )[0].submit();
      }
    }
  }
//clear url query 
if (uri.indexOf("?") > 0) {
    var clean_uri = uri.substring(0, uri.indexOf("?"));
     window.history.replaceState({}, document.title, clean_uri);
}