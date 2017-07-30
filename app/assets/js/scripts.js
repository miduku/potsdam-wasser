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
    wideFooter: $('footer .wide'),
    main: $('main'),

    navMain: {
      _this: $('.nav-main'),
      a: $('.nav-main a'),

      icon: {
        _this:      $('.nav-main ul i'),
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
      _this:      $('.container .icon i'),
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

  var transitionend = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';


  ////
  // 📊 D3
  var d3s = {
    // 🔸 Pie charts
    wVerteilung: {
      element: '#d3Verteilung > .d3',
      w: 800,
      h: 470,
      colors: ['#3873B8', '#2889B3', '#2E9CCC', '#829AAF'],
      data: 'assets/data/taeglicher-gesamt-wasserbedarf-potsdams.csv',
      dataType: function typeIsNumbers(d) {
        // tell d3 that these are numbers, not strings
        d['Liter'] = +d['Liter'];
        return d;
      },
      dataKeyString: 'Kategorie',
      dataValueString: 'Liter'
    },

    wFoerderkapazitaet: {
      element: '#d3Foerderkapazitaet > .d3',
      w: 850,
      h: 470,
      colors: ['#3873B8', '#2889B3', '#2E9CCC', '#829AAF', '#f44336'],
      data: 'assets/data/foerderkapazitaet-wasserwerke-potsdam.csv',
      dataType: function typeIsNumbers(d) {
        // tell d3 that these are numbers, not strings
        d['Fördermenge in Kubikmeter'] = +d['Fördermenge in Kubikmeter'];
        return d;
      },
      dataKeyString: 'Wasserwerk',
      dataValueString: 'Fördermenge in Kubikmeter'
    },


    // 🔸 Multiline chart
    wVerbrauch: {
      element: '#d3Verbrauch > .d3',
      w: 800,
      h: 490,
      margin: {
        top: 20,
        right: 40,
        bottom: 20,
        left: 50
      },
      colors: ['#3873B8', '#f44336', '#2889B3', '#2E9CCC', '#829AAF'],
      data: 'assets/data/wasserverbrauch-proportianal-bevoelkerungsdichte.csv',
      dataType: function type(d, _, columns) {
        // tell d3 that these are dates and numbers
        var parseTime = d3.timeParse('%Y');
        d.Jahr = parseTime(d.Jahr);

        for (var i = 1, n = columns.length, c; i < n; ++i) {
          d[c = columns[i]] = +d[c];
        }
        return d;
      },
      curveType: d3.curveStep,
      yAxisLabel: 'Liter'
    },

    wAbgabe: {
      element: '#d3Wasserabgabe > .d3',
      w: 800,
      h: 470,
      margin: {
        top: 20,
        right: 0,
        bottom: 120,
        left: 50
      },
      colors: ['#3873B8', '#f44336', '#2889B3', '#2E9CCC', '#829AAF'],
      data: 'assets/data/wasserabgabe-versorgungsgebiet-potsdam-einwohner.csv',
      dataType: function type(d, _, columns) {
        // tell d3 that these are dates and numbers
        var parseTime = d3.timeParse('%Y');
        d.Jahr = parseTime(d.Jahr);

        for (var i = 1, n = columns.length, c; i < n; ++i) {
          d[c = columns[i]] = (d[c] !== 'NaN') ? +d[c] : null;
        }
        return d;
      },
      curveType: d3.curveLinear,
      yAxisLabel: 'm³/Tag'
    },


    // 🔸 Bar charts
    wVerbrauch2: {
      element: '#d3Verbrauch2 > .d3',
      w: 800,
      h: 470,
      margin: {
        top: 20,
        right: 0,
        bottom: 40,
        left: 50
      },
      colors: ['#3873B8','#f44336'],
      data: 'assets/data/wasserverbrauch-vergleich-partnerstaedte.csv',
      dataSets: ['Stadt', 'Liter'],
      dataType: function type(d) {
        // tell d3 that these are numbers
        d.Liter = +d.Liter;
        return d;
      },
      yAxisLabel: 'Liter/Kopf'
    },

    wAuslastungsgrenze: {
      element: '#d3Auslastungsgrenze > .d3',
      w: 880,
      h: 470,
      margin: {
        top: 70,
        right: 30,
        bottom: 40,
        left: 60
      },
      colors: ['#3873B8', '#2889B3', '#2E9CCC', '#829AAF', '#f44336'],
      // data: 'assets/data/auslastungsgrenze-wasserwerke-potsdam-einwohner-szenario2047.csv',
      data: 'assets/data/auslastungsgrenze-wasserwerke-potsdam-einwohner-szenario2047-bevoelkerung.csv',
      dataSets: ['Jahr (Auslastung in %)', 'Bevölkerung'],
      // dataKeyString: 'Jahr (Auslastung in %)',
      // dataType: function dataType(d, _, columns) {
      //   // tell d3 that these are numbers
      //   for (var i = 1, n = columns.length, c; i < n; ++i) {
      //     d[c = columns[i]] = (d[c] !== 'NaN') ? +d[c] : null;
      //   }
      //   return d;
      // },
      dataType: function type(d) {
        // tell d3 that these are numbers
        d['Bevölkerung'] = +d['Bevölkerung'];
        return d;
      },
      yAxisLabel: 'Bevölkerung'
    },

    wAuslastungsgrenze2: {
      element: '#d3Auslastungsgrenze > .d3-2',
      w: 880,
      h: 470,
      margin: {
        top: 70,
        right: 30,
        bottom: 40,
        left: 60
      },
      colors: ['#3873B8', '#2889B3', '#2E9CCC', '#829AAF', '#f44336'],
      // data: 'assets/data/auslastungsgrenze-wasserwerke-potsdam-einwohner-szenario2047.csv',
      data: 'assets/data/auslastungsgrenze-wasserwerke-potsdam-einwohner-szenario2047-foerderkapazitaet.csv',
      dataSets: ['Jahr (Auslastung in %)', 'Förderkapazitäten (m³)'],
      // dataKeyString: 'Jahr (Auslastung in %)',
      // dataType: function dataType(d, _, columns) {
      //   // tell d3 that these are numbers
      //   for (var i = 1, n = columns.length, c; i < n; ++i) {
      //     d[c = columns[i]] = (d[c] !== 'NaN') ? +d[c] : null;
      //   }
      //   return d;
      // },
      dataType: function type(d) {
        // tell d3 that these are numbers
        d['Bevölkerung'] = +d['Bevölkerung'];
        return d;
      },
      yAxisLabel: 'Förderkapazität m³/Tag'
    }
  };


  ////
  // 🎩 Scroll Magic!
  // http://scrollmagic.io/
  var magic = {
    // init ScrollMagic controller
    Controller: new ScrollMagic.Controller(),

    // Scenes for casting
    // scene: {
    //   NavSticky: new ScrollMagic.Scene({
    //     triggerElement: '#section-intro',
    //     triggerHook: 0,
    //     duration: getDistance($$.section.intro, $$.section.natur)
    //   })
    // },


    // Cast some magic: put it all together
    cast: {
      // 📍 Sticky navigation
      NavSticky: function() {
        // return magic.scene.NavSticky
        return new ScrollMagic.Scene({
          triggerElement: '#section-intro',
          triggerHook: 0,
          duration: getDistance($$.section.intro, $$.section.natur)
        })
          .addTo(magic.Controller)
          // .addIndicators({ name: 'navSticky' })
          .on('progress resize', function(e){
            var progress = e.progress;

            // console.log(progress);

            // AT INSIDE
            if (0.5 <= progress && progress < 1) {
              navMobileFirst(
                  $$.navMain._this,
                  768,
                  ['retracted hidden mobileAtTop', 'extended', 0, true],
                  ['retracted mobileAtTop', 'hidden extended', 0]
                );
            }
            // AT AFTER
            else if (progress === 1) {
              navMobileFirst(
                  $$.navMain._this,
                  768,
                  ['retracted mobileAtTop', 'hidden extended', 0],
                  ['retracted mobileAtTop', 'hidden extended', 0]
                );
            }
            // AT TOP
            else {
              navMobileFirst(
                  $$.navMain._this,
                  768,
                  ['extended hidden mobile', 'retracted', $$.navContainer.offset().left],
                  ['', 'extended hidden mobileAtTop', 0]
                );
            }
          });
      },

      // 🌧️ Set when weather is shown during scrolling
      Weather: function() {
        var el = '#section-natur';
        var $el = $(el);
        var $weatherElement = $el.find('.weather');

        return new ScrollMagic.Scene({
          triggerElement: el,
          triggerHook: 1,
          duration: $$.section.natur.outerHeight()
        })
        .addTo(magic.Controller)
        // .addIndicators({ name: 'weather' })
        .on('progress leave', function(e) {
          var progress = e.progress.toFixed(1);

          if (0.1 < progress && progress <= 0.9 && e.type !== 'leave') {
            $weatherElement.css('opacity', 1);
          } else {
            $weatherElement.css('opacity', 0);
          }
        });
      },

      // 🏙️ Set city skyline
      City: function() {
        var el = '#section-natur';
        var $el = $(el);
        var $cityElement = $el.find('.city');

        return new ScrollMagic.Scene({
          triggerElement: el,
          triggerHook: 1,
          duration: $$.section.natur.outerHeight()
        })
        .addTo(magic.Controller)
        // .addIndicators({ name: 'city' })
        .on('progress', function(e) {
          var progress = e.progress.toFixed(2);

          // console.log(progress);

          if (progress < 1) {
            $cityElement.css('position', 'fixed');
          } else {
            $cityElement.css('position', 'absolute');
          }
        });
      },

      // 🌊 Insert a flood effect to elemenet
      Flood: function() {
        var $el = $$.wide;
        return $el.each(function(i, el) {
          var $this = $(el);

          new ScrollMagic.Scene({
            triggerElement: el,
            triggerHook: .6,
            duration: $this.outerHeight()
          })
          .addTo(magic.Controller)
          // .addIndicators({ name: 'flood' + i })
          .on('progress', function(e) {
            var progress = e.progress.toFixed(4);

            $this.children('.flood')
              .children('.circle')
              .css({
                'transform': 'scale(' + progress*1.5 + ')'
              });

            if (progress >= 0.25) {
              $this.addClass('showText');
            } else {
              $this.removeClass('showText');
            }
          })
          .on('update leave', function(e) {
            if (e.type === 'leave' && e.target.controller().info('scrollDirection') === 'FORWARD') {
              $this.next('.container')
                .css('opacity', 1);
            }
          });
        });
      },

      // 🌊 Insert a flood effect to elemenet
      FloodFooter: function() {
        var el = $$.wideFooter;
        var $this = $(el);

        new ScrollMagic.Scene({
          triggerElement: el,
          triggerHook: .6,
          duration: $this.outerHeight()
        })
        .addTo(magic.Controller)
        // .addIndicators({ name: 'floodFooter' })
        .on('progress', function(e) {
          var progress = e.progress.toFixed(4);

          $this.children('.flood')
            .children('.circle')
            .css({
              'transform': 'scale(' + progress*1.5 + ')'
            });

          var opacity = progress*4;
          $this.children('.container')
            .css({
              opacity: function() {
                if (opacity > 1) {
                  return 1;
                }

                return opacity;
              }
            });

          if (progress >= 0.25) {
            $this.addClass('showText');
          } else {
            $this.removeClass('showText');
          }

        })
        ;
      },

      // 🚰 Set waterpipe that flows downward while scrolling
      Waterpipe: function() {
        var $el = $('.waterpipe');
        var $iconPositionsArr = water.iconPositionsArr.mainIcons;
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
          // .addIndicators({ name: 'Waterpipe' + i })
          .on('progress', function(e) {
            var progress = e.progress.toFixed(4);
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
            $this.children('.water')
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








  $(function() { // The $ is now locally scoped

    // 🏗️ Create elements with jQuery
    //
    // add main waterpipe to icons and container-animation
    $$.icon._this.append('<div class="waterpipe"><div class="water"></div></div>');

    // add navigation waterpipe
    $$.navMain._this.children('ul')
      .find('li:not(:last) i')
      .append('<div class="waterpipeNav"><div class="water"></div></div>');

    // add flood element
    $$.wide.prepend('<div class="flood"><div class="circle"></div></div>');
    $$.wideFooter.prepend('<div class="flood"><div class="circle"></div></div>');

    // add rain element
    $$.section.natur.prepend('<div class="weather"><div class="rain"></div></div>');

    // add city element
    $$.section.natur.prepend('<div class="city"><div class="skyline"></div></div>');




    // 🖱️ click events for main nav
    //
    // create overlays
    $$.bod.prepend('<div class="click-overlay"></div>');
    $$.navMain._this.prepend('<div class="click-navOverlay"></div>');


    // smooth scroll anchor menu for nav-main
    $('a[href^="#"]').bind('click.smoothscroll', function(e) {
      e.preventDefault();

      console.log('clicked', e.currentTarget.hash);

      var target = this.hash;
      var $target = $(target);

      $('.click-overlay').removeClass('visible');

      $('html, body').stop()
      .animate({
        'scrollTop': $target.offset().top
      }, 900, 'swing', function() {
        window.location.hash = target;

        $$.navMain._this.not('.retracted').addClass('hidden');
      });
    });


    // click on the nav to open it when closed
    $$.navMain._this.children('.click-navOverlay')
    .on('click', function(e) {
      e.preventDefault();

      console.log('click-dots');

      var parent = $(this).parent();

      if ( parent.hasClass('hidden') ) {
        parent.removeClass('hidden')
        .on(transitionend, function() {
          resizeWaterpipeNav();
        });

        $('.click-overlay').addClass('visible');
      }
    });

    $('.click-overlay').on('click', function(e) {
      e.preventDefault();

      console.log('click-overlay');

      $(this).removeClass('visible');
      $$.navMain._this.not('.retracted').addClass('hidden');
    });




    // ✨📊 init D3 functions
    d3PieChart(d3s.wVerteilung);
    d3MultiLineChart(d3s.wVerbrauch);
    d3BarChart(d3s.wVerbrauch2);
    d3MultiLineChart(d3s.wAbgabe, true);
    d3PieChart(d3s.wFoerderkapazitaet);
    // d3GroupedBarChart(d3s.wAuslastungsgrenze);
    d3BarChart(d3s.wAuslastungsgrenze);
    d3BarChart(d3s.wAuslastungsgrenze2);




    // ✨🎩 Cast some ScrollMagic (need to be before resize event)
    magic.cast.Waterpipe();




    // 🔫 Event triggers
    $$.win.trigger('resize');




    // ✨🎩 Cast some more ScrollMagic
    magic.cast.Flood();
    magic.cast.FloodFooter();
    magic.cast.NavSticky();
    magic.cast.Weather();
    magic.cast.City();



    // ▶️ Loading page overlay
    $$.win.on('load', function() {
      $('.loadWrapper').animate({opacity: 0}, 500, function() {$(this).hide();});
    });

  }); // END $ (locally)






  // 🎟️ Events
  //
  $$.win.on('resize', function() {
    // set section-intro's height to 100%
    $$.section.intro.css('min-height', $$.win.outerHeight());

    // set section-natur's height to 200% and margin-bottom 100%
    $$.section.natur.css({
      'height': $$.win.outerHeight(),
      'marginBottom' : $$.win.outerHeight()/2
    });

    // weather height because ScrollMagic doesn't like height: 100%
    $('.weather').css('height', $$.section.natur.outerHeight());

    // waterpipe length
    $('.waterpipe').each(function(i, el) {
      $(el).css('height', getPipeLength( water.iconPositionsArr.mainIcons[i], water.iconPositionsArr.mainIcons[i+1] ));
    });


    repositionFloodEffect();
    repositionFloodEffectFooter();
    setNavWidth();
  });


  $$.win.on('resize scroll', function() {
    resizeWaterpipeNav();


    // // delay
    // if (eventHandling.allow) {
    //   ////// insert code to throttle here...
    //   // trottle the event
    //   eventHandling.allow = false;
    //   setTimeout(eventHandling.reallow, eventHandling.delay);
    // } // END event handling
  });





  // 🛠️ Functions
  //

  /**
   * Set width of nav
   */
  function setNavWidth() {
    $$.navMain._this.children('ul')
      .children('li')
      .find('span')
      .css({
        width: function() {
          return $$.navContainer.outerWidth() - $(this).parent().outerWidth();
        }
      });
  }

  /**
   * Reposition Flood Effect
   */
  function repositionFloodEffect() {
    $$.wide.each(function(i, el) {
      var $this = $(el);

      var $icon = {
        _this: $this.find('.icon i'),
        size: $this.find('.icon i').outerWidth()
      };

      var flood = {
        posTop:  $icon._this.position().top,
        posLeft: $icon._this.offset().left,
        size:  function() {
          if ($this.outerWidth() > $this.outerHeight()) {
            return $this.outerWidth();
          }

          return $this.outerHeight();
        }
      };

      $this.children('.flood')
        .children('.circle')
        .css({
          top: flood.posTop + $icon.size/2 - (flood.size()),
          left: flood.posLeft + $icon.size/2 - (flood.size()),
          width: flood.size()*2,
          height: flood.size()*2
        });
    });
  }

  /**
   * Reposition Flood Effect for footer
   */
  function repositionFloodEffectFooter() {
    var $el = $$.wideFooter;
    var lastWaterPipe = $$.main.children('section').find('.waterpipe').last();

    var flood = {
      posLeft: lastWaterPipe.offset().left + lastWaterPipe.outerWidth()/2,
      size:  function() {
        if ($el.outerWidth() > $el.outerHeight()) {
          return $el.outerWidth();
        }

        return $el.outerHeight();
      }
    };

    $el.children('.flood')
      .children('.circle')
      .css({
        top: 0 - (flood.size()),
        left: flood.posLeft - (flood.size()),
        width: flood.size()*2,
        height: flood.size()*2
      });
  }

  /**
   * Resize the Waterpipes in the nav
   */
  function resizeWaterpipeNav() {
    // nav waterpipe length
    $$.navMain._this.not('.hidden')
      .children('ul')
      .find('i')
      .each(function(i, el) {
        if (i < water.iconPositionsArr.navIcons.length - 1) {
          $(el).children('.waterpipeNav')
            .css('height', getPipeLength( water.iconPositionsArr.navIcons[i], water.iconPositionsArr.navIcons[i+1] ));
        }
      });
  }

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
   * Function to handle what the navigation will do in relation to screensize
   */
  function navMobileFirst($element, biggerThanWidth, ifArray, elseArray, removeNavOverlay) {
    if (removeNavOverlay === 'undefined' || removeNavOverlay === null) {
      removeNavOverlay = false;
    }

    if ($$.win.outerWidth() >= biggerThanWidth) {
      $element.removeClass(ifArray[0])
        .addClass(ifArray[1])
        .css({
          'left': ifArray[2]
        });
    }
    else {
      $element.removeClass(elseArray[0])
        .addClass(elseArray[1])
        .css({
          'left': elseArray[2]
        });
    }

    if (removeNavOverlay) {
      $('.click-overlay').removeClass('visible');
    }
  }








  /**
   * D3
   */
  function d3PieChart(settings) {
    // Settings example:
    //
    // wVerteilung: {
    //   element: '#d3Verteilung > .d3',
    //   w: 600,
    //   h: 600,
    //   colors: ["#3873B8", "#2889B3", "#2E9CCC", "#829AAF"],
    //   data: 'assets/data/taeglicher-gesamt-wasserbedarf-potsdams.csv',
    //   dataKeyString: 'Kategorie',
    //   dataValueString: 'Liter'
    // }

    var pieWidth  = settings.w;
    var pieHeight = settings.h;
    var pieRadius = Math.min(pieWidth, pieHeight) / 2;
    var pieColor = d3.scaleOrdinal()
      .range(settings.colors);
    var pieArc = d3.arc()
      .outerRadius(pieRadius - 50)
      .innerRadius(0);
    var pieLabelArc = d3.arc()
      .outerRadius(pieRadius - 10)
      .innerRadius(pieRadius - 10);


    // setup
    var svgPie = d3.select(settings.element)
      .append('svg')
      .attr('class', 'd3PieChart')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 ' + pieWidth + ' ' + pieHeight)
        .append('g')
        .attr('class', 'g')
        .attr('transform', 'translate(' + pieWidth * 0.5 + ',' + pieHeight * 0.5 + ')' );

    var d3Pie = d3.pie()
      .sort(null)
      .value(function(d) { return d[settings.dataValueString]; });


    // data
    d3.csv(settings.data, settings.dataType, function(error, data) {
      if (error) throw error;

      svgPie.append('g')
        .attr('class', 'arcs');
      svgPie.append('g')
        .attr('class', 'labels');
      svgPie.append('g')
        .attr('class', 'lines');

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
        .style('fill', function(d) { return pieColor(d.data[settings.dataKeyString]); });


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
        .text(function(d) { return d.data[settings.dataKeyString] + ': ' + d.data[settings.dataValueString]; });


      var line = svgPie.select('.lines')
        .selectAll('.line')
        .data( d3Pie(data) )
        .enter();

      line.append('circle')
        .attr('class', 'lineCircle')
        .attr('x', 0)
        .attr('y', 0)
        .attr('r', 3)
        .attr('transform', function(d) { return 'translate(' + pieArc.centroid(d) + ')'; });

      line.append('line')
        .attr('class', 'line')
        .attr('stroke-width', 1)
        .attr('x1', function (d) { return pieArc.centroid(d)[0]; })
        .attr('y1', function (d) { return pieArc.centroid(d)[1]; })
        .attr('x2', function (d) { return pieLabelArc.centroid(d)[0] * .93; })
        .attr('y2', function (d) { return pieLabelArc.centroid(d)[1] * .93; });
    });
  }


  function d3BarChart(settings) {
    // Settings example:
    //
    // wVerbrauch2: {
    //   element: '#d3Verbrauch2 > .d3',
    //   w: 600,
    //   h: 680,
    //   margin: {
    //     top: 20,
    //     right: -60,
    //     bottom: 40,
    //     left: 40
    //   },
    //   colors: ["#3873B8","#2889B3"],
    //   data: 'assets/data/wasserverbrauch-vergleich-partnerstaedte.csv',
    //   dataType: function type(d) {
    //     // tell d3 that these are numbers
    //     d.Liter = +d.Liter;
    //     return d;
    //   }
    // }

    var element = settings.element;
    var outerWidth  = settings.w;
    var outerHeight = settings.h;
    var innerWidth  = outerWidth - settings.margin.left - settings.margin.right;
    var innerHeight = outerHeight - settings.margin.top - settings.margin.bottom;

    var scaleX = d3.scaleBand()
      .rangeRound([0, innerWidth])
      .padding(0.1);

    var scaleY = d3.scaleLinear()
      .rangeRound([innerHeight, 0]);

    // setup
    var svgBar = d3.select(element)
      .append('svg')
      .attr('class', 'd3BarChart')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 ' + outerWidth + ' ' + outerHeight)
        .append('g')
        .attr('class', 'g')
        .attr('transform', 'translate(' + settings.margin.left + ',' + settings.margin.top + ')' );


    // data
    d3.csv(settings.data, settings.dataType, function(error, data) {
      if (error) throw error;

      scaleX.domain(data.map(function(d) { return d[settings.dataSets[0]]; }));
      scaleY.domain([0, d3.max(data, function(d) { return d[settings.dataSets[1]]; })]);

      svgBar.append('g')
        .attr('class', 'axis');
      svgBar.append('g')
        .attr('class', 'bars');
      svgBar.append('g')
        .attr('class', 'labels');

      svgBar.select('.axis')
        .append('g')
        .attr('class', 'axis-x')
        .attr('transform', 'translate(0, ' + innerHeight + ')')
        .call(d3.axisBottom(scaleX));

      svgBar.select('.axis')
        .append('g')
        .attr('class', 'axis-y')
        .call(d3.axisLeft(scaleY).ticks(10))
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '0.71em')
          .style('font-style', 'italic')
          .text(settings.yAxisLabel);

      var bar = svgBar.select('.bars')
        .selectAll('.bar')
        .data(data)
        .enter();

      bar.append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return scaleX(d[settings.dataSets[0]]); })
        .attr('y', function(d) { return scaleY(d[settings.dataSets[1]]); })
        .attr('width', scaleX.bandwidth())
        .attr('height', function(d) { return innerHeight - scaleY(d[settings.dataSets[1]]); });

      d3.selectAll(element + ' .bar').each(function(d, i) {
        $(this).attr('fill', function() {
          if (d[settings.dataSets[0]] === 'Potsdam') {
            return settings.colors[1];
          }

          return settings.colors[0];
        });
      });

      var label = svgBar.select('.labels')
        .selectAll('.label')
        .data(data)
        .enter();

      label.append('text')
        .attr('class', 'label')
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(0, -10)')
        .attr('x', function(d) { return scaleX(d[settings.dataSets[0]]) + scaleX.bandwidth()/2; })
        .attr('y', function(d) { return scaleY(d[settings.dataSets[1]]); })
        .text(function(d) { return d[settings.dataSets[1]]; });
    });
  }


  function d3GroupedBarChart(settings) {
    var element = settings.element;
    var outerHeight = settings.h;
    var outerWidth  = settings.w;
    var innerHeight = outerHeight - settings.margin.left - settings.margin.right;
    var innerWidth  = outerWidth - settings.margin.top - settings.margin.bottom;

    var scaleX0 = d3.scaleBand()
      .rangeRound([0, innerWidth])
      .paddingInner(0.1);

    var scaleX1 = d3.scaleBand()
      .padding(0.05);

    var scaleY = d3.scaleLinear()
      .rangeRound([innerHeight, 0]);

    var scaleZ = d3.scaleOrdinal()
      .range(settings.colors);

    // setup
    var svgBar = d3.select(element)
      .append('svg')
      .attr('class', 'd3GroupedBarChart')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 ' + outerWidth + ' ' + outerHeight)
        .append('g')
        .attr('class', 'g')
        .attr('transform', 'translate(' + settings.margin.left + ',' + settings.margin.top + ')' );



    // data
    d3.csv(settings.data, settings.dataType, function(error, data) {
      if (error) throw error;

      var keys = data.columns.slice(1);

      scaleX0.domain(data.map(function(d) { return d[settings.dataKeyString]; }));

      scaleX1.domain(keys)
        .rangeRound([0, scaleX0.bandwidth()]);

      scaleY.domain([0, d3.max(data, function(d) {
        return d3.max(keys, function(key) { return d[key]; });
      })]);


      svgBar.append('g')
        .attr('class', 'axis');
      svgBar.append('g')
        .attr('class', 'bars');
      svgBar.append('g')
        .attr('class', 'labels');

      svgBar.select('.axis')
        .append('g')
        .attr('class', 'axis-x')
        .attr('transform', 'translate(0, ' + innerHeight + ')')
        .call(d3.axisBottom(scaleX0));

      svgBar.select('.axis')
        .append('g')
        .attr('class', 'axis-y')
        .call(d3.axisLeft(scaleY).ticks(null, 's'))
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('x', 2)
          .attr('y', 6 )
          .attr('dy', '0.71em')
          .style('font-style', 'italic')
          .text(settings.yAxisLabel);


      var bar = svgBar.select('.bars')
        .selectAll('.bar')
        .data(data)
        .enter()
          .append('g')
          .attr('transform', function(d) { return 'translate(' + scaleX0(d[settings.dataKeyString]) + ',0)'; })
          .selectAll('rect')
          .data(function(d) {
            return keys.map(function(key) {
              return {
                key: key,
                value: d[key]
              };
            });
          })
          .enter();

      bar.append('rect')
        .attr('x', function(d) { return scaleX1(d.key); })
        .attr('y', function(d) { return scaleY(d.value); })
        .attr('width', scaleX1.bandwidth())
        .attr('height', function(d) { return innerHeight - scaleY(d.value); })
        .attr('fill', function(d) { return scaleZ(d.key); });

      bar.append('text')
        .attr('class', 'label')
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(0, -10)')
        .attr('x', function(d) { return scaleX1(d.key) + scaleX1.bandwidth()/2; })
        .attr('y', function(d) { return scaleY(d.value); })
        .text(function(d) { return d.value; });


      var label = svgBar.select('.labels')
        .selectAll('.label')
        .data(keys.slice().reverse())
        .enter()
          .append('g')
          .attr('class', 'label')
          .attr('text-anchor', 'end')
          .attr('transform', function(d, i) { return 'translate(0,' + ((i+1) * (-20)-30) + ')'; });

      label.append('rect')
          .attr('x', innerWidth - 19)
          .attr('width', 19)
          .attr('height', 19)
          .attr('fill', scaleZ);

      label.append('text')
          .attr('x', innerWidth - 24)
          .attr('y', 9.5)
          .attr('dy', '0.32em')
          .text(function(d) { return d; });
    });
  }


  function d3MultiLineChart(settings, showDots) {
    // Settings example:
    //
    // wAbgabe: {
    //   element: '#d3Wasserabgabe > .d3',
    //   w: 600,
    //   h: 700,
    //   margin: {
    //     top: 20,
    //     right: 70,
    //     bottom: 20,
    //     left: 40
    //   },
    //   colors: ["#3873B8", "#f44336", "#2889B3", "#2E9CCC", "#829AAF"],
    //   data: 'assets/data/wasserabgabe-versorgungsgebiet-potsdam-einwohner.csv',
    //   dataType: function type(d, _, columns) {
    //     // tell d3 that these are dates and numbers
    //     var parseTime = d3.timeParse("%Y");
    //     d.Jahr = parseTime(d.Jahr);

    //     for (var i = 1, n = columns.length, c; i < n; ++i) {
    //       d[c = columns[i]] = (d[c] !== 'NaN') ? +d[c] : null;
    //     }
    //     return d;
    //   },
    //   curveType: d3.curveLinear
    // }

    var element = settings.element;
    var outerHeight = settings.h;
    var outerWidth  = settings.w;
    var innerHeight = outerHeight - settings.margin.left - settings.margin.right;
    var innerWidth  = outerWidth - settings.margin.top - settings.margin.bottom;

    var scaleX = d3.scaleTime()
      .range([0, innerWidth]);

    var scaleY = d3.scaleLinear()
      .range([innerHeight, 0]);

    var scaleZ = d3.scaleOrdinal()
      .range(settings.colors);


    // setup
    var svgLine = d3.select(element)
      .append('svg')
      .attr('class', 'd3MultiLineChart')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 ' + outerWidth + ' ' + outerHeight)
        .append('g')
        .attr('class', 'g')
        .attr('transform', 'translate(' + settings.margin.left + ',' + settings.margin.top + ')' );

    var d3Line = d3.line()
      .defined(function(d) { return d.liter !== null; })
      .curve(settings.curveType)
      .x(function(d) { return scaleX(d.date); })
      .y(function(d) { return scaleY(d.liter); });


    // data
    d3.csv(settings.data, settings.dataType, function(error, data) {
      if (error) throw error;

      // map the categorys and put them in a var
      var kategorien = data.columns.slice(1)
        .map(function(id) {
          return {
            id: id,
            values: data.map(function(d) {
              return {
                date: d.Jahr,
                liter: d[id]
              };
            })
          };
        });


      scaleX.domain(d3.extent(data, function(d) { return d.Jahr; }));

      scaleY.domain([
        d3.min(kategorien, function(k) {
          return d3.min(k.values, function(d) { return d.liter; });
        }),
        d3.max(kategorien, function(k) {
          return d3.max(k.values, function(d) { return d.liter; });
        })
      ]);

      scaleZ.domain(kategorien.map(function(k) { return k.id; })); // basically the colors

      svgLine.append('g')
        .attr('class', 'axis');
      svgLine.append('g')
        .attr('class', 'lines');
      svgLine.append('g')
        .attr('class', 'labels');
      svgLine.append('g')
        .attr('class', 'mouseovers');

      // grid
      svgLine.select('.axis')
        .append('g')
        .attr('class', 'grid-x')
        .attr('transform', 'translate(0,' + innerHeight + ')')
        .style('opacity', '0.15')
        .call(d3.axisBottom(scaleX).ticks(10).tickSize(-innerHeight).tickFormat(''));

      svgLine.select('.axis')
        .append('g')
        .attr('class', 'grid-y')
        .style('opacity', '0.15')
        .call(d3.axisLeft(scaleY).ticks(20).tickSize(-innerWidth).tickFormat(''));



      svgLine.select('.axis')
        .append('g')
        .attr('class', 'axis-x')
        .attr('transform', 'translate(0, ' + innerHeight + ')')
        .call(d3.axisBottom().scale(scaleX).ticks(12));

      svgLine.select('.axis')
        .append('g')
        .attr('class', 'axis-y')
        .call(d3.axisLeft().scale(scaleY).ticks(null, 's'))
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 16)
          .attr('dy', '0.32em')
          .style('font-style', 'italic')
          .text(settings.yAxisLabel);


      var line = svgLine.select('.lines')
        .selectAll('.line')
        .data(kategorien)
        .enter();

      line.append('path')
        .attr('class', function(d) { return 'line line' + d.id; })
        .attr('d', function(d) { return d3Line(d.values); })
        .style('fill', 'none')
        .style('stroke-width', 2)
        .style('stroke', function(d) { return scaleZ(d.id); });



      if (showDots) {
        console.log('showing Dots');
        var dots = svgLine.select('.lines')
          .selectAll('.dots')
          .data(kategorien)
          .enter();

        var dot = dots.append('g')
          .attr('class', function(d) { return 'dots dots' + d.id; })
          .selectAll('circle')
          .data(function(d) { return d.values; })
          .enter();

        dot.append('circle')
          .attr('cx', function(d) { return scaleX(d.date); })
          .attr('cy', function(d) { return scaleY((d.liter !== null) ? d.liter : '0'); })
          .attr('r', function(d) { return (d.liter !== null) ? '2' : '0'; })
          .style('stroke', 'none');
      }


      var label = svgLine.select('.labels')
        .selectAll('.label')
        .data(kategorien)
        .enter();

      label.append('text')
        .datum(function(d) {
          return {
            id: d.id,
            value: d.values[d.values.length - 1]
          };
        })
        .attr('class', 'label')
        .attr('transform', function(d) { return 'translate(' + scaleX(d.value.date) + ', ' + scaleY(d.value.liter) + ') rotate(15)'; })
        .attr('x', 3)
        .attr('dy', '0.35em')
        .style('font-size', '1.1em')
        .text(function(d) { return d.id; });


      // mouse over effect
      //

      // add mouser vertical line
      svgLine.select('.mouseovers')
        .append('path')
        .attr('class', 'mouseLine')
        .style('stroke', '#737373')
        .style('stroke-width', 1)
        .style('opacity', '0');

      var $lines = $(element + ' .line');

      var mousePerLine = svgLine.select('.mouseovers')
        .selectAll('.mousePerLine')
        .data(kategorien)
        .enter()
          .append('g')
          .attr('class', 'mousePerLine');

      mousePerLine.append('circle')
        .attr('class', 'moCircle')
        .attr('r', 4)
        .style('fill', function(d) { return scaleZ(d.id); })
        .style('opacity', '0');

      mousePerLine.append('rect')
        .attr('class', 'moLabelBackground')
        .style('fill', '#fff');

      mousePerLine.append('text')
        .attr('class', 'moText')
        .style('font-size', '1em');

      // setting up label backgrounds
      //
      var $texts = $(element + ' .moText');
      // console.log($texts);
      var texts = d3.range($texts.length)
        .map(function() {
          return {
            padding: 1,
            boxHeight: 20,
            translateX: 10,
            translateY: 3
          };
        });

      // append a rect to catch mouse movements on canvas
      // can't catch mouse events on a g element
      svgLine.select('.mouseovers')
        .append('rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('pointer-events', 'all')
        .style('fill', 'none')

        // on mouse out hide line, circles and text
        .on('mouseout', function() {
          d3.select(element + ' .mouseLine')
            .style('opacity', '0');
          d3.selectAll(element + ' .mousePerLine circle')
            .style('opacity', '0');
          d3.selectAll(element + ' .mousePerLine rect')
            .style('opacity', '0');
          d3.selectAll(element + ' .mousePerLine text')
            .style('opacity', '0');
        })

        // on mouse in show line, circles and text
        .on('mouseover', function() {
          d3.select(element + ' .mouseLine')
            .style('opacity', '1');
          d3.selectAll(element + ' .mousePerLine circle')
            .style('opacity', '1');
          d3.selectAll(element + ' .mousePerLine rect')
            .style('opacity', '0.75');
          d3.selectAll(element + ' .mousePerLine text')
            .style('opacity', '1');
        })

        // mouse moving over canvas
        .on('mousemove', function() {
          var mouse = d3.mouse(this);
          // console.log(innerWidth / mouse[0]);

          // create label backgrounds
          d3.selectAll(element + ' .moText')
            .each(function(d ,i) {
              $(this).attr('transform', 'translate(' + texts[i].translateX + ',' + texts[i].translateY + ')');

              texts[i].boxWidth = $(this).outerWidth()*1.5;
            });

          d3.selectAll(element + ' .moLabelBackground')
            .each(function(d, i) {
              $(this).attr('transform', 'translate(' + (texts[i].translateX - texts[i].padding) + ',' + -4*texts[i].translateY + ')')
                .attr('width', texts[i].boxWidth)
                .attr('height', texts[i].boxHeight);
            });


          d3.select(element + ' .mouseLine')
            .attr('d', function() {
              var d = 'M' + mouse[0] + ',' + innerHeight;
              d += ' ' + mouse[0] + ',' + 0;
              return d;
            });

          d3.selectAll(element + ' .mousePerLine')
            .attr('transform', function(d, i) {
              // var xDate     = scaleX.invert(mouse[0]);
              // var bisect    = d3.bisector(function(d) { return d.date }).right;
              // var idx       = bisect(d.values, xDate);

              var beginning = 0;
              var end       = $lines[i].getTotalLength();
              var target    = null;
              var pos       = null;

              for (;;) {
                target = Math.floor((beginning + end) / 2);
                pos = $lines[i].getPointAtLength(target);

                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
                }

                if (pos.x > mouse[0]) {
                  end = target;
                } else if (pos.x < mouse[0]) {
                  beginning = target;
                } else {
                  break; // position found
                }
              }

              d3.select(this)
                .select('text')
                .text(scaleY.invert(pos.y).toFixed(0));

              return 'translate(' + mouse[0] + ',' + pos.y + ')';
            });
        });
    });
  }

}(jQuery, d3, window, document)); // END iife
