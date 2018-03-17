$(function() {

  if (getUrlParams()) {
    var showId = getUrlParams();
    $('#search_toggle svg path').attr('d', 'M15.5,14C15.5,14,14.710000000000008,14,14.710000000000008,14C14.710000000000008,14,14.430000000000007,13.730000000000004,14.430000000000007,13.730000000000004C15.409999999999997,12.590000000000003,16,11.11,16,9.5C16,5.909999999999997,13.090000000000003,3,9.5,3C5.909999999999997,3,3,5.909999999999997,3,9.5C3,13.090000000000003,5.909999999999997,16,9.5,16C11.109999999999985,16,12.590000000000003,15.409999999999997,13.72999999999999,14.430000000000007C13.72999999999999,14.430000000000007,14,14.709999999999994,14,14.710000000000008C14,14.710000000000008,14,15.5,14,15.5C14,15.5,19,20.49000000000001,19,20.49000000000001C19,20.49000000000001,20.49000000000001,19,20.49000000000001,19C20.49000000000001,19,15.5,14,15.5,14C15.5,14,15.5,14,15.5,14M9.5,14C7.009999999999998,14,5,11.990000000000009,5,9.5C5,7.009999999999991,7.010000000000005,5,9.5,5C11.99,5,14,7.010000000000005,14,9.5C14,11.989999999999995,11.99,14,9.5,14C9.5,14,9.5,14,9.5,14');
    getShowData(showId);
  } else {
    searchbarToggle('show');
  }
});

// Detect url parameter change
window.onpopstate = function(event) {
  if (event.state) {
    getShowData(event.state);
  } else {
    window.location.href = './';
  }
};

// Extract url parameter data
var getUrlParams = function() {
  var urlParams = new URLSearchParams(window.location.search);
  var paramId = urlParams.get('id');
  return paramId;
};

var api_key = '641e6e0b8b7681704cad2ffb456475b1';
var dataArray = {};

// Get show data from tmdb id
function getShowData(id) {
  $.ajax({
    async: true,
    crossDomain: true,
    url: 'https://api.themoviedb.org/3/tv/' + id + '?&api_key=' + api_key,
    dataType: 'jsonp',
    method: 'GET',
    success: function(data) {
      gotoShow(data);
    },
    error: function(data) {
      window.location.href = './';
    }
  });
}

