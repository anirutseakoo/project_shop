$( document ).ready(function() {   
    if(message == 'login'){
      Swal.fire(
        'สำเร็จ!!',
        'สมัครข้อมูลสำเร็จ',
        'success'
      )
    }
    if(message == 'ban'){
      Swal.fire(
        'เกิดข้อผิดพลาด!!',
        'บัญชีนี้ถูกระงับการใช้งาน',
        'error'
      )
      
    }
    if(message == 'loginFail'){
      Swal.fire(
        'เกิดข้อผิดพลาด!!',
        'บัญชีผุ้ใช้หรือรหัสผ่านผิด',
        'error'
      )
    
    }
    if(message == 'page'){
      Swal.fire(
        'เกิดข้อผิดพลาด!!',
        'กรุณาเข้าสู่ระบบก่อนเข้าหน้าดังกล่าว',
        'warning'
      )
    }
});
//clear url query 
if (uri.indexOf("?") > 0) {
    var clean_uri = uri.substring(0, uri.indexOf("?"));
     window.history.replaceState({}, document.title, clean_uri);
}