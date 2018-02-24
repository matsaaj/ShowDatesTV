$('#btn').click(function() {
  if ($('.search_container').position().top != 0) {
    $('.search_container').css({
      'top': 0,
      'opacity': 1
    });
    $('.search').css({
      'height': '8rem',
      'opacity': 1
    });
  } else {
    $('.search_container').css({
      'top': '-4rem',
      'opacity': 0
    });
    $('.search').css({
      'height': '0',
      'opacity': 0
    });
  }
});
