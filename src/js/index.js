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
      element: '.d3Verteilung > .d3',
      w: 600,
      h: 600,
      colors: ["#3873B8", "#2889B3", "#2E9CCC", "#829AAF"],
      data: 'assets/data/taeglicher-gesamt-wasserbedarf-potsdams.csv'
    },
    wasserverbrauch: {
      element: '.d3Verbrauch > .d3',
      w: 600,
      h: 680,
      margin: {
        top: 20,
        right: 40,
        bottom: 30,
        left: 50
      },
      colors: ["#3873B8", "#f44336", "#2889B3", "#2E9CCC", "#829AAF"],
      data: 'assets/data/wasserverbrauch-proportianal-bevoelkerungsdichte.csv'
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
                ]

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
    d3PieChart(d3s.wasserbedarf.element, d3s.wasserbedarf.w, d3s.wasserbedarf.h, d3s.wasserbedarf.colors, d3s.wasserbedarf.data);
    d3MultiLineChart(d3s.wasserverbrauch.element, d3s.wasserverbrauch.w, d3s.wasserverbrauch.h, d3s.wasserverbrauch.margin, d3s.wasserverbrauch.colors, d3s.wasserverbrauch.data);


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
  // pie chart
  //
  function d3PieChart(element, width, height, colorsArray, csvData) {
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

    // setup
    var svgPie = d3.select(element)
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

    var d3Pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.Value; })

    // data
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
        .attr("text-anchor", "middle")
        .attr('transform', function(d) { return 'translate(' + pieLabelArc.centroid(d) + ')'; })
        .style('font-size', '1.25em')
        .style('color', '#333')
        .text(function(d) { return d.data.Label + ': ' + d.data.Value });


      var line = svgPie.select('.lines')
        .selectAll('.line')
        .data( d3Pie(data) )
        .enter();

      line.append('circle')
        .attr('class', 'lineCircle')
        .attr('x', 0)
        .attr('y', 0)
        .attr('r', 3)
        .attr('fill', '#333')
        .attr('transform', function(d) { return 'translate(' + pieArc.centroid(d) + ')'; });

      line.append('line')
        .attr('class', 'line')
        .attr('stroke-width', 1)
        .attr('stroke', '#333')
        .attr('x1', function (d) { return pieArc.centroid(d)[0]; })
        .attr('y1', function (d) { return pieArc.centroid(d)[1]; })
        .attr('x2', function (d) { return pieLabelArc.centroid(d)[0] * .95; })
        .attr('y2', function (d) { return pieLabelArc.centroid(d)[1] * .95; });
    });

    // tell d3 that these are numbers, not strings
    function typeIsNumbers(d) {
      d.Value = +d.Value;

      return d;
    }
  }

  // multiline chart
  //
  function d3MultiLineChart(element, width, height, margins, colorsArray, csvData) {
    var outerHeight = height;
    var outerWidth = width;
    var innerHeight = outerHeight - margins.left - margins.right;
    var innerWidth = outerWidth - margins.top - margins.bottom;

    var parseTime = d3.timeParse("%Y");

    var scaleX = d3.scaleTime().range([0, innerWidth]);
    var scaleY = d3.scaleLinear().range([innerHeight, 0]);
    var scaleZ = d3.scaleOrdinal().range(colorsArray);


    // setup
    var svgLine = d3.select(element)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 ' + outerWidth + ' ' + outerHeight)
      .attr('width', outerWidth)
      // .attr('height', outerHeight)
        .append('g')
        .attr('class', 'g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')' );

    var d3Line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return scaleX(d.date); })
      .y(function(d) { return scaleY(d.liter); });

    d3.csv(csvData, type, function(error, data) {
      if (error) throw error;

      // console.log('data', data);

      // get the categorys and put them in a var
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
          }
        });

        // console.log('kategorien', kategorien);


      scaleX.domain(d3.extent(data, function(d) { return d.Jahr; }));

      scaleY.domain([
        d3.min(kategorien, function(k) { return d3.min(k.values, function(d) { return d.liter; }); }),
        d3.max(kategorien, function(k) { return d3.max(k.values, function(d) { return d.liter; }); })
      ]);

      scaleZ.domain(kategorien.map(function(k) { return k.id; }));

    svgLine.append('g')
      .attr('class', 'lines');
    svgLine.append('g')
      .attr('class', 'axis');


      svgLine.select('.axis')
        .append('g')
        .attr('class', 'axis-x')
        .attr('transform', 'translate(0, ' + innerHeight + ')')
        .call(d3.axisBottom(scaleX));

      svgLine.select('.axis')
        .append('g')
        .attr('class', 'axis-y')
        .call(d3.axisLeft(scaleY))
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '0.71em')
          .attr('fill', '#333')
          .style('font-style', 'italic')
          .text('Liter');

      var line = svgLine.select('.lines')
        .selectAll('.line')
        .data(kategorien)
        .enter()
          .append('g');

      line.append('path')
        .attr('class', function(d) { return 'line line' + d.id; })
        .attr('d', function(d) { return d3Line(d.values); })
        .style('fill', 'none')
        .style('stroke-width', 2)
        .style('stroke', function(d) { return scaleZ(d.id); });

      line.append('text')
        .datum(function(d) {
          return {
            id: d.id,
            value: d.values[d.values.length - 1]
          };
        })
        .attr('class', 'label')
        .attr('transform', function(d) { return 'translate(' + scaleX(d.value.date) + ', ' + scaleY(d.value.liter) + ')'; })
        .attr('x', 3)
        .attr('dy', '0.35em')
        .style('font-size', '1.1em')
        .text(function(d) { return d.id });
    });

    // tell d3 that these are date and numbers
    function type(d, _, columns) {
      d.Jahr = parseTime(d.Jahr);

      for (var i = 1, n = columns.length, c; i < n; ++i) {
        d[c = columns[i]] = +d[c]
      };

      return d;
    }
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
