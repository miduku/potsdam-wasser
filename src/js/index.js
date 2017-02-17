// IIFE - Immediately Invoked Function Expression
// https://toddmotto.com/what-function-window-document-undefined-iife-really-means/
// http://gregfranko.com/blog/jquery-best-practices/
(function($, window, document, undefined) {

  'use strict';

  // cache some jQuery elements
  var $$ = {
    w: $(window),
    navContainer: $('.nav-container'),
    navMain: {
      _this: $('.nav-main'),

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
    }
  };




  $(function() { // The $ is now locally scoped

    // add main waterpipe to icons and container-animation
    $$.icon._this
      .append('<div class="waterpipe"><div class="water"></div></div>');

    // add navigation waterpipe
    $$.navMain._this
      .children('ul')
      .find('li:not(:last) i')
      .append('<div class="waterpipeNav"><div class="water"></div></div>');


    // smooth scroll for nav-main
    $('.nav-main a[href^="#"]').bind('click.smoothscroll', function(e) {
      e.preventDefault();

      var target = this.hash;
      var $target = $(target);

      $('html, body')
        .stop()
        .animate({
          'scrollTop': $target.offset().top
        }, 900, 'swing', function() {
          window.location.hash = target;
        });
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
          duration: getDistance($$.section.intro, $$.section.natur)*2
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
            var rgbDiff = [
              color[i+1][0] - color[i][0],
              color[i+1][1] - color[i][1],
              color[i+1][2] - color[i][2]
            ];

            // magic here
            var scene = new ScrollMagic.Scene({
              triggerElement: el,
              triggerHook: .75
            })
            .addTo(magic.Controller)
            .addIndicators({ name: 'Waterpipe' + i })
            .on('progress', function(e) {
              var progress = e.progress.toFixed(3);

              var progressLin = (progress * 100);
              var progressExp = progressLin * progress;

              var indicatorColor = [
                Math.round(color[i][0] + rgbDiff[0] * progress),
                Math.round(color[i][1] + rgbDiff[1] * progress),
                Math.round(color[i][2] + rgbDiff[2] * progress)
              ]

              var backgroundGradient = 'linear-gradient(to bottom, rgb(' + color[i][0] + ',' + color[i][1] + ',' + color[i][2] + ') 0%, rgb(' + indicatorColor.join(',') + ') 100%)';


              // water in main waterpipe
              $(el)
                .children('.water')
                .css({
                  background: backgroundGradient,
                  height: progressExp + '%'
                });

              // water in navigation waterpipe
              $$.navMain.icon._this
                .eq(i)
                .children('.waterpipeNav')
                .children('.water')
                .css({
                  background: backgroundGradient,
                  height: progressLin + '%'
                });
            });

            $$.w.on('resize', function() {
              scene
                .duration(getPipeLength($iconPositionsArr[i], $iconPositionsArr[i+1]));

              scene
                .refresh();
            });
          });
        }
      }
    };

    magic.cast.Waterpipe( $('.waterpipe'), water.iconPositionsArr.mainIcons);
    magic.cast.NavSticky();


    /**
     * baseline-element plug-in
     */
    // $$.baselineElements.baseline(function() {
    //   // Get the current font-size from the HTML tag – the root font-size `rem` – which may change through to some CSS media queries
    //   return parseFloat(getComputedStyle(document.documentElement, null).getPropertyValue('line-height'));
    // });

    // trigger
    $$.w
      .trigger('resize');
    $$.navMain._this
      .trigger('resize');


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


  $$.w
    .on('resize', function() {
      // set section-intro's height to 100%
      $$.section.intro
        .css('height', $$.w.outerHeight());

      // set section-natur's height to 200% and margin-bottom 100%
      $$.section.natur
        .css({
          'height': $$.w.outerHeight()*2,
          'marginBottom' : $$.w.outerHeight()
        });


      // waterpipe length
      $('.waterpipe')
        .each(function(i, el) {
          $(el)
            .css('height', getPipeLength( water.iconPositionsArr.mainIcons[i], water.iconPositionsArr.mainIcons[i+1] ));
        });
    });


  $$.navMain._this
    .bind('resize', function() {
      console.log('navMain resized');

      $$.navMain.icon._this
        .each(function(i, el) {
          if (i < water.iconPositionsArr.navIcons.length - 1) {
            $(el)
              .children('.waterpipeNav')
              .css('height', getPipeLength( water.iconPositionsArr.navIcons[i], water.iconPositionsArr.navIcons[i+1] ));
          }
        });

    });


  // load, scroll WITH delay
  $$.w
    .on('load scroll', function() {
      if (eventHandling.allow) {

        // insert code to throttle here...

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
