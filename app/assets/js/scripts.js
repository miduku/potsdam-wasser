/*!
 * potsdam-wasser
 * 
 * 
 * @author Dustin Kummer
 * @version 1.0.0
 * Copyright 2016. MIT licensed.
 */
(function ($, window, document, undefined) {

  'use strict';

  /*
  * scroll offset
  * shrink header when scrolled
  */
  var logo = $('.logo-pw');
  var menuItems = $('.logo-pw, .sidebar');
  var sidebar = $('.sidebar');

  $(window).on('scroll', function() {
      var fromTop = $(window).scrollTop();
      $('.header').toggleClass('shrink', (fromTop > 200));
      sidebar.toggleClass('shrink', (fromTop > 200));
  });


  /*
   * hamburger menu hmmm
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
  // init ScrollMagic controller
  var Controller = new ScrollMagic.Controller();


  // Progressbar progress
  //
  $('.progressbar')
    .css({height: $(window).height()})
    .append('<div class="indicator indicator-gewinnung"></div><div class="indicator indicator-versorgung"></div><div class="indicator indicator-reinigung"></div>');


  // create indicators for the sections which will display in the progressbar
  function createIndicator(triggerElem, progElem, rgbStart, rgbEnd) {
    return new ScrollMagic.Scene({
      triggerElement: triggerElem,
      triggerHook: $(window).height(),
      duration: $(triggerElem).outerHeight()
    })
    .addIndicators({name: triggerElem})
    .on('progress', function(event) {
      $(progElem).css( 'height', (100/3 * event.progress.toFixed(3)) + '%' );

      if (rgbEnd === undefined) {
        rgbEnd = rgbStart;
      }

      // colors everywhere!!
      var rgbDiff = [
        rgbEnd[0]-rgbStart[0],
        rgbEnd[1]-rgbStart[1],
        rgbEnd[2]-rgbStart[2]
      ];
      var indicatorColor = [
        Math.round(rgbStart[0] + rgbDiff[0] * event.progress.toFixed(3)),
        Math.round(rgbStart[1] + rgbDiff[1] * event.progress.toFixed(3)),
        Math.round(rgbStart[2] + rgbDiff[2] * event.progress.toFixed(3))
      ];

      $('.indicator').css('background-color', 'rgb(' + indicatorColor.join(',') + ')');
    });
  }
  var IndicatorGewinnung = createIndicator('.sec-gewinnung', '.indicator-gewinnung', [114, 120, 141]);
  var IndicatorVersorgung = createIndicator('.sec-versorgung', '.indicator-versorgung', [114, 120, 141], [56, 115, 185]);
  var IndicatorReinigung = createIndicator('.sec-reinigung', '.indicator-reinigung', [56, 115, 185], [134, 120, 109]);


  // Progessbar pinning
  //
  // pin scrollbar
  var ScrollBar = new ScrollMagic.Scene({
    triggerElement: '.sec-gewinnung',
    triggerHook: 0, //don't trigger until triggerElement hits the top of the viewport
    duration: ($('.progress-wrapper').outerHeight() - $(window).height()),
    reverse: true // allows the effect to trigger when scrolled in the reverse direction
  })
  .addIndicators({name: 'Progressbar'})
  .setPin('.progressbar');




  // Accordion menu
  //
  var resizeId;

  // add delay for resize event
  clearTimeout(resizeId);

  // resize event
  resizeId = setTimeout(function(){

    $('section').each(function(index, element) {
      // console.log($(this).children());
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
        }
        if (index === 1) {
          $('.side-gewinnung > ul').slideDown()
            .parent('li')
            .addClass('active')
            .siblings('li')
            .removeClass('active')
              .children('ul')
              .slideUp();
        }
        else if (index === 2) {
          $('.side-versorgung > ul').slideDown()
            .parent('li')
            .addClass('active')
            .siblings('li')
            .removeClass('active')
              .children('ul')
              .slideUp();
        }
        else if (index === 3) {
          $('.side-reinigung > ul').slideDown()
            .parent('li')
            .addClass('active')
            .siblings('li')
            .removeClass('active')
              .children('ul')
              .slideUp();
        }
      })
      // .addIndicators({name: 'Accordion' + index})
      .addTo(Controller);
    });

  },250); // end delay

  // add ScrollMagic scenes to controller to init them
  Controller.addScene([
    IndicatorGewinnung,
    IndicatorVersorgung,
    IndicatorReinigung,
    ScrollBar
  ]);

  $(window).on('resize', function() {
    // resize progressbar
    $('.progressbar, .scrollmagic-pin-spacer').css({height: $(window).height()});

    // hide sidebar if windows resize
    if (sidebar.hasClass('open')) {
      menuItems.removeClass('open');
    }

    ScrollBar.duration($('.progress-wrapper').outerHeight() - $(window).height());
 });
    console.log(ScrollBar.duration);


  /*
   * anchor scroll
   */
  $('.nav-sidebar a').anchorScroll({
    scrollSpeed: 800, // scroll speed
    offsetTop: $('.header').height()
 });

})(jQuery, window, document);

