var boomzoom = (function () {
  var margin = 0;           // Margin between zoomed image and window border.
  var images = [];          // All images that was added.
  var zoomedImage = null;   // The currently zoomed in image.

  /**
   * We'll zoom out every time the body catches a click... if there is a body.
   */
  if (document && document.body) {
    document.body.addEventListener('click', zoomOut, false);
  }

  /**
   * @private
   * Returns an array of images that was found by the provided selector.
   */
  function getImages (selector) {
    var elements = document.querySelectorAll(selector);
    return [].filter.call(elements, function (element) {
      return element.tagName === 'IMG';
    });
  }

  /**
   * @global
   * Main function. Adds new images to boomzoom.
   */
  function bz (sel) {
    // Add new images and filter out duplicates.
    images = images.concat(getImages(sel))
    .filter(function(image, index, images) {
      return images.indexOf(image) === index;
    });
    // Attach event listener. Adding same listener twice is a noop.
    images.forEach(function (image) {
      image.addEventListener('click', zoomImage, false);
    });
    return bz;
  }

  /**
   * @global
   */
  bz.margin = function setMargin (n) {
    if (typeof n !== 'number') throw new Error('Margin must be a number');
    margin = n;
    return bz;
  }

  /**
   * @global
   */
  bz.remove = function remove (sel) {
    var removeImages = getImages(sel);
    // Filter out images
    images = images.filter(function (image) {
      return removeImages.indexOf(image) === -1;
    });
    // Remove listeners
    removeImages.forEach(function (image) {
      image.removeEventListener('click', zoomImage, false);
    });

    return bz;
  }

  /**
   * @global
   * Close down boomzoom.
   */
  bz.close = bz.dispose = function () {
    if (document && document.body) {
      document.body.removeEventListener('click', zoomOut, false);
    }
    images.forEach(function (image) {
      image.removeEventListener('click', zoomImage, false);
    });
    images = [];
    zoomOut();
    return true;
  }

  function zoomOut () {
    if (zoomedImage) {
      zoomedImage.style.transform = '';
      zoomedImage = null;
    }
  }

  /**
   * The zooming function. Fired by clicks on images.
   */
  function zoomImage (event) {
    var image = event.target;

    /**
     * Zoom out.
     *
     * If image was already zoomed, then we just zoom out.
     */
    if (image === zoomedImage) return zoomOut();

    /**
     * Zoom in.
     *
     * Stop propagation so the body won't catch the event later and zoom out of
     * all images (including the one we just zoomed in on).
     */
    event.stopPropagation();

    /**
     * Zoom out of zoomed image so we don't end up with two zoomed images.
     */
    zoomOut();

    /**
     * Find positions and sizes so we can do our calculations.
     *
     * `scaled` is the zoomed out size of the image.
     * `natural` is the size of the unscaled image.
     */
    var scaled = image.getBoundingClientRect();
    var scaledCenter = {
      x: scaled.left + scaled.width / 2,
      y: scaled.top + scaled.height / 2
    };
    var natural = {
      width: image.naturalWidth,
      height: image.naturalHeight
    };
    var naturalScale = natural.width / natural.height;
    var win = {
      width: window.innerWidth - 2 * margin,
      height: window.innerHeight - 2 * margin
    };
    var winScale = win.width / win.height;
    var winCenter = {
      x: win.width / 2 + margin,
      y: win.height / 2 + margin
    };
    var boundingWidth = Math.min(natural.width, win.width);
    var boundingHeight = Math.min(natural.height, win.height);

    /**
     * Calculate how much we need to scale image.
     */
    var scalar = naturalScale > winScale ? boundingWidth / scaled.width
                                         : boundingHeight / scaled.height;

    /**
     * Calculate how much we need to offset image to center it.
     */
    var dx = (winCenter.x - scaledCenter.x) / scalar;
    var dy = (winCenter.y - scaledCenter.y) / scalar;

    image.style.transform = 'scale('+scalar+') translate('+dx+'px, '+dy+'px)';
    zoomedImage = image;
  }

  return bz;
}());


/**
 * Export boomzoom.
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = boomzoom;
}
