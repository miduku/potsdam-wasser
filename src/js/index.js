(function ($, window, document, undefined) {

  'use strict';

  $(function () {

    /**
     * baseline-element plug-in
     */
    $('picture > *, .group-img img, .embed-video, figure img')
      .baseline(function() {
        // Get the current font-size from the HTML tag – the root font-size `rem` –
        // which may change through to some CSS media queries
        return parseFloat(getComputedStyle(document.documentElement, null).getPropertyValue('line-height'));
      });

  });

})(jQuery, window, document);
