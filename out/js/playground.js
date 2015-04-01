
/*
  Simple debounce utility for viewport resizing.
 */

(function() {
  var ShootingStars, Star, debounce, myCanvas;

  debounce = function(func, delay) {
    var inDebounce;
    inDebounce = void 0;
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


  /*
    Creates a star to be used on our canvas.
   */

  Star = function(size, rotate, points, outerRadius, innerRadius, borderColor, fillColor, x, y, starCanvas) {
    var self;
    self = this;
    self.x = x;
    self.y = y;
    self.size = size;
    self.color = fillColor;
    self.border = borderColor;
    self.outerRad = outerRadius;
    self.innerRad = innerRadius;
    self.rotation = rotate;
    self.points = points;
    self.opacity = 0;
    self.scale = 0;
    self.vx = Math.random() * 2 - 1;
    self.vy = Math.random() * 2 - 1;
    self.life = 0;
    self.ss = starCanvas;
    return self;
  };

  Star.prototype.update = function() {
    var canvas, maxLife, particlePool, particles;
    this.x += this.vx;
    this.y += this.vy;
    canvas = this.ss.canvas;
    maxLife = this.ss.maxLife;
    particlePool = this.ss.particlePool;
    particles = this.ss.particles;
    if (this.opacity < 1 && this.life < 50) {
      this.opacity += 0.02;
      this.scale += 0.02;
    }
    this.life++;
    if (maxLife - this.life < 50) {
      this.scale -= 0.02;
    }
    if (maxLife - this.life < 100) {
      this.vy *= 1.075;
      this.vx *= 1.075;
      this.opacity = (maxLife - this.life) / 100;
    } else if (this.life % 2 === 0) {
      this.rotation++;
    }
    if (this.life >= maxLife) {
      this.life = 0;
      this.scale = 0;
      this.x = Math.floor((Math.random() * canvas.width) + 1);
      this.y = Math.floor((Math.random() * canvas.height) + 1);
      this.vx = Math.random() - 0.5;
      this.vy = Math.random() - 0.5;
      self.vx = Math.random() * 2 - 1;
      self.vy = Math.random() * 2 - 1;
      particlePool.push(particles.shift());
    }
    return this;
  };

  Star.prototype.render = function(context) {
    var i, rad, rotation, star, starCanvas, starContext;
    star = this;
    starCanvas = document.createElement('canvas');
    starCanvas.width = star.size;
    starCanvas.height = star.size;
    starContext = starCanvas.getContext('2d');
    starContext.save();
    starContext.fillStyle = star.color;
    starContext.strokeStyle = star.border;
    starContext.globalAlpha = star.opacity;
    starContext.translate(star.size / 2, star.size / 2);
    starContext.rotate(star.rotation * Math.PI / 180);
    starContext.translate(-(star.size / 2), -(star.size / 2));
    starContext.scale(star.scale, star.scale);
    starContext.beginPath();
    i = 0;
    while (i <= (star.points * 2)) {
      rotation = i * Math.PI / star.points;
      rad = i % 2 === 0 ? star.outerRad : star.innerRad;
      starContext.lineTo((star.size / 2) + rad * Math.cos(rotation), (star.size / 2) + rad * Math.sin(rotation));
      ++i;
    }
    starContext.fill();
    starContext.stroke();
    starContext.restore();
    return context.drawImage(starCanvas, star.x, star.y);
  };

  ShootingStars = function(canvasId) {
    var canvas;
    this.canvas = canvas = document.getElementById(canvasId);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.ctx = canvas.getContext('2d');
    this.particleSize = 20;
    this.maxLife = 300;
    this.particles = [];
    this.particleIndex = 0;
    this.particlePool = [];
    return this;
  };

  ShootingStars.prototype.flushPool = function() {
    var canvas, i, particlePool, results, that;
    that = this;
    canvas = that.canvas;
    particlePool = that.particlePool = [];
    i = 0;
    results = [];
    while (i < 10) {
      particlePool.push(new Star(50, 45, 5, 25, 15, 'black', 'yellow', Math.floor((Math.random() * canvas.width) + 1), Math.floor((Math.random() * canvas.height) + 1), that));
      results.push(i++);
    }
    return results;
  };

  ShootingStars.prototype.render = function() {
    var canvas, ctx, p, particlePool, particles, that;
    that = this;
    canvas = that.canvas;
    ctx = canvas.ctx;
    particlePool = that.particlePool;
    particles = that.particles;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() > 0.95 && particles.length < 10 && particlePool.length > 0) {
      particles.push(particlePool.shift());
    }
    p = 0;
    while (p < particles.length) {
      particles[p].update();
      if (particles[p]) {
        particles[p].render(ctx);
      }
      p++;
    }

    /*
      FOR A TRIPPY EFFECT - If you render a star every frame in a different
      position and then wipe the canvas every frame you get a pretty trippy
      effect whereby the star will be blinking all over the canvas at close
      to 60 FPS.
     */
    ctx.restore();
    return requestAnimationFrame(function() {
      return that.render();
    });
  };

  myCanvas = new ShootingStars('app');

  myCanvas.flushPool();

  myCanvas.render();

}).call(this);
