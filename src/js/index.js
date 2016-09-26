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
    headerArticle: $('.header-article'),
    fullscreen: $('.fullscreen'),
    baselineElements: $('picture > *, .group-img img, .embed, figure img, .fullscreen, .header-article .l img'),

    // for animations
    anim: {
      rain: $('.anim-rain')
    }
  };

  // offset for water stream
  var streamOffsetLeft = 0.02;



  $(function() { // The $ is now locally scoped

  //------------------------//
  //** The DOM is ready!  **//

    // vertical center and stuff
    $(window).trigger('resize');

    // create flood effect elements
    $$.headerArticle.each(function() {
      // var width = $(this).innerWidth();
      // var height = $(this).innerHeight();
      // var p1 = [width*streamOffsetLeft, 0];
      // var padding = fillSquare(p1, width, height);

      $(this).append('<span class="circle"></span>')
        .children('.circle')
        .css({
          transform: 'scale(0)',
          // padding: padding,
          // marginLeft: -padding,
          // marginTop: -padding,
          left: streamOffsetLeft*100 + '%'
        });
    });

    /**
     * baseline-element plug-in
     */
    $$.baselineElements.baseline(function() {
      // Get the current font-size from the HTML tag – the root font-size `rem` –
      // which may change through to some CSS media queries
      return parseFloat(getComputedStyle(document.documentElement, null).getPropertyValue('line-height'));
    });


    /**
     * Magical things with ScrollMagic plugin
     */
    var magic = {
      // init ScrollMagic controller
      Controller: new ScrollMagic.Controller({loglevel: 3}),

      // build tween
      tween: {
        CloudFromRight: TweenMax.staggerFromTo('.cloudFromRight', 2, {left: '100%'}, {left: '0%', ease: Power1.easeInOut}, 1),
        CloudFromLeft: TweenMax.staggerFromTo('.cloudFromLeft', 2, {right: '100%'}, {right: '0%', ease: Power1.easeInOut}, 1)
      },

      // build scene
      scene: {
        CloudsFromRight: new ScrollMagic.Scene({
          triggerElement: '.anim-rain',
          triggerHook: 1,
          duration: $$.anim.rain.innerHeight()/3
        }),
        CloudsFromLeft: new ScrollMagic.Scene({
          triggerElement: '.anim-rain',
          triggerHook: 1,
          duration: $$.anim.rain.innerHeight()/3
        })
      },

      // put it all together
      cast: {
        CloudsFromRight: function() {
          return magic.scene.CloudsFromRight
            .addTo(magic.Controller)
            .setTween(magic.tween.CloudFromRight)
            .addIndicators({name: 'staggering'});
        },
        CloudsFromLeft: function() {
          return magic.scene.CloudsFromLeft
            .addTo(magic.Controller)
            .setTween(magic.tween.CloudFromLeft)
            .addIndicators({name: 'staggering2'});
        },
        Flood: function(elem) {
          return elem
            .each(function(index, el) {
              console.log($(this).outerWidth());

              new ScrollMagic.Scene({
                triggerElement: el,
                triggerHook: .8,
                duration: $(this).outerHeight()
              })
              .addTo(magic.Controller)
              .addIndicators({name: 'flood'+index})
              .on('progress', function(event) {
                $(el)
                  .children('.circle')
                  .css({transform: 'scale(' + event.progress.toFixed(2) + ')'});
              });
            });
        }
      }
    };

    magic.cast.CloudsFromRight();
    magic.cast.CloudsFromLeft();

    magic.cast.Flood( $$.headerArticle );
  });


  //---------------------------------------//
  //** The rest of your code goes here!  **//

  // reduce frequency of handler calls
  var eventHandling = {
    allow: true,
    reallow: function() {
      eventHandling.allow = true;
    },
    delay: 50
  };


  // load, resize
  $$.w.on('resize', function() {
    // resize accordingly to screen height
    var wh = $$.w.outerHeight();
    $$.fullscreen.height(wh);
    $$.anim.rain.height(wh*3);

    // vertical center
    verticalCenter( $$.header_container );
  });


  // load, resize, scroll
  $$.w.on('load scroll resize', function() {
    if (eventHandling.allow) {

      // sticky logo
      var fromTop = $$.w.scrollTop();
      $$.headerSticky.toggleClass('sticking', (fromTop > $$.header_container.position().top));

      // trottle the event
      eventHandling.allow = false;
      setTimeout(eventHandling.reallow, eventHandling.delay);
    } // END event handling
  });


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

  // /**
  //  * Calculate the circle to fill a square at given coordinates
  //  */
  // // return distance between 2 points
  // function distance(p1, p2) {
  //   var xs = p2[0] - p1[0];
  //   var ys = p2[1] - p1[1];

  //   return Math.sqrt(( xs * xs ) + ( ys * ys ));
  // }

  // // return max width of a circle needed to cover a rectangle
  // function fillSquare(p1, width, height) {
  //   // calculate radius from point to each corner of square
  //   var nw = distance(p1, [0, 0]);
  //   var ne = distance(p1, [width, 0]);
  //   var se = distance(p1, [width, height]);
  //   var sw = distance(p1, [0, height]);

  //   // return diameter required
  //   return Math.max(nw, ne, se, sw);
  // }


}(jQuery, window, document)); // END iife
