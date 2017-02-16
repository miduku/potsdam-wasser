/*!
 * fastplate
 * Barebones Responsive SCSS Boilerplate with vertical rhythm
 * http://miduku.github.io/fastplate/example.html
 * @author Dustin Kummer
 * @version 0.0.1
 * Copyright 2017. MIT licensed.
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
    container: {
      intro: $('.container-intro')
    },
    icons:  $('.container .icon i'),
    icon: {
      gewinnung: $('.container-gewinnung .icon i'),
      versorgung: $('.container-versorgung .icon i'),
      reinigung: $('.container-reinigung .icon i'),
    },
    footer: $('footer h1')
  };

  // water stream settings
  var water = {
    iconPositionsArray: [$$.icon.gewinnung, $$.icon.versorgung, $$.icon.reinigung, $$.footer],
    colors: {
      gewinnung: [40, 137, 179],
      versorgung: [56, 115, 184],
      reinigung: [130, 154, 175]
    }
  };




  $(function() { // The $ is now locally scoped

    // add stream to icons
    $$.icons
      .append('<div class="waterpipe"><div class="water"></div></div>');

    /**
     * Scroll Magic!
     */
    var magic = {
      // init ScrollMagic controller
      Controller: new ScrollMagic.Controller(),

      // cast some magic -> put it all together
      cast: {
        Waterpipe: function($el) {
          // colors
          var color = [
            water.colors.gewinnung,
            water.colors.versorgung,
            water.colors.reinigung,
            water.colors.gewinnung
          ];



          return $el.each(function(i, el) {
            var rgbDiff = [
              color[i + 1][0] - color[i][0],
              color[i + 1][1] - color[i][1],
              color[i + 1][2] - color[i][2]
            ];

            var scene = new ScrollMagic.Scene({
              triggerElement: el,
              triggerHook: .8
            })
            .addTo(magic.Controller)
            .addIndicators({ name: 'Waterpipe' + i })
            .on('progress', function(e) {
              var progress = e.progress.toFixed(3);
              var progressFunction = (progress * 100 ) * progress + '%';

              var indicatorColor = [
                Math.round(color[i][0] + rgbDiff[0] * progress),
                Math.round(color[i][1] + rgbDiff[1] * progress),
                Math.round(color[i][2] + rgbDiff[2] * progress)
              ];

              var backgroundGradient = 'linear-gradient(to bottom, rgb(' + color[i][0] + ',' + color[i][1] + ',' + color[i][2] + ') 0%, rgb(' + indicatorColor.join(',') + ') 100%)';


              // water in waterpipe
              $(el)
                .children('.water')
                .css({
                  background: backgroundGradient,
                  // backgroundColor: 'rgb(' + indicatorColor.join(',') + ')',
                  height: progressFunction
                });
            });

            $$.w.on('resize', function() {
              scene
                .duration(setPipeLength(water.iconPositionsArray[i], water.iconPositionsArray[i+1]));

              scene
                .refresh();
            });
          });
        }
      }
    };

    magic.cast.Waterpipe( $('.waterpipe'));


    /**
     * baseline-element plug-in
     */
    // $$.baselineElements.baseline(function() {
    //   // Get the current font-size from the HTML tag – the root font-size `rem` – which may change through to some CSS media queries
    //   return parseFloat(getComputedStyle(document.documentElement, null).getPropertyValue('line-height'));
    // });

    $(window).trigger('resize');

  }); // END $ (locally)


  //---------------------------------------//
  //** The rest of your code goes here!  **//

  // reduce frequency of handler calls
  var eventHandling = {
    allow: true,
    reallow: function() {
      eventHandling.allow = true;
    },
    delay: 300
  };


  $$.w.on('resize', function() {
    // set container-intro's height to 100%
    $$.container.intro
      .css( 'height', $$.w.outerHeight());

    // waterpipe length
    $('.waterpipe').each(function(i, el) {
      $(el)
        .css( 'height', setPipeLength(water.iconPositionsArray[i], water.iconPositionsArray[i+1]) );
    });
  });

  // load, scroll WITH delay
  $$.w.on('load scroll', function() {
    if (eventHandling.allow) {

      // code...

      // trottle the event
      eventHandling.allow = false;
      setTimeout(eventHandling.reallow, eventHandling.delay);
    } // END event handling
  });






  // /**
  //  * set vertical center for an element
  //  */
  // function verticalCenter($el) {
  //   var parentHeight = $el.parent().innerHeight();
  //   var elHeight = $el.innerHeight();
  //   var elWidth = $el.innerWidth();

  //   return $el.css({
  //     'position': 'absolute',
  //     'top': parentHeight / 2 - elHeight / 2,
  //     'left': $$.w.outerWidth() / 2 - elWidth / 2,
  //     'paddingTop': 0
  //   });
  // }


  /**
   * Calculate the height of each water stream
   * and position
   */
  function setPipeLength($el1, $el2) {
    return $el2.offset().top - $el1.offset().top;
  }




  // /**
  //  * Calculate the circle to fill a square at given coordinates
  //  */
  // // return distance between 2 points
  // function distance(p1, p2) {
  //   var xs = p2[0] - p1[0];
  //   var ys = p2[1] - p1[1];

  //   return Math.sqrt((xs * xs) + (ys * ys));
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
