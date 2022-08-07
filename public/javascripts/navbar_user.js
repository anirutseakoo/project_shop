$( document ).ready(function() {   
    $.post("/show_user", function(result){
      //console.log(result)
      $('#user_edit').attr("href","/user_edit?_id="+result._id)
      $('#sd_name').html(result.firstname + ' ' +result.lastname);
      if(result.image_name == ''){
        $('#image_user').removeAttr("src")
        $('#image_user').attr("src","/images/user_icon.jpg")
       
      }else{
        $('#image_user').removeAttr("src")
        $('#image_user').attr("src","/upload/"+result.image_name)
        
      }
    });
    
});