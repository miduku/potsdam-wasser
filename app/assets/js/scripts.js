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

  // shorthand for jQuery(document).ready()
  $(function() {
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
    var Controller = new ScrollMagic.Controller({loglevel: 3});


    // create indicators for the sections which will display in the progressbar
    function createIndicator(triggerElem, progElem, rgbStart, rgbEnd) {
      return new ScrollMagic.Scene({
        triggerElement: triggerElem,
        triggerHook: 1, // window height
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
    var IndicatorVerbrauch = createIndicator('.sec-verbrauch', '.indicator-verbrauch', [114, 120, 141], [56, 115, 185]);
    var IndicatorReinigung = createIndicator('.sec-reinigung', '.indicator-reinigung', [56, 115, 185], [134, 120, 109]);



    // Progessbar pinning
    //
    // pin scrollbar
    var ScrollBar = new ScrollMagic.Scene({
      triggerElement: '.progress-wrapper',
      triggerHook: 0, //don't trigger until triggerElement hits the top of the viewport
      duration: ($('.progress-wrapper').outerHeight() - $(window).height()),
      reverse: true // allows the effect to trigger when scrolled in the reverse direction
    })
    .addIndicators({name: 'Progressbar'})
    .setPin('.progressbar');


    // Accordion menu & image pins (Reinigung)
    //
    // while scrolling, open accordion menu accordingly
    $('section').each(function(index, el) {
      // console.log($(this).children());
      var height = $(this).outerHeight();

      new ScrollMagic.Scene({
        triggerElement: el,
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
          $('.side-verbrauch > ul').slideDown()
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
      .addTo(Controller);
    });


    // for pinning of images in .group-6-6 layout
    //
    function scrollMagicPin(triggerElem, triggerHook, duration, pushFollowers) {
      if (triggerHook === null || triggerHook === undefined) {
        triggerHook = 1 / $(window).height() * $('.header').outerHeight(); // Dreisatz baby!
      }

      var dur;
      var trigEl = $(triggerElem).attr('data-set-pin');
      if (duration === null || duration === undefined) {
        dur = $(triggerElem).outerHeight() - $(trigEl).outerHeight() - 20;
      } else {
        dur = duration;
      }

      if (pushFollowers === null || pushFollowers === undefined) {
        pushFollowers = false;
      }
      else {
        pushFollowers = true;
      }

      // console.log($('img#pin-reinigung-lageplan').height());
      return new ScrollMagic.Scene({
        triggerElement: triggerElem,
        triggerHook: triggerHook, //don't trigger until triggerElement hits the top of the viewport
        duration: dur,
        pushFollowers: pushFollowers,
        reverse: true // allows the effect to trigger when scrolled in the reverse direction
      })
      .addIndicators({name: triggerElem})
      .setPin($(triggerElem).attr('data-set-pin'));
    }

    // intro
    //
    $('.sec-intro')
      .css('min-height', $(window).height()*3 - $('.header').outerHeight())
        .children()
        .children()
        .children('.content')
        .css({
          position: 'absolute',
          top: 100/3 + '%',
          left: 0
        });


    $(window).on('load', function() {

      // Progressbar progress
      //
      // resize progressbar
      $('.progressbar, .scrollmagic-pin-spacer').css({height: $(window).outerHeight() + 2});
      $('.progressbar').append('<div class="indicator indicator-gewinnung"></div><div class="indicator indicator-verbrauch"></div><div class="indicator indicator-reinigung"></div>');

      // resize progressbar
      // $('.progressbar, .scrollmagic-pin-spacer').css({height: $(window).height()});
      ScrollBar.duration($('.progress-wrapper').outerHeight() - $(window).height());
      var reinigungLageplan = scrollMagicPin('#trigger-reinigung-lageplan');
      var reinigungMechanisch = scrollMagicPin('#trigger-reinigung-mechanische-reinigung');
      var reinigungBiologisch = scrollMagicPin('#trigger-reinigung-biologische-reinigung');

      // add ScrollMagic scenes to controller to init them
      Controller.addScene([
        IndicatorGewinnung,
        IndicatorVerbrauch,
        IndicatorReinigung,


        reinigungLageplan,
        reinigungMechanisch,
        reinigungBiologisch,
        ScrollBar
      ]);

      // loader fade away
      $('.loader').animate({opacity: 0}, 500, function() {$(this).hide();});
    });


    // with resize delay
    // http://stackoverflow.com/a/5490021
    //
    var resizeDelay;
// !!!!!!
    $(window).on('resize', function() {

      Controller.removeScene([
        reinigungLageplan,
        reinigungMechanisch,
        reinigungBiologisch,
        ScrollBar
      ]);

      // add delay for resize event
      clearTimeout(resizeDelay);

      // resize event
      resizeDelay = setTimeout(function(){
        console.log('log delay');

        Controller.addScene([
          reinigungLageplan,
          reinigungMechanisch,
          reinigungBiologisch,
          ScrollBar
        ]);
        // resize progressbar
        $('.progressbar, .scrollmagic-pin-spacer').css({height: $(window).height() + 2});
        ScrollBar.duration($('.progress-wrapper').outerHeight() - $(window).height());

        // hide sidebar if windows resize
        if (sidebar.hasClass('open')) {
          menuItems.removeClass('open');
        }

        // resize intro
        $('.sec-intro')
          .css('min-height', $(window).height()*3 - $('.header').outerHeight());

        // refresh Scroll Magic Scenes

        // for accordion
      },250); // end delay


    });

    /*
     * anchor scroll
     */
    $('.nav-sidebar a').anchorScroll({
      scrollSpeed: 800, // scroll speed
      offsetTop: $('.header').height()
   });
  });

})(jQuery, window, document);

