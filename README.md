# Shooting-stars

Shooting stars is an experiment with creating particle rendering systems with the HTML5 Canvas.

You can see a demo of this at [jh3y.github.io/shooting-stars](http://jh3y.github.io/shooting-stars).

I wanted to create something simple instead of using CSS animations on DOM element as I was previously with a different implementation.

This isn't a released piece of code but if you're interested in playing with it you can by importing the `shooting-stars.js` file into your page and then adding something like the following code to your javascript.

```javascript
  var debounce = function(func, delay) {
    var inDebounce;
    inDebounce = undefined;
    return function() {
      var args, context;
      context = this;
      args = arguments;
      clearTimeout(inDebounce);
      return inDebounce = setTimeout((function() {
        return func.apply(context, args);
      }), delay);
    };
  };

  var config = {
    id: 'app',
    particleLife: 300,
    amount: 50,
    star: {
      size: {
        upper: 50,
        lower: 25
      },
      rotateLimit: 90,
      points: 5,
      innerRadius: 0.5,
      borderColor: '#000',
      fillColor: 'red',
    }
  };

  myCanvas = new ShootingStars(config);
  myCanvas.flushPool();
  myCanvas.render();
  window.addEventListener('resize', debounce(function() {
    myCanvas.canvas.width = window.innerWidth;
    myCanvas.canvas.height = window.innerHeight;
    myCanvas.flushPool();
  }, 500));

```
This relies on there being a canvas element in your DOM with the ID `app`. You can of course change this as long as that canvas element exists.

I'm just passing in a config to the function and the options included are as follows

* `id: string` - the ID of the canvas element to be used.
* `particleLife: int` - the lifespan of each star in frames.
* `amount: int` - the amount of stars to be rendered on the canvas.
* `star: obj` - defines characteristics of stars that are rendered.
    * `size: obj` - defines the upper and lower bound size of the star in pixels.
      * `upper: int` - defines the upper bound size.
      * `lower: int` - defines the lower bound size.
    * `rotateLimit: int` - defines the maximum rotation that stars will make during render.
    * `points: int` - defines the number of points that a star will have.
    * `innerRadius: float` - defines the size of the inner radius of the star. For example; an inner radius of `0.5` means that the inner radius will be `(starSize / 2) * 0.5`.
    * `borderColor: string` - defines the border color. Can be any valid CSS color representation.
    * `fillColor: string` - defines the fill color. Can be any valid CSS color representation.

##Contributing
If you'd like to get involved or have any issues with the implementation or need some pointers feel free to leave an issue or tweet me [@_jh3y](http://twitter.com/@_jh3y)!

##License
MIT

@jh3y 2015