// Populate search autocomplete
function autocompleteSearch(searchQuery) {
  $.ajax({
    async: true,
    crossDomain: true,
    url: 'https://api.themoviedb.org/3/search/tv?&api_key=' + api_key + '&query=' + searchQuery,
    dataType: 'jsonp',
    method: 'GET',
    success: function(data) {
      dataArray = {};
      $('.autocomplete_suggestions ul li').remove();
      $('.autocomplete_suggestions .highlight_card img').remove();

      if ($('.searchbar_input').val().length > 1) {
        for (i = 0; i < data['results'].length && i < 5; i++) {
          var title = data['results'][i]['name'];
          var tmdbId = data['results'][i]['id'];
          var backdrop = data['results'][i]['backdrop_path'];
          var poster = data['results'][i]['poster_path'];
          var posterExists = false;
          var posterSmall = 'https://image.tmdb.org/t/p/w92' + poster;
          var releaseYear = '(' + data['results'][i]['first_air_date'].slice(0,4) + ')';
          console.log(title + ' ' + posterSmall);

          // Check if image(poster) exists
          // TODO: CLEAR IMAGE OBJECT FROM BUFFER/CACHE
          if (poster != null) {
            if (image) {
              console.log("IMAGE EXISTS");
            }

            var image = new Image();

            image.onload = function() {
              if (image.width != 0) {
                posterExists = true;
              }
            };

            image.src = posterSmall;
          }

          $('.autocomplete_suggestions ul').append('<li>' + title + '<span class="release_year">' + releaseYear + '</span></li>');
          $('.autocomplete_suggestions ul li').eq(i).data('id', tmdbId);
          if (posterExists) {
            $('.autocomplete_suggestions .highlight_card').append('<img src="' + posterSmall +'">');
            $('.autocomplete_suggestions .highlight_card img').eq(i).data('imgSrc', poster);
            // TODO: Large image loading
          }
          console.log(title + ' ' + posterExists);

          if (i == 0) {
            $('.autocomplete_suggestions ul li').eq(i).addClass('highlight');
            if (posterExists) {
              $('.autocomplete_suggestions .highlight_card img').addClass('visible');
            }
          }

          dataArray[tmdbId] = data['results'][i];
          // dataArray.push({id: tmdbId, data: data['results'][i]});
          // dataArray.push({label: title, value: title, id: tmdbId});
        }
      }
      // console.log(data);
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

function displayShowInfo(show) {
  $('#content > *:not(.autocomplete_suggestions)').remove();

  var showTitle = show['name'];

  $('#content').append('<h1>' + showTitle + '</h1>');

}

// Load show page and update url parameter
function gotoShow(show) {
  console.log(show);

  searchbarToggle('hide');

  var showTitle = show['name'];
  var backdrop = show['backdrop_path'];
  var backdropSmall = 'https://image.tmdb.org/t/p/w45' + backdrop;
  var backdropLarge = 'https://image.tmdb.org/t/p/w1280' + backdrop;

  document.title = showTitle + ' - Showdates.tv';

  $('#content > *:not(.autocomplete_suggestions)').remove();
  // $('#content').empty();
  if ($('.bg_container')[0]) {
    $('.bg_container').addClass('previous');
  }
  $('#content').before('<div class="bg_container"></div>');

  var imgSmall = new Image();
  var imgLarge = new Image();
  var imgLargeLoaded = false;
  var delayTimer = false;

  imgLarge.onload = function() {
    console.log('large img loaded');
    imgLargeLoaded = true;
    $('.bg_container:not(.previous)').append('<div class="bg_large"></div>');
    $('.bg_container:not(.previous) .bg_large').hide().css({
      'background-image' : 'url(' + backdropLarge + ')'
    });

    console.log('showing large img');
    $('.bg_container:not(.previous) .bg_large').fadeIn(300);

    setTimeout(function() {
      $('.bg_container.previous').remove();
    }, 300);
  }

  imgSmall.onload = function() {
    console.log('small img loaded');
    setTimeout(function() {
      if (!imgLargeLoaded) { // Large img not loaded 50ms after small img
        console.log('showing small img');
        $('.bg_container:not(.previous) .bg_small').show();
      }
    }, 50);
    $('.bg_container:not(.previous)').append('<div class="bg_small"></div>');
    $('.bg_container:not(.previous) .bg_small').hide().css({
      'background-image' : 'url(' + backdropSmall + ')'
    });

    imgLarge.src = backdropLarge;
  }

  imgSmall.src = backdropSmall;

  displayShowInfo(show);

}

// Go to show page on enter press and autocomplete item click
$('.autocomplete_suggestions ul').on('click', 'li', function() {
  var tmdbId = $(this).data('id');
  var showTitle = $(this).text();

  if (getUrlParams() != tmdbId) {
    var url = '?id=' + tmdbId;
    window.history.pushState(tmdbId, showTitle, url);

    getShowData(tmdbId);
  } else {
    searchbarToggle('hide');
  }
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
      // Clear autocomplete suggestions from dom
      $('.highlight_card img').remove();
      $('.autocomplete_suggestions ul li').remove();
      $('.searchbar_input').val('');
    });

    $('#brand').css({
      'opacity': 1
    });

    // REMOVE?
      // $('nav').css('background-color', 'rgba(37,34,34,0)');
      $('.dark_overlay').fadeOut(200);
    //

    // $('.autocomplete_suggestions').slideUp(200, 'easeInOutQuad');
    $('.autocomplete_suggestions').fadeOut(200);
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

    // REMOVE?
      // $('nav').css('background-color', 'rgba(37,34,34,0.9)');
      $('.dark_overlay').fadeIn(200);
    //

    $('.autocomplete_suggestions').css('display', 'flex').hide();
    // $('.autocomplete_suggestions').slideDown(200, 'easeInOutQuad');
    $('.autocomplete_suggestions').fadeIn(200);
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
