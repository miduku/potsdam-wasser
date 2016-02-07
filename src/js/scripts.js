(function ($, window, document, undefined) {

  'use strict';


  var header = $('.header');
  var logo = $('.logo-pw');
  var sidebar = $('.sidebar');
  var menuItems = $('.logo-pw, .sidebar');
  var progBar = $('.progressbar');


  // init ScrollMagic controller
  var controller = new ScrollMagic.Controller();

  /*
  * scroll offset
  */
  $(window).on('scroll', function() {
      var fromTop = $(window).scrollTop();
      header.toggleClass('shrink', (fromTop > 200));
      sidebar.toggleClass('shrink', (fromTop > 200));
  });

  /*
   * hamburger hmmm
   */
  logo.on('click', function(event) {
    event.preventDefault();

    if (sidebar.hasClass('open')) {
      menuItems.removeClass('open');
    } else {
      menuItems.addClass('open');
    }
  });

  $('main, footer').on('click', function() {
    if (sidebar.hasClass('open')) {
      menuItems.removeClass('open');
    }
  });


  /*
   * Magical things with ScrollMagic
   */
  var resizeId;

  $(window).on('load resize', function() {
    // resize progressbar
    progBar.css({height: $(window).height()});

    // progessbar
    //
    var progWrapperH = $('.progress-wrapper').outerHeight();

    new ScrollMagic.Scene({
      triggerElement: '.sec-wassergewinnung > h1',
      duration: progWrapperH
    }).setPin('.progressbar');

    console.log(progBar);

    // hide sidebar if windows resize
    if (sidebar.hasClass('open')) {
      menuItems.removeClass('open');
    }



    clearTimeout(resizeId); // add delay for resize event
    resizeId = setTimeout(function(){
      // accordion menu
      //
      $('section').each(function(index, element) {
        var height = $(this).outerHeight();

        new ScrollMagic.Scene({
          triggerElement: element,
          duration: height
        })
        .on('enter', function() {
          if (index === 0) {
            $('.side-intro').addClass('active')
              .siblings('li')
              .removeClass('active')
                .children('ul')
                .slideUp();

            console.log('gewinnung');
          }
          if (index === 1) {
            $('.side-gewinnung > ul').slideDown()
              .parent('li')
              .addClass('active')
              .siblings('li')
              .removeClass('active')
                .children('ul')
                .slideUp();

            console.log('gewinnung');
          }
          else if (index === 2) {
            $('.side-versorgung > ul').slideDown()
              .parent('li')
              .addClass('active')
              .siblings('li')
              .removeClass('active')
                .children('ul')
                .slideUp();

            console.log('versorgung');
          }
          else if (index === 3) {
            $('.side-reinigung > ul').slideDown()
              .parent('li')
              .addClass('active')
              .siblings('li')
              .removeClass('active')
                .children('ul')
                .slideUp();

            console.log('reinigung');
          }

        })
        .addTo(controller);
      });
    },250); // end delay
  });

  /*
   * anchor scroll
   */
  $('.nav-sidebar a').anchorScroll({
    scrollSpeed: 800, // scroll speed
    offsetTop: 54
 });

})(jQuery, window, document);

