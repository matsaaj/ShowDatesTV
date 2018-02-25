// Detect url parameter change
window.onpopstate = function(e) {
  console.log(e);
}

// Extract url parameter data
var getUrlParams = function() {
  var urlParams = new URLSearchParams(window.location.search);
  var paramId = urlParams.get('id');
  return paramId;
};

// Populate search autocomplete
var api_key = '641e6e0b8b7681704cad2ffb456475b1';
var dataArray = [];
function autocompleteSearch(searchQuery) {
  $.ajax({
    async: true,
    crossDomain: true,
    url: 'https://api.themoviedb.org/3/search/tv?&api_key=' + api_key + '&query=' + searchQuery,
    dataType: 'jsonp',
    method: 'GET',
    success: function(data) {
      dataArray = [];
      $('.autocomplete_suggestions ul li').remove();
      $('.autocomplete_suggestions .highlight_card img').remove();

      if ($('.searchbar_input').val().length > 1) {
        for (i = 0; i < data['results'].length && i < 5; i++) {
          var title = data['results'][i]['name'];
          var tmdbId = data['results'][i]['id'];
          var backdrop = data['results'][i]['backdrop_path'];
          var poster = data['results'][i]['poster_path'];
          // TODO: ADD YEAR TO TITLE, f.ex. Game Of Thrones (2014)

          $('.autocomplete_suggestions ul').append('<li>' + title + '</li>');
          $('.autocomplete_suggestions ul li').eq(i).data('id', tmdbId);
          $('.autocomplete_suggestions .highlight_card').append('<img src="https://image.tmdb.org/t/p/w92' + poster +'">');
          $('.autocomplete_suggestions .highlight_card img').eq(i).data('imgSrc', poster);
          // TODO: Large image loading

          if (i == 0) {
            $('.autocomplete_suggestions ul li').eq(i).addClass('highlight');
            $('.autocomplete_suggestions .highlight_card img').addClass('visible');
          }

          dataArray.push({label: title, value: title, id: tmdbId});
        }
      }
      console.log(data);
      // console.log(dataArray);
      // TODO REMOVE DATA ARRAY
    }
  });
}

// Autcomplete search query
$('.searchbar_input').on('input paste', function() {
  var searchQuery = $(this).val();

  if (searchQuery.length > 1) {
    autocompleteSearch(searchQuery);
  } else {
    $('.autocomplete_suggestions ul li').remove();
  }
});

// Update search higlight card on hover
$('.autocomplete_suggestions ul').on('mouseenter', 'li', function() {
  if (!$(this).hasClass('highlight')) {
    $('.autocomplete_suggestions ul li').removeClass('highlight');
    $(this).addClass('highlight');

    $('.highlight_card img').removeClass('visible');
    $('.highlight_card img').eq($(this).index()).addClass('visible');
  }
});

// Load show page and update url parameter
function gotoShow(id, title) {
  if (getUrlParams() == id) {
    return false;
  }
  
  $('#content').empty();
  searchbarToggle('hide');

  var url = '?id=' + id;
  window.history.pushState({}, title, url);
}

// Go to show page on enter press and autocomplete item click
$('.autocomplete_suggestions ul').on('click', 'li', function() {
  var tmdbId = $(this).data('id');
  var showTitle = $(this).text();

  gotoShow(tmdbId, showTitle);
});


// Show/hide searchbar function
function searchbarToggle(e) {
  $('#search_toggle').dequeue().finish();
  $('#search').dequeue().finish();

  if (e == 'hide') {
    var pathAttr = 'M15.5,14C15.5,14,14.710000000000008,14,14.710000000000008,14C14.710000000000008,14,14.430000000000007,13.730000000000004,14.430000000000007,13.730000000000004C15.409999999999997,12.590000000000003,16,11.11,16,9.5C16,5.909999999999997,13.090000000000003,3,9.5,3C5.909999999999997,3,3,5.909999999999997,3,9.5C3,13.090000000000003,5.909999999999997,16,9.5,16C11.109999999999985,16,12.590000000000003,15.409999999999997,13.72999999999999,14.430000000000007C13.72999999999999,14.430000000000007,14,14.709999999999994,14,14.710000000000008C14,14.710000000000008,14,15.5,14,15.5C14,15.5,19,20.49000000000001,19,20.49000000000001C19,20.49000000000001,20.49000000000001,19,20.49000000000001,19C20.49000000000001,19,15.5,14,15.5,14C15.5,14,15.5,14,15.5,14M9.5,14C7.009999999999998,14,5,11.990000000000009,5,9.5C5,7.009999999999991,7.010000000000005,5,9.5,5C11.99,5,14,7.010000000000005,14,9.5C14,11.989999999999995,11.99,14,9.5,14C9.5,14,9.5,14,9.5,14';

    $('#search').slideUp(200, 'easeInOutQuad');
    $('#search input').animate({
      'opacity': .5
    }, 200, function() {
      $('.searchbar_input').val('');
    });

    $('#brand').css({
      'opacity': 1
    });

    $('.autocomplete_suggestions').slideUp(200, 'easeInOutQuad');
  }

  if (e == 'show') {
    var pathAttr = 'M19,6.41C19,6.41,17.59,5,17.59,5C17.59,5,12,10.59,12,10.59C12,10.59,6.41,5,6.41,5C6.41,5,5,6.41,5,6.41C5,6.41,10.59,12,10.59,12C10.59,12,5,17.59,5,17.59C5,17.59,6.41,19,6.41,19C6.41,19,12,13.41,12,13.41C12,13.41,17.59,19,17.59,19C17.59,19,19,17.59,19,17.59C19,17.59,13.41,12,13.41,12C13.41,12,19,6.41,19,6.41C19,6.41,19,6.41,19,6.41M19,6.41C19,6.41,19,6.41,19,6.41C19,6.41,19,6.41,19,6.41C19,6.41,19,6.41,19,6.41C19,6.41,19,6.41,19,6.41C19,6.41,19,6.41,19,6.41';

    $('#search').slideDown(200, 'easeInOutQuad');
    $('#search input').animate({
      'opacity': 1
    }, 200, function() {
      $('.searchbar_input').focus();
    });


    $('#brand').css({ // opacity .75
      'opacity': 1
    });

    $('.autocomplete_suggestions').slideDown(200, 'easeInOutQuad');
  }

  anime({
    targets: '#search_toggle path',
    d: pathAttr,
    easing: 'easeInOutQuint',
    duration: 300
  });
}

// Toggle searchbar on click
$('#search_toggle').on('click', function() {
  if ($('#search').is(':visible')) {
    searchbarToggle('hide');
  } else {
    searchbarToggle('show');
  }
});
