// IIFE - Immediately Invoked Function Expression
// https://toddmotto.com/what-function-window-document-undefined-iife-really-means/
// http://gregfranko.com/blog/jquery-best-practices/
(function(iife) {

  // The global jQuery object is passed as a parameter
  iife(jQuery, window, document);

}(function($, window, document, undefined) {

  'use strict';

  // The $ is now locally scoped
  $(function () {
  // The DOM is ready!

    /**
     * baseline-element plug-in
     */
    $('picture > *, .group-img img, .embed-video, figure img, .fullscreen')
      .baseline(function() {
        // Get the current font-size from the HTML tag – the root font-size `rem` –
        // which may change through to some CSS media queries
        return parseFloat(getComputedStyle(document.documentElement, null).getPropertyValue('line-height'));
      });
  });

  // The rest of your code goes here!

  // resize .fullscreen accordingly to screen height
  $(window).on('load resize', function() {
    var wh = $(window).outerHeight();
    $('.fullscreen').height(wh);
  });

}));
