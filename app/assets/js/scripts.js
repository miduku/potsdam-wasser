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
(function($, d3, window, document, undefined) {

  'use strict';

  // cache some jQuery elements
  var $$ = {
    win: $(window),
    bod: $('body'),
    navContainer: $('.nav-container'),
    wide: $('main .wide'),

    navMain: {
      _this: $('.nav-main'),

      a: $('.nav-main a'),
      icon: {
        _this: $('.nav-main ul i'),

        gewinnung:  $('.nav-main-gewinnung i'),
        versorgung: $('.nav-main-versorgung i'),
        reinigung:  $('.nav-main-reinigung i'),
        natur:      $('.nav-main-natur i'),
        last:       $('.nav-main-last i')
      }
    },

    section: {
      intro: $('#section-intro'),
      natur: $('#section-natur')
    },

    icon: {
      _this: $('.container .icon i'),

      gewinnung:  $('#section-gewinnung .icon i'),
      versorgung: $('#section-versorgung .icon i'),
      reinigung:  $('#section-reinigung .icon i'),
      natur:      $('#section-natur .icon i')
    },

    footer: {
      _this: $('footer')
    }
  };

  // water stream settings
  var water = {
    iconPositionsArr: {
      mainIcons: [$$.icon.natur, $$.icon.gewinnung, $$.icon.versorgung, $$.icon.reinigung, $$.footer._this],
      navIcons: [$$.navMain.icon.natur, $$.navMain.icon.gewinnung, $$.navMain.icon.versorgung, $$.navMain.icon.reinigung, $$.navMain.icon.last]
    },
    colors: {
      gewinnung:  [40, 137, 179],
      versorgung: [56, 115, 184],
      reinigung:  [130, 154, 175],
      natur:      [46, 156, 204]
    },
    offset: {
      fromTop: 0.75
    }
  };

  // Event handling: reduce frequency of handler calls
  var eventHandling = {
    allow: true,
    reallow: function() {
      eventHandling.allow = true;
    },
    delay: 300
  };

  var d3s = {
    wasserbedarf: {
      w: 800,
      h: 600,
      colors: ['#2889B3', '#3873B8', '#829AAF', '#2E9CCC'],
      data: 'assets/data/taeglicher-gesamt-wasserbedarf-potsdams.csv'
    }
  };







  $(function() { // The $ is now locally scoped

    // add main waterpipe to icons and container-animation
    $$.icon._this.append('<div class="waterpipe"><div class="water"></div></div>');

    // add navigation waterpipe
    $$.navMain._this.children('ul')
      .find('li:not(:last) i')
      .append('<div class="waterpipeNav"><div class="water"></div></div>');


    // add flood element
    $$.wide.prepend('<div class="flood"><div class="circle"></div></div>');

    // add rain element
    $$.section.natur.prepend('<div class="weather"><div class="rain"></div></div>');
      // weather height because ScrollMagic doesn't like height: 100%


    // click events for main nav
    //
    // create overlays
    $$.bod.prepend('<div class="click-overlay"></div>');
    $$.navMain._this.prepend('<div class="click-navOverlay"></div>');

    // smooth scroll for nav-main
    $('.nav-main:not(.hidden) a[href^="#"]').bind('click.smoothscroll', function(e) {
      e.preventDefault();

      var target = this.hash;
      var $target = $(target);

      $('.click-overlay').removeClass('visible');

      $('html, body').stop()
      .animate({
        'scrollTop': $target.offset().top
      }, 900, 'swing', function() {
        window.location.hash = target;

        $$.navMain._this
          .addClass('hidden');

      });
    });

    $$.navMain._this.children('.click-navOverlay')
    .on('click', function(e) {
      e.preventDefault();
      var parent = $(this).parent();

      if ( parent.hasClass('hidden') ) {
        parent
          .removeClass('hidden');
        $('.click-overlay')
          .addClass('visible');
      }
    });

    $('.click-overlay').on('click', function(e) {
      e.preventDefault();

      $(this)
        .removeClass('visible');

      $$.navMain._this
        .addClass('hidden');
    });



    /**
     * Scroll Magic!
     */
    var magic = {
      // init ScrollMagic controller
      Controller: new ScrollMagic.Controller(),

      // scenes for casting
      scene: {
        NavSticky: new ScrollMagic.Scene({
          triggerElement: '#section-intro',
          triggerHook: 0,
          duration: getDistance($$.section.intro, $$.section.natur)
        })
      },

      // cast some magic -> put it all together
      cast: {
        NavSticky: function() {
          return magic.scene.NavSticky
              .addTo(magic.Controller)
              .addIndicators({ name: 'navSticky' })
              .on('progress resize', function(e){
                var progress = e.progress;

                if (0.5 <= progress && progress < 1) {
                  $$.navMain._this
                      .removeClass('retracted hidden')
                      .addClass('extended')
                      .css({
                        'left': 0
                      });

                  $('.click-overlay')
                      .removeClass('visible');

                } else if (progress === 1) {
                  $$.navMain._this
                      .removeClass('retracted extended')
                      .addClass('hidden extended')
                      .css({
                        'left': 0
                      });
                } else {
                  $$.navMain._this
                      .removeClass('extended hidden')
                      .addClass('retracted')
                      .css({
                        'left': $$.navContainer.offset().left
                      });
                }
              });
        },

          // set when weather is shown
        Weather: function($el) {
          var className = $el.attr('id');
          var $weatherElement = $el.find('.weather');

          return new ScrollMagic.Scene({
            triggerElement: '#' + className,
            triggerHook: .5,
            duration: $$.win.outerHeight()*3
          })
            .addTo(magic.Controller)
            .addIndicators({ name: 'weather' })
            .on('progress', function(e) {
              var progress = e.progress.toFixed(1);

              if (0.1 < progress && progress <= 0.8) {
                $weatherElement
                  .css('opacity', 1);
              } else {
                $weatherElement
                  .css('opacity', 0);
              }
            });
        },

          // insert a flood effect to elemenet
        Flood: function($el) {
          return $el.each(function(i, el) {
            var $this = $(el);

              // magic here
            new ScrollMagic.Scene({
              triggerElement: el,
              triggerHook: .6,
              duration: $this.outerHeight()
            })
              .addTo(magic.Controller)
              .addIndicators({ name: 'flood' + i })
              .on('progress', function(e) {
                var progress = e.progress.toFixed(3);

                $this
                  .children('.flood')
                  .children('.circle')
                  .css({
                    'transform': 'scale(' + progress + ')'
                  });

                if (progress >= 0.25) {
                  $this
                    .addClass('showText');
                } else {
                  $this
                    .removeClass('showText');
                }
              })
              .on('update leave', function(e) {
                if (e.type === 'leave' && e.target.controller().info('scrollDirection') === 'FORWARD') {
                  $this
                    .next('.container')
                    .css('opacity', 1);
                }
              });
          });
        },

        Waterpipe: function($el, $iconPositionsArr) {
            // colors sequence
          var color = [
            water.colors.natur,
            water.colors.gewinnung,
            water.colors.versorgung,
            water.colors.reinigung,
            water.colors.natur
          ];

          return $el.each(function(i, el) {
            var $this = $(el);

            var rgbDiff = [
              color[i+1][0] - color[i][0],
              color[i+1][1] - color[i][1],
              color[i+1][2] - color[i][2]
            ];

              // magic here
            var scene = new ScrollMagic.Scene({
              triggerElement: el,
              triggerHook: water.offset.fromTop
            })
              .addTo(magic.Controller)
              .addIndicators({ name: 'Waterpipe' + i })
              .on('progress', function(e) {
                var progress = e.progress.toFixed(3);
                var prog     = (progress * 100);

                var progLin = prog + '%';
                var progExp = prog * progress + '%';

                var indicatorColor = [
                  Math.round(color[i][0] + rgbDiff[0] * progress),
                  Math.round(color[i][1] + rgbDiff[1] * progress),
                  Math.round(color[i][2] + rgbDiff[2] * progress)
                ];

                var backgroundGradient = 'linear-gradient(to bottom, rgb(' + color[i][0] + ',' + color[i][1] + ',' + color[i][2] + ') 0%, rgb(' + indicatorColor.join(',') + ') 100%)';


                // water in main waterpipe
                $this
                  .children('.water')
                  .css({
                    background: backgroundGradient,
                    height: progExp
                  });

                // water in navigation waterpipe
                $$.navMain.icon._this
                  .eq(i)
                  .children('.waterpipeNav')
                  .children('.water')
                  .css({
                    background: backgroundGradient,
                    height: progLin
                  });
              });

            $$.win.on('resize', function() {
              scene.duration(getPipeLength($iconPositionsArr[i], $iconPositionsArr[i+1]));
              scene.refresh();
            });
          });
        }
      }
    };

    magic.cast.Weather( $('#section-natur') );
    magic.cast.Waterpipe( $('.waterpipe'), water.iconPositionsArr.mainIcons, 'exponential');
    magic.cast.Flood( $$.wide );
    magic.cast.NavSticky();


    /**
     * baseline-element plug-in
     */
    // $$.baselineElements.baseline(function() {
    //   // Get the current font-size from the HTML tag – the root font-size `rem` – which may change through to some CSS media queries
    //   return parseFloat(getComputedStyle(document.documentElement, null).getPropertyValue('line-height'));
    // });

    // D3
    d3PieChart(d3s.wasserbedarf.w, d3s.wasserbedarf.h, d3s.wasserbedarf.colors, d3s.wasserbedarf.data);


    // trigger
    $$.win.trigger('resize');
    $$.navMain._this.trigger('resize');


  }); // END $ (locally)


  //---------------------------------------//
  //** The rest of your code goes here!  **//

  $$.win.on('resize', function() {
    // set section-intro's height to 100%
    $$.section.intro
      .css('height', $$.win.outerHeight());

    // set section-natur's height to 200% and margin-bottom 100%
    $$.section.natur
      .css({
        'height': $$.win.outerHeight()*4,
        'marginBottom' : $$.win.outerHeight()
      });

    // weather height because ScrollMagic doesn't like height: 100%
    $('.weather')
      .css('height', $$.section.natur.outerHeight());

    // waterpipe length
    $('.waterpipe')
      .each(function(i, el) {
        $(el)
          .css('height', getPipeLength( water.iconPositionsArr.mainIcons[i], water.iconPositionsArr.mainIcons[i+1] ));
      });

    // nav waterpipe length
    $$.navMain.icon._this
      .each(function(i, el) {
        if (i < water.iconPositionsArr.navIcons.length - 1) {
          $(el)
            .children('.waterpipeNav')
            .css('height', getPipeLength( water.iconPositionsArr.navIcons[i], water.iconPositionsArr.navIcons[i+1] ));
        }
      });

    // reposition flood effect
    $$.wide
      .each(function(i, el) {
        var $this = $(el);

        var $icon = {
          _this: $this.find('.icon i'),
          size: $this.find('.icon i').outerWidth()
        };

        var flood = {
          posTop:  $icon._this.position().top,
          posLeft: $icon._this.offset().left,
          size:  $this.outerWidth()
        };

        $this
          .children('.flood')
          .children('.circle')
          .css({
            'left': flood.posLeft + $icon.size/2 - (flood.size),
            'top': flood.posTop + $icon.size/2 - (flood.size),
            'width': flood.size*2,
            'height': flood.size*2
          });
      });

  });


  // // load, scroll WITH delay
  // $$.win
  //   .on('load scroll', function() {
  //     if (eventHandling.allow) {

  //       // insert code to throttle here...

  //       // trottle the event
  //       eventHandling.allow = false;
  //       setTimeout(eventHandling.reallow, eventHandling.delay);
  //     } // END event handling
  //   });






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
  //     'left': $$.win.outerWidth() / 2 - elWidth / 2,
  //     'paddingTop': 0
  //   });
  // }


  /**
   * Calculate the length of each water stream
   */
  function getPipeLength($el1, $el2) {
    return $el2.offset().top - $el1.offset().top - $el1.outerHeight();
  }


  /**
   * Calculate the distance between two elements
   */
  function getDistance($el1, $el2) {
    return $el2.offset().top - $el1.offset().top;
  }


  /**
   * D3
   */
  function d3PieChart(width, height, colorsArray, csvData) {
    // pie chart
    var pieWidth = width;
    var pieHeight = height;
    var pieRadius = Math.min(pieWidth, pieHeight) / 2;
    var pieColor = d3.scaleOrdinal()
      .range(colorsArray);
    var pieArc = d3.arc()
      .outerRadius(pieRadius - 50)
      .innerRadius(0);
    var pieLabelArc = d3.arc()
      .outerRadius(pieRadius - 10)
      .innerRadius(pieRadius - 10);
    var pieData = csvData;


    var d3Pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.Value; });

    var svgPie = d3.select('.d3Verteilung > div')
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '0 0 ' + pieWidth + ' ' + pieHeight)
          .append('g')
          .attr('class', 'g')
          .attr('transform', 'translate(' + pieWidth * 0.5 + ',' + pieHeight * 0.5 + ')' );

    svgPie.append('g')
      .attr('class', 'arcs');
    svgPie.append('g')
      .attr('class', 'labels');
    svgPie.append('g')
      .attr('class', 'lines');



    d3.csv(pieData, typeIsNumbers, function(error, data) {
      if (error) throw error;

      var arc = svgPie.select('.arcs')
        .selectAll('.arc')
        .data( d3Pie(data) )
        .enter();

      arc.append('path')
        .attr('class', 'arc')
        .attr('d', pieArc)
        .style('stroke', '#ffffff')
        .style('stroke-linejoin', 'round')
        .style('stroke-width', 2)
        .style('fill', function(d) { return pieColor(d.data.Label); });


      var text = svgPie.select('.labels')
        .selectAll('.label')
        .data( d3Pie(data) )
        .enter();

      text.append('text')
        .attr('class', 'label')
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .attr('transform', function(d) { return 'translate(' + pieLabelArc.centroid(d) + ')'; })
        .style('font-size', '1.25em')
        .text(function(d) { return d.data.Label + ': ' + d.data.Value; });


      var line = svgPie.select('.lines')
        .selectAll('.line')
        .data( d3Pie(data) )
        .enter();

      line.append('circle')
        .attr('class', 'lineCircle')
        .attr('x', 0)
        .attr('y', 0)
        .attr('r', 4)
        .attr('fill', '#000')
        .attr('transform', function(d) { return 'translate(' + pieArc.centroid(d) + ')'; })
        .style('opacity', .6);

      line.append('line')
        .attr('class', 'line')
        .attr('stroke-width', 2)
        .attr('stroke', '#000')
        .attr('x1', function (d) { return pieArc.centroid(d)[0]; })
        .attr('y1', function (d) { return pieArc.centroid(d)[1]; })
        .attr('x2', function (d) { return pieLabelArc.centroid(d)[0] * .95; })
        .attr('y2', function (d) { return pieLabelArc.centroid(d)[1] * .95; })
        .style('opacity', .6);
    });
  }

  function typeIsNumbers(d) {
    // tell d3 that these are numbers, not strings
    d.Value = +d.Value;

    return d;
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

}(jQuery, d3, window, document)); // END iife
