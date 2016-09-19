// IIFE - Immediately Invoked Function Expression
// https://toddmotto.com/what-function-window-document-undefined-iife-really-means/
// http://gregfranko.com/blog/jquery-best-practices/
(function(iife) {

  // The global jQuery object is passed as a parameter
  iife(jQuery, window, document);

}(function($, window, document, undefined) {

  'use strict';


  // cache some jQuery elements
  var $$ = {
    header_container: $('.header .container'),
    headerSticky: $('.header-sticky'),
    fullscreen: $('.fullscreen'),
    baselineElements: $('picture > *, .group-img img, .embed-video, figure img, .fullscreen')
  };


  // The $ is now locally scoped
  $(function() {

  //** The DOM is ready! **//

    /**
     * baseline-element plug-in
     */
    $$.baselineElements.baseline(function() {
      // Get the current font-size from the HTML tag – the root font-size `rem` –
      // which may change through to some CSS media queries
      return parseFloat(getComputedStyle(document.documentElement, null).getPropertyValue('line-height'));
    });
  });


  //** The rest of your code goes here! **//

  /**
   * set vertical center for an element
   */
  function verticalCenter(el) {
    var parentHeight = el.parent().innerHeight();
    var elHeight = el.innerHeight();
    var elWidth = el.innerWidth();

    return el.css({
      'position': 'absolute',
      'top': parentHeight/2 - elHeight/2,
      'left': $(window).outerWidth()/2 - elWidth/2,
      'paddingTop': 0
    });
  }

  // reduce frequency of handler calls
  var eventHandling = {
    allow: true,
    reallow: function() {
      eventHandling.allow = true;
    },
    delay: 100
  };

  // load, resize
  $(window).on('load resize scroll', function() {
    if (eventHandling.allow) {
      // resize .fullscreen accordingly to screen height
      var wh = $(window).outerHeight();
      $$.fullscreen.height(wh);

      // vertical center
      verticalCenter( $$.header_container );

      // sticky logo
      var fromTop = $(window).scrollTop();
      $$.headerSticky.toggleClass('sticking', (fromTop > $$.header_container.position().top));

      // trottle the event
      eventHandling.allow = false;
      setTimeout(eventHandling.reallow, eventHandling.delay);
    }
  });

}));
