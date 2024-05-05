(function() {

  /* ( X ) Here we define all "global" variables.
     Technically they aren't globals because these
     JavaScripts are wrapped in an IIFE and so appear in
     the block-scope of an anonymous function:
   *********************************************************/

  var app, config;

  /* ( x ) Declare an Angular module "wikipediaViewer":
  **********************************************************/
  
  app = angular.module('wikipediaViewer', ['ngAnimate']);

  /* ( x ) "config" is an object that stores API values and
      dimensions of elements:
  **********************************************************/

  config = {
    WIKI_API: {
      URL: 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=',
      CALLBACK: '&callback=JSON_CALLBACK',
      ARTICLE: 'https://en.wikipedia.org/?curid='
    },
    dimension: {
      searchPos: '-55',
      responsivePos: ''
    }
  };

  /* ( x ) Add an "animate.css" class to the container
      so that the UI appears to smoothly fade in:
  **********************************************************/

  $('.container').addClass('animated fadeIn');

  /* ( x ) On resizing the window, we update dimensions of
     various elements so they do not overlap with the HUD:
  **********************************************************/

  $( window ).resize(function() {
    let winWidth = $( window ).width();
    className = { small: 'search-btn-small', big: 'search-btn-big' };
    if (winWidth >= 950) {
      $('.container')[0].style.marginTop = config.dimension.searchPos + 'px';
      $(search).removeClass(className.small); $(search).addClass(className.big);
    } else if (winWidth <= 950) {
      $('.container')[0].style.marginTop = 10 + 'px';
      $(search).removeClass(className.big); $(search).addClass(className.small);
    }
  });

  /* ( x ) Declare an Angular controller "SearchCtrl" that
      will respond to the user interacting with the search
      input element:
  **********************************************************/

  app.controller('SearchCtrl', function($scope, $http, $timeout) {
    let input = $('input'), search = $("#search");
    $('.search-input').focus(function() {
        $(this).attr('data-default', $(this).width());
        $(this).animate({ width: '60%' }, 'slow');
    }).blur(function() {
        $(this).animate({ width: $(this).attr('data-default') }, 'slow');
    });

    /* ( x ) In this fucntion, the search bar is moved upwards
        when the user submits a query so as to display more
        search results:
    ********************************************************/

    $scope.scrollUp = function () {
      $('.app-title').fadeOut(1000);
      $('.wikipedia-logo').fadeOut(1000);
      setTimeout(function() {
        let searchPos, relativePos = 0;
        searchPos = ($( window ).width() <= 950 ) ? config.dimension.searchPos + -120 : config.dimension.searchPos;
        setInterval(function() {
          if (relativePos > searchPos) {
            relativePos -= 10;
            $('.container')[0].style.marginTop = relativePos + 'px';
          }
        }, 50);
      }, 500);
    }

    /* ( x ) Here we retrive Wikipedia search results
       (using API), we push them to an array, enumerate
       over array and display them on the page:
    ********************************************************/

    $scope.search = function() {
      $scope.scrollUp();
      $scope.results = [];
      $http.jsonp(config.WIKI_API.URL + input.val() + config.WIKI_API.CALLBACK).success(function(data) {
        let results = data.query.pages;
        angular.forEach(results, function(article)  {
          $scope.results.push({title: article.title, body: article.extract, page: config.WIKI_API.ARTICLE + article.pageid});
        })
      });
    }
  });
}());