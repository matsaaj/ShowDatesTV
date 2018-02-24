$('#btn').click(function() {
  if ($('.overlay')[0]) {
    $('.overlay').fadeOut(200, function() {
      $(this).remove();
    });

    $('#content').css({
      'top': '0'
    });
  } else {
    $('#content').css({
      'top': '8rem'
    });

    $('#content').append('<div class="overlay"></div>');
    $('.overlay').fadeIn(200);
  }
});
