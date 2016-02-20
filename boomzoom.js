function boomzoom (selector) {
  var margin = 0;           // Margin between zoomed image and window border.
  var images = [];          // All images that was added.
  var zoomedImage = null;   // The currently zoomed in image.

  /**
   * @global
   * Main function. Adds new images to boomzoom.
   */
  function bz (sel) {
    if (!sel) return bz;
    // Add new images and filter out duplicates.
    images = images.concat(boomzoom.getImages(sel))
    .filter(function(image, index, images) {
      return images.indexOf(image) === index;
    });
    // Attach event listener. Adding same listener twice is a noop.
    images.forEach(function (image) {
      image.addEventListener('click', clickHandler, false);
    });
    return bz;
  }

  bz.margin = function setMargin (n) {
    if (typeof n !== 'number') throw new Error('Margin must be a number');
    margin = n;
    return bz;
  }

  bz.zoomOutOnBodyClick = function (toggle) {
    if (!document || !document.body) return;
    if (toggle === false)
      document.body.removeEventListener('click', bodyClickHandler, false);
    else
      document.body.addEventListener('click', bodyClickHandler, false);
    return bz;
  };

  bz.remove = function remove (sel) {
    var removeImages = boomzoom.getImages(sel);
    // Filter out images
    images = images.filter(function (image) {
      return removeImages.indexOf(image) === -1;
    });
    // Remove listeners
    removeImages.forEach(function (image) {
      image.removeEventListener('click', clickHandler, false);
    });

    return bz;
  };

  /**
   * @global
   * Close down boomzoom.
   */
  bz.close = bz.dispose = function () {
    zoomOutOnBodyClick(false);
    images.forEach(function (image) {
      image.removeEventListener('click', clickHandler, false);
    });
    images = [];
    return true;
  };

  function clickHandler (event) {
    var image = event.target;
    boomzoom.zoomOut(zoomedImage); // Zoom out of any zoomed images

    if (image === zoomedImage) { // zoom out
      zoomedImage = null;
    } else { // zoom in
      image.style.transform = boomzoom.zoomIn(image, {margin: margin}).cssTransform;
      zoomedImage = image;
      // Stop propagation so the body won't catch the event later and zoom out of
      // all images (including the one we just zoomed in on).
      event.stopPropagation();
    }
  }

  function bodyClickHandler (event) {
    boomzoom.zoomOut(zoomedImage);
    zoomedImage = null;
  }

  return bz(selector);
}

boomzoom.zoomIn = function zoomIn (image, options) {
  options = options || {};
  var margin = options.margin || 0;
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
  var naturalRatio = natural.width / natural.height;
  var win = {
    width: window.innerWidth - 2 * margin,
    height: window.innerHeight - 2 * margin
  };
  var winRatio = win.width / win.height;
  var winCenter = {
    x: win.width / 2 + margin,
    y: win.height / 2 + margin
  };
  var boundingWidth = Math.min(natural.width, win.width);
  var boundingHeight = Math.min(natural.height, win.height);

    /**
     * Calculate how much we need to scale image.
     */
  var scalar = naturalRatio > winRatio ? boundingWidth / scaled.width
                                       : boundingHeight / scaled.height;

    /**
     * Calculate how much we need to offset image to center it.
     */
  var dx = (winCenter.x - scaledCenter.x) / scalar;
  var dy = (winCenter.y - scaledCenter.y) / scalar;

  return {
    scalar: scalar,
    dx: dx,
    dy: dy,
    cssTransform: 'scale('+scalar+') translate('+dx+'px, '+dy+'px)'
  };
}

boomzoom.zoomOut = function zoomOut (image) {
  if (image && image.style)
    image.style.transform = '';
}

/**
 * Returns an array of images that was found by the provided selector.
 */
boomzoom.getImages = function getImages (selector) {
  var elements = document.querySelectorAll(selector);
  return [].filter.call(elements, function (element) {
    return element.tagName === 'IMG';
  });
}

/**
 * Export boomzoom.
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = boomzoom;
}
