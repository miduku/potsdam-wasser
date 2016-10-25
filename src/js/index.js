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
    headerStream: $('.header-stream'),
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
    width: 10,
    colors: {
      gewinnung: [40, 137, 179],
      versorgung: [56, 115, 184],
      reinigung: [130, 154, 175]
    }
  };


  $(function() { // The $ is now locally scoped

  //------------------------//
  //** The DOM is ready!  **//

    $$.w.scrollTop(0);

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

    // smooth scroll for nav-main
    $('.nav-main a[href^="#"]').bind('click.smoothscroll',function (e) {
      e.preventDefault();

      var target = this.hash,
          $target = $(target);

      $('html, body').stop().animate( {
        'scrollTop': $target.offset().top-64
      }, 900, 'swing', function () {
        window.location.hash = target;
      });
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
      Controller: new ScrollMagic.Controller(),


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
              // console.log('stream'+index, event.state, event.type);
              // console.log('stream'+index, event.progress.toFixed(3));

              if (event.state === 'AFTER') {/////
                // console.log('after');

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
          var streamDurationNextElements = [$$.sectionVersorgung_headerArticle, $$.sectionReinigung_headerArticle, $$.footer];

          return $el.each(function(index, el) {
            var maxHeight = setStreamDuration($(el).parent(), streamDurationNextElements[index]);
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

              // stream
              $(el).children('.water').css({
                backgroundColor: 'rgb(' + indicatorColor.join(',') + ')',
                height: progress * 100 + '%'
              });

              // header-stream
              if (index < 2) {
                $$.headerStream
                  .children()
                  .children()
                  .eq(index)
                  .children()
                  .css({
                    // backgroundColor: 'rgb(' + indicatorColor.join(',') + ')',
                    background: 'linear-gradient(to right, rgb(' + color[index][0] + ',' + color[index][1] + ',' + color[index][2] + ') 0%, rgb(' + indicatorColor.join(',') + ') 100%)',
                    width: progress * 100 + '%'
                  });
              }
            });


            // load resize
            $$.w.on('load resize', function() {
              $(el).css({ maxHeight: maxHeight + 'px' });
              scene.duration(setStreamDuration($(el).parent(), streamDurationNextElements[index]) - $$.w.outerHeight());
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


    // vertical center header container
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
