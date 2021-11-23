$(function() {

var cursor;

cursor = window.setInterval(function() {
  if ($('#cursor').css('visibility') === 'visible') {
    $('#cursor').css({ visibility: 'hidden' });
  } else {
    $('#cursor').css({ visibility: 'visible' });  
  }  
  }, 500);

/*$('#cmd').click(function() {
   $('#strange_input').focus();
  
  
  
});

$('#strange_input').keypress(function() {
  $('#cmd span').text($(this).val());
});
  
$('#strange_input').blur(function() {
     clearInterval(cursor);
     $('#cursor').css({ visibility: 'visible' });    
});
*/

});