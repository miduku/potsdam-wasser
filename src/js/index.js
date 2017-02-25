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
        bottom: 20,
        left: 40
      },
      colors: ["#3873B8", "#f44336", "#2889B3", "#2E9CCC", "#829AAF"],
      data: 'assets/data/wasserverbrauch-proportianal-bevoelkerungsdichte.csv',
      curveType: d3.curveStep
    },
    wasserverbrauch2: {
      element: '.d3Verbrauch2 > .d3',
      w: 600,
      h: 680,
      margin: {
        top: 20,
        right: -60,
        bottom: 40,
        left: 40
      },
      colors: ["#3873B8","#2889B3"],
      data: 'assets/data/wasserverbrauch-vergleich-partnerstaedte.csv'
    }
  };


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
            // .addIndicators({ name: 'navSticky' })
            .on('progress resize', function(e){
              var progress = e.progress;

              // AT INSIDE
              if (0.5 <= progress && progress < 1) {
                  navMobileFirst(
                    768, 
                    $$.navMain._this, 
                    ['retracted hidden mobileAtTop', 'extended', 0, true], 
                    ['retracted mobileAtTop', 'hidden extended', 0]
                  );
              } 
              // AT AFTER
              else if (progress === 1) {
                  navMobileFirst(
                    768, 
                    $$.navMain._this, 
                    ['retracted mobileAtTop', 'hidden extended', 0], 
                    ['retracted mobileAtTop', 'hidden extended', 0]
                  );
              } 
              // AT TOP
              else {
                  navMobileFirst(
                    768, 
                    $$.navMain._this, 
                    ['extended hidden mobile', 'retracted', $$.navContainer.offset().left], 
                    ['', 'extended hidden mobileAtTop', 0]
                  );
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
            // .addIndicators({ name: 'flood' + i })
            .on('progress', function(e) {
              var progress = e.progress.toFixed(4);

              $this
                .children('.flood')
                .children('.circle')
                .css({
                  'transform': 'scale(' + progress*1.5 + ')'
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

        $$.navMain._this.addClass('hidden');

      });
    });

    $$.navMain._this.children('.click-navOverlay')
    .on('click', function(e) {
      e.preventDefault();
      var parent = $(this).parent();

      if ( parent.hasClass('hidden') ) {
        parent.removeClass('hidden');

        $('.click-overlay').addClass('visible');
      }
    });

    $('.click-overlay').on('click', function(e) {
      e.preventDefault();

      $(this).removeClass('visible');

      $$.navMain._this.addClass('hidden');
    });


    magic.cast.Weather( $('#section-natur') );
    magic.cast.Waterpipe( $('.waterpipe'), water.iconPositionsArr.mainIcons, 'exponential');
    magic.cast.Flood( $$.wide );
    magic.cast.NavSticky();


    /**
     * baseline-element plug-in
     */
    // $$.baselineElements.baseline(function() {
    //   // Get the current font-size from the HTML tag – the root font-size `rem` – which may change through to some CSS media queries
    //   return parseFloat(getComputedStyle(document.documentElement, null).getPropertyLiter('line-height'));
    // });

    // D3
    d3PieChart(d3s.wasserbedarf.element, d3s.wasserbedarf.w, d3s.wasserbedarf.h, d3s.wasserbedarf.colors, d3s.wasserbedarf.data);
    d3MultiLineChart(d3s.wasserverbrauch.element, d3s.wasserverbrauch.w, d3s.wasserverbrauch.h, d3s.wasserverbrauch.margin, d3s.wasserverbrauch.colors, d3s.wasserverbrauch.data, d3s.wasserverbrauch.curveType);
    d3BarChart(d3s.wasserverbrauch2.element, d3s.wasserverbrauch2.w, d3s.wasserverbrauch2.h, d3s.wasserverbrauch2.margin, d3s.wasserverbrauch2.colors, d3s.wasserverbrauch2.data);

    // trigger
    $$.win.trigger('resize');
    // $$.navMain._this.trigger('resize');


  }); // END $ (locally)




  //---------------------------------------//
  //** The rest of your code goes here!  **//




  $$.win.on('resize', function() {
    // set section-intro's height to 100%
    $$.section.intro.css('min-height', $$.win.outerHeight());

    // set section-natur's height to 200% and margin-bottom 100%
    $$.section.natur.css({
      'height': $$.win.outerHeight()*3.5,
      'marginBottom' : $$.win.outerHeight()
    });

    // weather height because ScrollMagic doesn't like height: 100%
    $('.weather').css('height', $$.section.natur.outerHeight());

    // waterpipe length
    $('.waterpipe').each(function(i, el) {
      $(el)
        .css('height', getPipeLength( water.iconPositionsArr.mainIcons[i], water.iconPositionsArr.mainIcons[i+1] ));
    });


    // reposition flood effect
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

      $this
        .children('.flood')
        .children('.circle')
        .css({
          'left': flood.posLeft + $icon.size/2 - (flood.size()),
          'top': flood.posTop + $icon.size/2 - (flood.size()),
          'width': flood.size()*2,
          'height': flood.size()*2
        });
    });

  });


  $$.win.on('resize scroll', function() {
    // nav waterpipe length
    $$.navMain._this.not('.hidden')
      .children('ul')
      .find('i')
      .each(function(i, el) {
        if (i < water.iconPositionsArr.navIcons.length - 1) {
          $(el)
            .children('.waterpipeNav')
            .css('height', getPipeLength( water.iconPositionsArr.navIcons[i], water.iconPositionsArr.navIcons[i+1] ));
        }
      });



    // // delay
    // if (eventHandling.allow) {

    //   // insert code to throttle here...

    //   // trottle the event
    //   eventHandling.allow = false;
    //   setTimeout(eventHandling.reallow, eventHandling.delay);
    // } // END event handling
  });



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
      .value(function(d) { return d.Liter; })


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
        .style('fill', function(d) { return pieColor(d.data.Kategorie); });


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
        .text(function(d) { return d.data.Kategorie + ': ' + d.data.Liter });


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
      d.Liter = +d.Liter;

      return d;
    }
  }



  // bar chart
  //
  function d3BarChart(element, width, height, margins, colorsArray, csvData) {
    var outerWidth  = width;
    var outerHeight = height;
    var innerWidth  = outerWidth - margins.left - margins.right;
    var innerHeight = outerHeight - margins.top - margins.bottom;

    var scaleX = d3.scaleBand()
      .rangeRound([0, innerWidth])
      .padding(0.1)
    var scaleY = d3.scaleLinear()
      .rangeRound([innerHeight, 0]);

    // setup
    var svgBar = d3.select(element)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 ' + outerWidth + ' ' + outerHeight)
        .append('g')
        .attr('class', 'g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')' );


    // data
    d3.csv(csvData, type, function(error, data) {
      if (error) throw error;

      scaleX.domain(data.map(function(d) { return d.Stadt; }));
      scaleY.domain([0, d3.max(data, function(d) { return d.Liter; })]);

      svgBar.append('g')
        .attr('class', 'bars');
      svgBar.append('g')
        .attr('class', 'labels');
      svgBar.append('g')
        .attr('class', 'axis');

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
          .attr('fill', '#333')
          .style('font-style', 'italic')
          .text('Liter');

      var bar = svgBar.select('.bars')
        .selectAll('.bar')
        .data(data)
        .enter();

      bar.append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return scaleX(d.Stadt); })
        .attr('y', function(d) { return scaleY(d.Liter); })
        .attr('width', scaleX.bandwidth())
        .attr('height', function(d) { return innerHeight - scaleY(d.Liter); });

      d3.selectAll(element + ' .bar').each(function(d, i) {
        $(this).attr('fill', function() {
          if (d.Stadt === 'Potsdam') {
            return colorsArray[1];
          }

          return colorsArray[0];
        });
      })

      var label = svgBar.select('.labels')
        .selectAll('.label')
        .data(data)
        .enter();

      label.append('text')
        .attr('class', 'label')
        .attr('dy', '.35em')
        .attr("text-anchor", "middle")
        .attr('transform', 'translate(0, -10)')
        .attr('x', function(d) { return scaleX(d.Stadt) + scaleX.bandwidth()/2; })
        .attr('y', function(d) { return scaleY(d.Liter); })
        .text(function(d) { return d.Liter });

    });

    function type(d) {
      d.Liter = +d.Liter;
      return d;
    }
  }



  // multiline chart
  //
  function d3MultiLineChart(element, width, height, margins, colorsArray, csvData, d3CurveType) {
    var outerHeight = height;
    var outerWidth  = width;
    var innerHeight = outerHeight - margins.left - margins.right;
    var innerWidth  = outerWidth - margins.top - margins.bottom;

    var parseTime = d3.timeParse("%Y");

    var scaleX = d3.scaleTime()
      .range([0, innerWidth]);
    var scaleY = d3.scaleLinear()
      .range([innerHeight, 0]);
    var scaleZ = d3.scaleOrdinal()
      .range(colorsArray);


    // setup
    var svgLine = d3.select(element)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 ' + outerWidth + ' ' + outerHeight)
        .append('g')
        .attr('class', 'g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')' );

    var d3Line = d3.line()
      .curve(d3CurveType)
      .x(function(d) { return scaleX(d.date); })
      .y(function(d) { return scaleY(d.liter); });


    // data
    d3.csv(csvData, type, function(error, data) {
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
          }
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


      svgLine.select('.axis')
        .append('g')
        .attr('class', 'axis-x')
        .attr('transform', 'translate(0, ' + innerHeight + ')')
        .call(d3.axisBottom(scaleX));

      svgLine.select('.axis')
        .append('g')
        .attr('class', 'axis-y')
        .call(d3.axisLeft(scaleY).ticks(20))
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
        .enter();

      line.append('path')
        .attr('class', function(d) { return 'line line' + d.id; })
        .attr('d', function(d) { return d3Line(d.values); })
        .style('fill', 'none')
        .style('stroke-width', 2)
        .style('stroke', function(d) { return scaleZ(d.id); });


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
        .attr('transform', function(d) { return 'translate(' + scaleX(d.value.date) + ', ' + scaleY(d.value.liter) + ')'; })
        .attr('x', 3)
        .attr('dy', '0.35em')
        .style('font-size', '1.1em')
        .text(function(d) { return d.id });


      // mouse over effect
      //

      // add mouser vertical line
      svgLine.select('.mouseovers')
        .append('path')
        .attr('class', 'mouseLine')
        .style('stroke', '#333')
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
        .style('fill', function(d) {
          return scaleZ(d.id)
        })
        .style('opacity', '0');

      mousePerLine.append('rect')
        .attr('class', 'moLabelBackground')
        .style('fill', '#fff');

      mousePerLine.append('text')
        .attr('class', 'moText')
        .style('font-size', '1em')
        // .attr('transform', 'translate(10,3)')
        ;

      // setting up label backgrounds
      //
      var $texts = $(element + ' .moText');
      var texts = d3.range($texts.length)
        .map(function() {
          return {
            padding: 1,
            boxHeight: 20,
            translateX: 10,
            translateY: 3
          }
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
          d3.select('.mouseLine')
            .style('opacity', '0');
          d3.selectAll('.mousePerLine circle')
            .style('opacity', '0');
          d3.selectAll('.mousePerLine rect')
            .style('opacity', '0');
          d3.selectAll('.mousePerLine text')
            .style('opacity', '0');
        })

        // on mouse in show line, circles and text
        .on('mouseover', function() {
          d3.select('.mouseLine')
            .style('opacity', '1');
          d3.selectAll('.mousePerLine circle')
            .style('opacity', '1');
          d3.selectAll('.mousePerLine rect')
            .style('opacity', '0.75');
          d3.selectAll('.mousePerLine text')
            .style('opacity', '1');
        })

        // mouse moving over canvas
        .on('mousemove', function() {
          var mouse = d3.mouse(this);
          // console.log(innerWidth / mouse[0]);

          // create label backgrounds
          d3.selectAll('.moText')
            .each(function(d ,i) {
              $(this).attr('transform', 'translate(' + texts[i].translateX + ',' + texts[i].translateY + ')');

              texts[i].boxWidth = $(this).outerWidth()*1.5;
            });

          d3.selectAll('.moLabelBackground')
            .each(function(d, i) {
              $(this).attr('transform', 'translate(' + (texts[i].translateX - texts[i].padding) + ',' + -4*texts[i].translateY + ')')
                .attr('width', texts[i].boxWidth)
                .attr('height', texts[i].boxHeight);
            });


          d3.select('.mouseLine')
            .attr('d', function() {
              var d = 'M' + mouse[0] + ',' + innerHeight;
              d += ' ' + mouse[0] + ',' + 0;
              return d;
            });

          d3.selectAll('.mousePerLine')
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
                .text(scaleY.invert(pos.y).toFixed(2));

              return 'translate(' + mouse[0] + ',' + pos.y + ')'
            });
        });

    });

    // tell d3 that these are dates and numbers
    function type(d, _, columns) {
      d.Jahr = parseTime(d.Jahr);

      for (var i = 1, n = columns.length, c; i < n; ++i) {
        d[c = columns[i]] = +d[c]
      };

      return d;
    }
  }



  // function to handle what the navigation will do in relation to screensize
  function navMobileFirst(biggerThanWidth, $element, ifArray, elseArray, removeNavOverlay) {
    if (removeNavOverlay === 'undefined' || removeNavOverlay === null) {
      removeNavOverlay = false
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

}(jQuery, d3, window, document)); // END iife
