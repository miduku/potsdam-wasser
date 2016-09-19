// IIFE - Immediately Invoked Function Expression
// https://toddmotto.com/what-function-window-document-undefined-iife-really-means/
// http://gregfranko.com/blog/jquery-best-practices/
(function($, window, document, undefined) {

  'use strict';

  // cache some jQuery elements
  var $$ = {
    w: $(window),
    header_container: $('.header .container'),
    headerSticky: $('.header-sticky'),
    fullscreen: $('.fullscreen'),
    baselineElements: $('picture > *, .group-img img, .embed-video, figure img, .fullscreen'),

    // animations
    anim: {
      rain: $('.anim-rain')
    }
  };


  // The $ is now locally scoped
  $(function() {

  //** The DOM is ready! **//

    // baseline-element plug-in
    $$.baselineElements.baseline(function() {
      // Get the current font-size from the HTML tag – the root font-size `rem` –
      // which may change through to some CSS media queries
      return parseFloat(getComputedStyle(document.documentElement, null).getPropertyValue('line-height'));
    });


    /**
     * Magical things with ScrollMagic plugin
     */
    // init ScrollMagic controller
    var Controller = new ScrollMagic.Controller({loglevel: 3});

    // build tween
    var tween = TweenMax.staggerFromTo('.cloud', 2, {left: '100%'}, {left: '25%', ease: Power1.easeInOut}, 1);

    // build scene
    var scene = new ScrollMagic.Scene({
      triggerElement: '.anim-rain',
      triggerHook: 1,
      duration: $$.anim.rain.height()/3
    });

    scene.addTo(Controller)
      .setTween(tween)
      .addIndicators({name: 'staggering'});
  });


  //** The rest of your code goes here! **//

  /**
   * set vertical center for an element
   */
  function verticalCenter(el) {
    var parentHeight = el.parent().innerHeight();
    var elHeight     = el.innerHeight();
    var elWidth      = el.innerWidth();

    return el.css({
      'position': 'absolute',
      'top': parentHeight/2 - elHeight/2,
      'left': $$.w.outerWidth()/2 - elWidth/2,
      'paddingTop': 0
    });
  }

  // reduce frequency of handler calls
  var eventHandling = {
    allow: true,
    reallow: function() {
      eventHandling.allow = true;
    },
    delay: 50
  };

  // load, resize
  $$.w.on('load resize', function() {
    if (eventHandling.allow) {
      // resize accordingly to screen height
      var wh = $$.w.outerHeight();
      $$.fullscreen.height(wh);
      $$.anim.rain.height(wh*3);

      // trottle the event
      eventHandling.allow = false;
      setTimeout(eventHandling.reallow, eventHandling.delay);
    }
  });

  // load, resize, scroll
  $$.w.on('load scroll resize', function() {
    if (eventHandling.allow) {

      // vertical center
      verticalCenter( $$.header_container );

      // sticky logo
      var fromTop = $$.w.scrollTop();
      $$.headerSticky.toggleClass('sticking', (fromTop > $$.header_container.position().top));

      // trottle the event
      eventHandling.allow = false;
      setTimeout(eventHandling.reallow, eventHandling.delay);
    }
  });

}(jQuery, window, document)); // END iife
