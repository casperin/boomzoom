# Boom Zoom!

Simple image zooming.

Works both as a simple plug'n play thing on static html pages where messing
with the dom is okay, and all the way to React components where you'd like full
control.

`transform` is used, which means you will have to be cautious if your images
for some reason already are transformed.

## Install

```sh
npm install boomzoom
```

## Usage (very subject to change)

```js
// The simple approach:
boomzoom('.my-images')
  .zoomOutOnBodyClick() // If an image is zoomed in, clicking on the body (around it) will zoom out
  .margin(20); // Leave 20px margin around the zoomed in image
```

```js
// The "don't touch my dom" approach:
var image = document.querySelector('.my-image');
image.style.transform = boomzoom.transposition(image, {margin: 20}).cssTransform;

// Zooming out:
image.style.transform = ''; // You don't need boomzoom for this
```

```js
// The "What can this thing do" approach:
var image = document.querySelector('.my-image');
var zoomDimensions = boomzoom.transposition(image);
console.log(zoomDimensions);
```

### Remove images

If you added images that you now need to remove:

```js
boomzoom.remove('.dont-zoom-me');
```

### Remove all listeners

If you used the simple approach in a SPA of some sort, you may want to remove
all listeners once you close down the page.

```js
boomzoom.close();
```

### Speed / Transition

You may not like instant speed zoom. To get smooth transitions, I suggest you
add something like this to your css:

```css
.my-images {
  transition: transform .2s;
}
```
