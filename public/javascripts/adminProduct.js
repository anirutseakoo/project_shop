$( document ).ready(function() {   
    if(message == 'deleted'){
        Swal.fire(
          'สำเร็จ!!',
          'ลบข้อมูลสำเร็จ',
          'success'
        )
        
    } 
});
//clear url query 
if (uri.indexOf("?") > 0) {
    var clean_uri = uri.substring(0, uri.indexOf("?"));
     window.history.replaceState({}, document.title, clean_uri);
}