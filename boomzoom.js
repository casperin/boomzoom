var margin = 10;
var images = [].map.call(document.querySelectorAll('img'), function (x) {
  return x;
});

document.body.addEventListener('click', closeAllImages, false);

images.forEach(function (image) {
  image.addEventListener('click', toggleImage, false);
});

function closeAllImages (event) {
  if (!event || images.indexOf(event.target) === -1) {
    images.forEach(function (image) {
      image.classList.remove('open');
      image.style.transform = '';
    });
  }
}

function toggleImage (event) {
  var image = event.target;
  var open = !image.classList.contains('open');

  /**
   * Zoom out of all images (if others are open, we need to close them).
   */
  closeAllImages();

  /**
   * Zoom out... we already did that.
   */
  if (!open) return;

  /**
   * Zoom in
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

  // Our unknowns.
  var scalar, translateX, translateY;

  /**
   * Calculate how much we need to scale image
   */
  if (naturalScale > winScale) {
    // we look at width
    scalar = Math.min(natural.width, win.width) / scaled.width;
  } else {
    // we look at height
    scalar = Math.min(natural.height, win.height) / scaled.height;
  }

  /**
   * Calculate how much we need to offset image to center it.
   */
  translateX = (winCenter.x - scaledCenter.x) / scalar;
  translateY = (winCenter.y - scaledCenter.y) / scalar;

  image.classList.add('open');
  image.style.transformOrigin = '50%';
  image.style.transform = 'scale('+scalar+') translate('+translateX+'px, '+translateY+'px)';
}

var boomzoom = {
  setMargin: function (newMargin) {
    margin = newMargin;
  },
  setSelector: function (sel) {
    images.forEach(function (image) {
      image.removeEventListener('click', toggleImage, false);
    });
    images = [].map.call(document.querySelectorAll(sel), function (x) {
      return x;
    });
    images.forEach(function (image) {
      image.addEventListener('click', toggleImage, false);
    });
  },
};

// Safely export nod.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = boomzoom;
}
