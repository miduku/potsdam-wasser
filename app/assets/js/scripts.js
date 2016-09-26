/*!
 * fastplate
 * Barebones Responsive SCSS Boilerplate with vertical rhythm
 * http://miduku.github.io/fastplate/example.html
 * @author Dustin Kummer
 * @version 0.0.1
 * Copyright 2016. MIT licensed.
 */
/*!
* Baseline.js 1.1
*
* Copyright 2013, Daniel Eden http://daneden.me
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: 2014-06-20
*/

(function (window, $) {

  'use strict';

  var baseline = (function () {

    /**
     * `_base` will later hold the value for the current baseline that matches
     * the given breakpoint. `_breakpoints` will hold a reference to all
     * breakpoints given to the baseline call.
     */

    var _base = 0,
      _breakpoints = {},
      _dynamicBase;

    /**
     * @name     _setBase
     *
     * Set the correct margin-bottom on the given element to get back to the
     * baseline.
     *
     * @param    {Element}  element
     *
     * @private
     */

    function _setBase (element) {
      var height = element.offsetHeight,
        current, old;

      if( _dynamicBase ) {

          /**
           * Compute the _base through a user defined function on each execution.
           * This could be used to get the current grid size for different breakpoints
           * from an actual element property instead of defining those breakpoints in the options.
           */
        _base = _dynamicBase();

      }
      else {

        /**
         * In this step we loop through all the breakpoints, if any were given.
         * If the baseline call received a number from the beginning, this loop
         * is simply ignored.
         */

        for (var key in _breakpoints) {
          current = key;

          if (document.body.clientWidth > current && current >= old) {
            _base = _breakpoints[key];
            old = current;
          }
        }

      }

      /**
       * We set the element's margin-bottom style to a number that pushes the
       * adjacent element down far enough to get back onto the baseline.
       */

      element.style.marginBottom = _base - (height % _base) + 'px';
    }

    /**
     * @name     _init
     *
     * Call `_setBase()` on the given element and add an event listener to the
     * window to reset the baseline on resize.
     *
     * @param    {Element}  element
     *
     * @private
     */

    function _init (element) {
      _setBase(element);

      if ('addEventListener' in window) {
        window.addEventListener('resize', function () { _setBase(element); }, false);
      } else if ('attachEvent' in window) {
        window.attachEvent('resize', function () { _setBase(element); });
      }
    }

    /**
     * @name     baseline
     *
     * Gets the correct elements and attaches the baseline behaviour to them.
     *
     * @param    {String/Element/NodeList}  elements
     * @param    {Number/Object}            options
     */

    return function baseline (elements, options) {

      /**
       * Accept a NodeList or a selector string and set `targets` to the
       * relevant elements.
       */

      var targets = typeof elements === 'string' ? document.querySelectorAll(elements) : elements,
        len = targets.length;

      /**
       * Decide whether to set the `_breakpoints` or `_dynamicBase` variables or not.
       * This will be relevant in the `_setBase()` function.
       */

      if (typeof options === 'number') {
        _base = parseInt(options, 10);
      } else if (typeof options === 'function') {
        _dynamicBase = options;
      } else if (typeof options === 'object') {
        var em = parseInt(getComputedStyle(document.body, null).getPropertyValue('font-size'), 10);

        for (var point in _breakpoints) {
          var unitless = /\d+em/.test(point) ? parseInt(point, 10) * em : /\d+px/.test(point) ? parseInt(point, 10) : point;
          _breakpoints[unitless] = parseInt(_breakpoints[point], 10);
        }
      }

      /**
       * If we have multiple elements, loop through them, otherwise just
       * initialise the functionality on the single element.
       */

      if (len > 1) {
        while (len--) { _init(targets[len]); }
      } else {
        _init(targets[0]);
      }
    };

  }());

  /**
   * Export baseline as a jQuery or Zepto plugin if any of them are loaded,
   * otherwise export as a browser global.
   */

  if (typeof $ !== 'undefined') {
    $.extend($.fn, {
      baseline: function (options) {
        return baseline(this, options);
      }
    });
  } else {
    window.baseline = baseline;
  }

}(window, window.jQuery || window.Zepto || undefined));

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
        Flood: function(elem, hook) {
          return elem
            .each(function(index, el) {
              new ScrollMagic.Scene({
                triggerElement: el,
                triggerHook: hook,
                duration: $(this).outerHeight()
              })
              .addTo(magic.Controller)
              .addIndicators({name: 'flood'+index})
              .on('progress', function(event) {
                $(el)
                  .children('.circle')
                  .css({transform: 'scale(' + event.progress.toFixed(3) + ')'});
              });
            });
        }
      }
    };

    magic.cast.CloudsFromRight();
    magic.cast.CloudsFromLeft();

    magic.cast.Flood( $$.headerArticle, .8 );
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
