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
  if (event.state) { // History state exists -> Go to show page

    // Cancel document loading (Behaves like clicking stop button in browser)
    window.stop(); // NB: Necessary for aborting backdrop image loading when changing show pages

    getShowData(event.state);
  } else { // No history state -> Load homepage
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

// Get show data from tmdb id (TODO: REMOVE?)
function returnShowData(id) {
  return $.ajax({
    async: true,
    crossDomain: true,
    url: 'https://api.themoviedb.org/3/tv/' + id + '?&api_key=' + api_key,
    dataType: 'jsonp',
    method: 'GET'
  });
}

// Get show data for a specific season from tmdb id and season number
function getSeasonData(id, seasonNumber) {
  return $.ajax({
    async: true,
    crossDomain: true,
    url: 'https://api.themoviedb.org/3/tv/' + id + '/season/' + seasonNumber + '?api_key=' + api_key + '&page=2',
    dataType: 'jsonp',
    method: 'GET'
  });
}

// Get shows with upcoming episode releases (TODO: REMOVE?)
function upcomingReleases() {
  $.ajax({
    async: true,
    crossDomain: true,
    url: 'https://api.themoviedb.org/3/tv/airing_today' + '?&api_key=' + api_key,
    dataType: 'jsonp',
    method: 'GET',
    success: function(data) {
      // console.log(data['results'].length);
      for (i = 0; i < data['results'].length; i++) {
        console.log(data['results'][i]);
      }
    },
    error: function(data) {
      console.log(data);
    }
  });
}

// Get shows with upcoming episode releases v2 (TODO: REMOVE?)
function upcomingReleases2() {
  $.ajax({
    async: true,
    crossDomain: true,
    url: 'https://api.themoviedb.org/3/tv/on_the_air' + '?&api_key=' + api_key,
    dataType: 'jsonp',
    method: 'GET',
    success: function(data) {
      console.log(data);
      var resultsLength = data['results'].length;
      if (resultsLength > 15) {
        resultsLength = 15;
      }
      var showsObj = {};

      for (i = 0; i < resultsLength; i++) {
        // console.log(data['results'][i]);
        var tempId = data['results'][i]['id'];
        var title = data['results'][i]['name'];
        console.log(tempId + ' ' + title);
        showsObj[tempId] = {name: '', seasonNumber: '', seasonId: '', episode: '', release: ''};
        showsObj[tempId]['name'] = title;

        var showDetails = returnShowData(tempId);
        showDetails.done(function(showDetails) {
          // console.log(showDetails);
          var seasonNumber = showDetails['seasons'].length - 1;
          var seasonId = showDetails['seasons'][seasonNumber]['id'];
          var showId = showDetails['id'];
          showsObj[showId]['seasonNumber'] = seasonNumber;
          showsObj[showId]['seasonId'] = seasonId;

          var seasonData = getSeasonData(showId, seasonNumber);
          seasonData.then(function(seasonData) { // done instead of then?
            console.log(seasonData);
            var nextReleaseDate = false;
            var nextEpisode = false;
            var seasonDataId = seasonData['id'];
            var dateToday = Date.today().clearTime();
            var episodeCnt = seasonData['episodes'].length;
            for (cnt = episodeCnt - 1; cnt + 1 > 0; cnt--) { // Loop through each episode in season from last to first
              var episodeRelease = Date.parseExact(seasonData['episodes'][cnt]['air_date'], 'yyyy-MM-dd');

              if (Date.compare(episodeRelease, dateToday) < 0) { // Break loop if episode has been released (including episode releasing today)
                break;
              }

              nextEpisode = seasonData['episodes'][cnt]['episode_number'];
              nextReleaseDate = episodeRelease;
            }
            for ([key, value] of Object.entries(showsObj)) {
              if (seasonDataId == value['seasonId']) {
                console.log(seasonDataId + ' == ' + value['seasonId']);
                showsObj[key]['episode'] = nextEpisode;
                showsObj[key]['release'] = nextReleaseDate;
                break;
              } else {
                console.log(seasonDataId + ' != ' + value['seasonId']);
              }
            }
          });
        });
      }
      console.log(showsObj);
    },
    error: function(data) {
      console.log(data);
    }
  });
}

// Get specific episode data (TODO: REMOVE?)
function getEpisodeData(id, seasonNumber, episodeNumber) {
  $.ajax({
    async: true,
    crossDomain: true,
    url: 'https://api.themoviedb.org/3/tv/' + id + '/season/' + seasonNumber + '/episode/' + episodeNumber + '?&api_key=' + api_key,
    dataType: 'jsonp',
    method: 'GET',
    success: function(data) {
      console.log(data);
    },
    error: function(data) {
      console.log(data);
    }
  });
}

// upcomingReleases2();


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
        var posterArray = {};
        for (i = 0; i < data['results'].length && i < 5; i++) {
          var title = data['results'][i]['name'];
          var tmdbId = data['results'][i]['id'];
          var backdrop = data['results'][i]['backdrop_path'];
          var poster = data['results'][i]['poster_path'];
          var posterExists = false;
          var posterSmall = 'https://image.tmdb.org/t/p/w342' + poster;
          var releaseYear = '(' + data['results'][i]['first_air_date'].slice(0,4) + ')';

          // Check if image(poster) exists
          // TODO: CLEAR IMAGE OBJECT FROM BUFFER/CACHE
          if (poster != null) {
            // console.log(title + ' ' + posterSmall + ' (IMAGE EXISTS)');
            posterExists = true;
          } else {
            // console.log(title + ' ' + posterSmall + ' (NO IMAGE)');
          }

          $('.autocomplete_suggestions ul').append('<li>' + title + '<span class="release_year">' + releaseYear + '</span></li>');
          $('.autocomplete_suggestions ul li').eq(i).data('id', tmdbId);
          if (posterExists) {
            $('.autocomplete_suggestions .highlight_card').append('<img src="' + posterSmall +'" data-index=' + i + '>');
            // ??? $('.autocomplete_suggestions .highlight_card img').eq(i).data('imgSrc', poster);
            // $('.autocomplete_suggestions .highlight_card img').eq(i).data('index', i);
            // TODO: Large image loading
          }

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


// Autocomplete search query
$('.searchbar_input').on('input paste', function() {
  var searchQuery = $(this).val();

  if (searchQuery.length > 1) {
    autocompleteSearch(searchQuery);
  } else {
    $('.autocomplete_suggestions ul li').remove();
    $('.autocomplete_suggestions .highlight_card img').remove();
  }
});

// Update search higlight card on hover
$('.autocomplete_suggestions ul').on('mouseenter', 'li', function() {
  if (!$(this).hasClass('highlight')) {
    $('.autocomplete_suggestions ul li').removeClass('highlight');
    $(this).addClass('highlight');
    var itemIndex = $(this).index();

    $('.highlight_card img').removeClass('visible');
    $('.highlight_card img[data-index="' + itemIndex + '"]').addClass('visible');
  }
});

function displayShowInfo(show) {
  var deferred = $.Deferred();

  var showId = show['id'];
  var showTitle = show['name'];
  // var releaseYear = show['first_air_date'].slice(0,4);
  var seasonsCnt = show['seasons'].length - 1;
  var seasonNumber = show['seasons'][seasonsCnt]['season_number'];
  var releaseDate = show['seasons'][seasonsCnt]['air_date'];
  var nextReleaseDate = false;
  var nextEpisode = false;
  var cancelled = false;
  var suffix = '';

  var seasonData = getSeasonData(showId, seasonNumber);
  seasonData.then(function(seasonData) {
    // TEMP-HIDE
    console.log(seasonData);

    releaseDate = Date.parseExact(releaseDate, 'yyyy-MM-dd');
    var dateToday = Date.today().clearTime();
    if (Date.compare(releaseDate, dateToday) == -1) { // No release date announced / latest season on-going / Cancelled
      if (show['status'].toLowerCase() == 'ended' || show['status'].toLowerCase() == 'canceled') { // CANCELLED
        if (seasonNumber > 1) {
          suffix = 's';
        }
        cancelled = true;
      } else { // ON-GOING OR NOT ANNOUNCED
        var episodeCnt = seasonData['episodes'].length;
        for (i = episodeCnt - 1; i + 1 > 0; i--) { // Loop through each episode in season from last to first
          var episodeRelease = Date.parseExact(seasonData['episodes'][i]['air_date'], 'yyyy-MM-dd');

          if (Date.compare(episodeRelease, dateToday) < 0) { // Break loop if episode has been released (including episode releasing today)
            break;
          }

          nextEpisode = seasonData['episodes'][i]['episode_number'];
          nextReleaseDate = episodeRelease;
        }
        if (!nextReleaseDate) { // All episodes in current season has been released
          seasonNumber = seasonNumber + 1;
        }
      }
    } else { // New season release announced and not released
      nextReleaseDate = releaseDate;
    }

    // console.log('Season: ' + seasonNumber + ' Episode: ' + nextEpisode);
    // console.log('Release date: ' + nextReleaseDate);

    if ($('.show_info')[0]) { // Show info already exists
      $('.show_info').addClass('previous');
    }

    // $('<div class="show_info"></div>').hide().appendTo('#content');
    $('<div class="show_info"></div>').hide().appendTo('#content');
    $('.show_info:not(.previous)').append('<h1 class="show_title">' + showTitle + '</h1>');

    var emailreminder_div = '<div class="emailreminder_container"><img src="./img/notify_date_icon.svg"><h2>Get notified when it\'s out</h2><div class="submit_container"><input type="email" placeholder="you@email.com"><input type="button" value="submit"></div></div>';

    if (nextReleaseDate) { // Release date is known for season or season+episode
      nextReleaseDate = nextReleaseDate.toString('MMMM dS, yyyy');
      if (!nextEpisode) { // Season premiere
        $('.show_info:not(.previous)').append('<h2 class="episode_details">Season ' + seasonNumber + ' Premiere</h2>');
        $('.show_info:not(.previous)').append('<p class="release_date">' + nextReleaseDate + '</p>');
        $('.show_info:not(.previous)').append(emailreminder_div);
      } else { // Specific episode release
        $('.show_info:not(.previous)').append('<h2 class="episode_details">Season ' + seasonNumber + ' Episode ' + nextEpisode +'</h2>');
        $('.show_info:not(.previous)').append('<p class="release_date">' + nextReleaseDate + '</p>');
        $('.show_info:not(.previous)').append(emailreminder_div);
      }
    } else if (cancelled) { // Show is cancelled
      $('.show_info:not(.previous)').append('<p class="release_nodate">The show got cancelled after ' + seasonNumber + ' season' + suffix + '.</p>');
    } else { // Show is not cancelled but release date for next season has not been announced
      $('.show_info:not(.previous)').append('<p class="release_nodate">The release date for season ' + seasonNumber + ' has not been announced yet.</p>');
      $('.show_info:not(.previous)').append(emailreminder_div);
    }

    deferred.resolve(showTitle);
  });
  // promise.then(data => alert(data), error => alert(error));
  return deferred.promise();
}

// Load show page and update url parameter
function gotoShow(show) {
  // TEMP-HIDE console.log(show);
  // TODO: Add safety functions for shows without background

  var showTitle = show['name'];
  var backdrop = show['backdrop_path'];
  var backdropSmall = 'https://image.tmdb.org/t/p/w300' + backdrop;
  var backdropLarge = 'https://image.tmdb.org/t/p/original' + backdrop;

  var displayShowInfoPromise = displayShowInfo(show);
  var backdropSmallPromise = imgLoader(backdropSmall);
  var backdropLargePromise = imgLoader(backdropLarge);

  // Show info and small backdrop finish loading -> Animate and show
  $.when(displayShowInfoPromise, backdropSmallPromise).done(function() {
    var largeImgQuickload = true;
    searchbarToggle('hide'); // TODO: Maybe change before content load
    document.title = showTitle + ' - Showdates.tv'; // TODO: Maybe change before content load

    // Display show info
    $('.show_info.previous').remove();
    $('.show_info').show();

    // Display backdrop(s)
    if ($('.bg_container')[0]) { // Background already exists
      $('.bg_container').addClass('previous');
    }
    $('#content').before('<div class="bg_container"></div>');
    $('.bg_container:not(.previous)').append('<div class="bg_vignette"></div>');

    // Append small backdrop image as hidden
    $('.bg_container:not(.previous)').append('<div class="bg_small"></div>');
    $('.bg_container:not(.previous) .bg_small').hide();
    $('.bg_container:not(.previous) .bg_small').css({
      'background' :
        'linear-gradient(to top, rgba(47,7,67,.25),' +
        'rgba(65,41,90,.50)),' +
        'url(' + backdropSmall + ')' +
        '50% / cover no-repeat'
    });

    // Remove previous backdrop
    $('.bg_container.previous').fadeOut(150, function() {
      $(this).remove();
    });

    // Show small backdrop if large image is not loaded instantly
    if (backdropLargePromise.state() != 'resolved') {
      largeImgQuickload = false;
      $('.bg_container:not(.previous) .bg_small').show();
    }

    // Large backdrop finish loading
    $.when(backdropLargePromise).done(function() {
      // Display large backdrop image
      $('<div class="bg_large"></div>').appendTo('.bg_container:not(.previous)');


      var imgBlur = 0; // css blur(px) value
      var imgScale = 1 // css scale value
      if (!largeImgQuickload) { // Large image loaded after small image
        imgBlur = 8;
        imgScale = 1.02;
      }

      /* OLD
      $('.bg_container:not(.previous) .bg_large').css({
        'background-image' : 'url(' + backdropLarge + ')'
      });
      */
      $('.bg_container:not(.previous) .bg_large').css({
        'background' :
          'linear-gradient(to top, rgba(47,7,67,.25),' +
          'rgba(65,41,90,.50)),' +
          'url(' + backdropLarge + ')' +
          '50% / cover no-repeat'
      });

      // Hide small backdrop
      $('.bg_container:not(.previous) .bg_small').fadeOut(150);

      // Animate blur
      var setBlur = function(element, amount) {
        $(element).css({
          '-webkit-filter' : 'blur(' + amount + 'px) grayscale(20%) brightness(110%) contrast(120%)',
          'filter' : 'blur(' + amount + 'px) grayscale(20%) brightness(110%) contrast(120%)'
        });
        /* OLD
        $(element).css({
          '-webkit-filter' : 'blur(' + amount + 'px)',
          'filter' : 'blur(' + amount + 'px)'
        });
        */
      },

      tweenBlur = function(element, startAmount, endAmount, speed) {
        $({blurAmount: startAmount}).animate({blurAmount: endAmount}, {
          duration: speed,
          easing: 'swing',
          step: function() {
            setBlur(element, this.blurAmount);
          },
          callback: function() {
            setBlur(element, endAmount);
          }
        });
      };

      // Animate scale
      var setScale = function(element, amount) {
        $(element).css({
          'transform' : 'scale(' + amount + ')'
        });
      },

      tweenScale = function(element, startAmount, endAmount, speed) {
        $({scaleAmount: startAmount}).animate({scaleAmount: endAmount}, {
          duration: speed,
          easing: 'swing',
          step: function() {
            setScale(element, this.scaleAmount);
          },
          callback: function() {
            setScale(element, endAmount);
          }
        });
      };

      if (!largeImgQuickload) { // Large image loaded after small image
        tweenBlur('.bg_container:not(.previous) .bg_large', imgBlur, 0, 300);
        tweenScale('.bg_container:not(.previous) .bg_large', 1.02, 1, 600);
      } else { // Large image loaded same time as small image
        tweenBlur('.bg_container:not(.previous) .bg_large', imgBlur, 0, 0);
        tweenScale('.bg_container:not(.previous) .bg_large', 1.02, 1, 300);
      }

    });

  });
}

// Image/backdrop loader (hide image until finished loading)
function imgLoader(urlSrc) {
  var imgDeferred = $.Deferred();
  var img = new Image();

  img.onload = function() {
    imgDeferred.resolve();
  }

  img.src = urlSrc;

  return imgDeferred.promise();
}

// Disable input cursor movement on up/down arrow
$('.searchbar_input').keydown(function(e) {
  if (e.which == 38 || e.which == 40) {
    e.preventDefault();
  }
});

// Change highlighted(selected) item in autocomplete
function changeHighlightItem(direction) {
  var oldIndex = $('.autocomplete_suggestions ul li.highlight').index();
  var itemCnt = $('.autocomplete_suggestions ul li').length - 1;
  var newIndex;

  if (direction == 'next') {
    newIndex = oldIndex + 1;
  }
  if (direction == 'previous') {
    newIndex = oldIndex - 1;
  }

  if (newIndex < 0) {
    newIndex = itemCnt;
  } else if (newIndex > itemCnt) {
    newIndex = 0;
  }

  $('.autocomplete_suggestions ul li').removeClass('highlight');
  $('.autocomplete_suggestions ul li').eq(newIndex).addClass('highlight');

  $('.highlight_card img').removeClass('visible');
  $('.highlight_card img[data-index="' + newIndex + '"]').addClass('visible');
}

// Go to show page from autocomplete selection
function selectSearchSuggestion(tmdbId, showTitle) {
  $('.searchbar_input').val(showTitle);

  if (getUrlParams() != tmdbId) { // Selection is not the page you are currently on
    var url = '?id=' + tmdbId;
    window.history.pushState(tmdbId, showTitle, url);

    getShowData(tmdbId);
  } else {
    searchbarToggle('hide');
  }
}

// Go to show page on autocomplete item click
$('.autocomplete_suggestions ul').on('click', 'li', function() {
  var tmdbId = $(this).data('id');
  var showTitle = $(this).text();

  selectSearchSuggestion(tmdbId, showTitle);
});


// Autocomplete keyboard input functions (enter and arrows)
$('.searchbar_input').keyup(function(e) {
  switch (e.keyCode) {
    case 13: // Enter -> Go to show
      var selection = $('.autocomplete_suggestions ul li.highlight');
      var selectionId = $(selection).data('id');
      var selectionTitle = $(selection).contents().filter(function() {
        return this.nodeType == 3;
      }).text();

      selectSearchSuggestion(selectionId, selectionTitle);
      break;
    case 38: // Up arrow -> Highlight previous selection
      changeHighlightItem('previous');
      break;
    case 40: // Down arrow -> Higlight next selection
      changeHighlightItem('next');
      break;
  }
});


// Show/hide searchbar function
function searchbarToggle(e) {
  // var searchDeferred = $.Deferred();
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

      // searchDeferred.resolve();
    });

    $('#brand').css({
      'opacity': 1
    });

    // REMOVE?
      // $('nav').css('background-color', 'rgba(37,34,34,0)');
      $('nav').css('background-color', 'rgba(232,83,84,0)');
      $('.dark_overlay').fadeOut(200);
      /*
      $('.bg_small').fadeOut(200);
      $('.show_info, footer').css({
        'filter' : 'blur(0px)'
      });
      */
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

      // searchDeferred.resolve();
    });


    $('#brand').css({ // opacity .75
      'opacity': 1
    });

    // REMOVE?
      // $('nav').css('background-color', 'rgba(37,34,34,0.9)');
      $('nav').css('background-color', 'rgba(232,83,84,.8)');
      $('.dark_overlay').fadeIn(200);
      /*
      $('.bg_small').fadeIn(200);
      $('.show_info, footer').css({
        'filter' : 'blur(1px)'
      });
      */
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
  // return searchDeferred.promise();
}

// Toggle searchbar on click
$('#search_toggle').on('click', function() {
  if ($('#search').is(':visible')) {
    searchbarToggle('hide');
  } else {
    searchbarToggle('show');
  }
});

// Hide autocomplete on click outside
$('.content_container').click(function(e) {
  if ($('.autocomplete_suggestions').is(':visible')) {

    if ($(e.target).closest('div.autocomplete_suggestions').length === 0) { // Target not autocomplete_suggestions div
      if ($(e.target).closest('div#search_toggle').length !== 0) { // Target is div#search_toggle
        return false;
      } else if ($(e.target).closest('a#brand').length !== 0) { // Target is a#brand
        return false;
      } else if ($(e.target).closest('div#search').length !== 0) { // Target is div#search
        return false;
      } else { // Target is outside autocomplete -> Hide search
        console.log('CLICKED OUTSIDE AUTCOMPLETE');
        searchbarToggle('hide');
      }
    } else if ($(e.target).closest('div.autocomplete_suggestions').length !== 0 && $('.autocomplete_suggestions ul').has('li').length == 0) { // Autocomplete suggestion div empty and clicked
      searchbarToggle('hide');
    }

  }
});
