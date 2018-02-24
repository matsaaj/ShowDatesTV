$('#btn').click(function() {
  if ($('.overlay')[0]) {
    $('.overlay').fadeOut(200, function() {
      $(this).remove();
    });
    $('#content').css({
      'margin-top': '-8rem'
    });
  } else {
    $('#content').css({
      'margin-top': '0'
    });

    $('#content').append('<div class="overlay"></div>');
    $('.overlay').fadeIn(200);
  }
});
