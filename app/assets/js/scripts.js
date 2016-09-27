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
    main: $('.main'),
    content: $('.content'),
    footer: $('.footer'),
    header_container: $('.header .container'),
    headerSticky: $('.header-sticky'),
    headerArticle: $('.header-article'),
    // sectionGewinnung_headerArticle: $('.section-gewinnung .header-article'),
    sectionReinigung_headerArticle: $('.section-reinigung .header-article'),
    sectionVersorgung_headerArticle: $('.section-versorgung .header-article'),
    fullscreen: $('.fullscreen'),
    baselineElements: $('picture > *, .group-img img, .embed, figure img, figure figcaption, .fullscreen, .header-article .l img'),

    // for animations
    anim: {
      rain: $('.anim-rain')
    }
  };

  // water stream settings
  var stream = {
    offsetLeft: 0,
    offsetTop: 0.8,
    width: 6,
    colors: {
      gewinnung: [40, 137, 179],
      versorgung: [56, 115, 184],
      reinigung: [130, 154, 175]
    }
  };


  $(function() { // The $ is now locally scoped

  //------------------------//
  //** The DOM is ready!  **//

    // create flood effect elements
    $$.headerArticle.append('<span class="circle"></span>');

    // vertical center and stuff
    $(window).trigger('resize');

    // create stream elements
    $$.content.append('<div class="stream"><span class="water"></span></div>')
      .children('.stream')
      .css({
        position: 'absolute',
        left: stream.offsetLeft*100 + '%',
        width: stream.width + 'px',
        marginLeft: -(stream.width/2) + 'px'
      });

    /**
     * baseline-element plug-in
     */
    $$.baselineElements.baseline(function() {
      // Get the current font-size from the HTML tag – the root font-size `rem` – which may change through to some CSS media queries
      return parseFloat(getComputedStyle(document.documentElement, null).getPropertyValue('line-height'));
    });


    /**
     * Scroll Magic!
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
        Flood: function($el) {
          return $el.each(function(index, el) {
            new ScrollMagic.Scene({
              triggerElement: el,
              triggerHook: stream.offsetTop,
              duration: $(el).outerHeight()
            })
            .addTo(magic.Controller)
            .addIndicators({name: 'flood'+index})
            .on('progress end', function(event) {
              console.log('stream'+index, event.state, event.type);
              console.log('stream'+index, event.progress.toFixed(3));

              if (event.state === 'AFTER') {/////
                console.log('after');

                $(el).children('.circle')
                  .css({transform: 'scale(1)'});
              } else {
                $(el).children('.circle')
                  .css({transform: 'scale(' + event.progress.toFixed(3) + ')'});
              }
            });
          });
        },
        Stream: function($el) {
          return $el.each(function(index, el) {
            var setDurationToElement = [$$.sectionVersorgung_headerArticle, $$.sectionReinigung_headerArticle, $$.footer];
            var maxHeight = setStreamDuration($(el).parent(), setDurationToElement[index]);
            var duration = maxHeight - $$.w.outerHeight();

            // colors
            var color = [
              stream.colors.gewinnung,
              stream.colors.versorgung,
              stream.colors.reinigung,
              stream.colors.gewinnung
            ];
            var rgbDiff = [
              color[index+1][0] - color[index][0],
              color[index+1][1] - color[index][1],
              color[index+1][2] - color[index][2]
            ];

            // magic
            var scene = new ScrollMagic.Scene({
              triggerElement: el,
              triggerHook: 0,
              duration: duration
            })
            .addTo(magic.Controller)
            .setPin(el)
            .addIndicators({name: 'Stream'+index})
            .on('progress', function(event) {
              var progress = event.progress.toFixed(3);

              var indicatorColor = [
                Math.round( color[index][0] + rgbDiff[0] * progress ),
                Math.round( color[index][1] + rgbDiff[1] * progress ),
                Math.round( color[index][2] + rgbDiff[2] * progress )
              ];

              $(el).children('.water').css({
                backgroundColor: 'rgb(' + indicatorColor.join(',') + ')',
                height: progress * 100 + '%'
              });
            });


            // load resize
            $$.w.on('load resize', function() {
              $(el).css({ maxHeight: maxHeight + 'px' });
              scene.duration(setStreamDuration($(el).parent(), setDurationToElement[index]) - $$.w.outerHeight());
              scene.refresh();
            });
          });
        }
      }
    };

    // put the magic all together
    magic.cast.CloudsFromRight();
    magic.cast.CloudsFromLeft();

    magic.cast.Flood( $$.headerArticle );
    magic.cast.Stream( $('.stream') );
  });


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


  // load, resize
  $$.w.on('load resize', function() {
    // resize accordingly to screen height
    var $windowHeight = $$.w.outerHeight();
    $$.fullscreen.outerHeight($windowHeight);
    $$.anim.rain.outerHeight($windowHeight*3);
    // $('.stream').outerHeight($windowHeight - $(this).siblings('.header-article').outerHeight());
    $('.stream').css({
      height: $windowHeight + 'px'
    });


    // vertical center
    verticalCenter( $$.header_container );

    // update flood size
    $$.headerArticle.each(function() {
      var width = $(this).innerWidth();
      var height = $(this).innerHeight();
      var p1 = [width*stream.offsetLeft, 0];

      var padding = fillSquare(p1, width, height);

      $(this).children('.circle')
        .css({
          transform: 'scale(0)',
          padding: padding,
          marginLeft: -padding,
          marginTop: -padding,
          left: stream.offsetLeft*100 + '%'
        });
    });

  });


  // load, scroll WITH delay
  $$.w.on('load scroll', function() {
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
  function verticalCenter($el) {
    var parentHeight = $el.parent().innerHeight();
    var elHeight     = $el.innerHeight();
    var elWidth      = $el.innerWidth();

    return $el.css({
      'position': 'absolute',
      'top': parentHeight/2 - elHeight/2,
      'left': $$.w.outerWidth()/2 - elWidth/2,
      'paddingTop': 0
    });
  }


  /**
   * Calculate the height of each water stream
   * and position
   */
  function setStreamDuration($el1, $el2) {
    return $el2.offset().top - $el1.offset().top;
  }

  // function positionStream($el, $fromEl, $toEl) {
  //   var height = $$.w.outerHeight();
  //   // var height = setStreamDuration( $fromEl, $toEl ) - $fromEl.outerHeight();
  //   var top = $fromEl.offset().top + $fromEl.outerHeight();

  //   return $el.css({
  //     height: height + 'px',
  //     top: top + 'px'
  //   });
  // }



  /**
   * Calculate the circle to fill a square at given coordinates
   */
  // return distance between 2 points
  function distance(p1, p2) {
    var xs = p2[0] - p1[0];
    var ys = p2[1] - p1[1];

    return Math.sqrt(( xs * xs ) + ( ys * ys ));
  }

  // return max width of a circle needed to cover a rectangle
  function fillSquare(p1, width, height) {
    // calculate radius from point to each corner of square
    var nw = distance(p1, [0, 0]);
    var ne = distance(p1, [width, 0]);
    var se = distance(p1, [width, height]);
    var sw = distance(p1, [0, height]);

    // return diameter required
    return Math.max(nw, ne, se, sw);
  }

}(jQuery, window, document)); // END iife
