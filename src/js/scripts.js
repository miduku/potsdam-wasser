(function ($, window, document, undefined) {

  'use strict';

  /*
  * scroll offset
  */
  var $header = $('.header');
  var $sidebar = $('.sidebar');

  $(window).on('scroll', function() {
      var fromTop = $(window).scrollTop();
      $header.toggleClass('shrink', (fromTop > 200));
  });

  /*
   * sticky menu
   */
  $sidebar.waypoint({
    handler: function(direction) {
      if (direction === 'down') {
        $sidebar.children().addClass('stick');
      } else {
        $sidebar.children().removeClass('stick');
      }
    },
    offset: 80
  });

  /*
   * anchor scroll
   */
  $('.nav-sidebar a').anchorScroll({
    scrollSpeed: 800, // scroll speed
    offsetTop: 48
 });

})(jQuery, window, document);

