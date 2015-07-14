###
  Creates a star to be used on our canvas.
###

Star = (size, rotate, points, outerRadius, innerRadius, borderColor, fillColor, x, y, starCanvas) ->
  self = this
  self.x = x
  self.y = y
  self.size = size
  self.color = fillColor
  self.border = borderColor
  self.outerRad = outerRadius
  self.innerRad = innerRadius
  self.rotation = rotate
  self.points = points
  self.opacity = 0
  self.scale = 0
  self.vx = Math.random() * 2 - 1
  self.vy = Math.random() * 2 - 1
  self.life = 0
  self.ss = starCanvas
  self

Star::update = ->
  this.x += this.vx
  this.y += this.vy
  canvas = this.ss.canvas
  maxLife = this.ss.maxLife
  particlePool = this.ss.particlePool
  particles = this.ss.particles

  if this.opacity < 1 && this.life < (maxLife / 6)
    this.opacity += (100 / (maxLife / 6)) / 100
    this.scale += (100 / (maxLife / 6)) / 100
  this.life++

  if maxLife - this.life < (maxLife / 6)
    this.scale -= (100 / (maxLife / 6)) / 100
  # If life is less than a hundred away from dying then speed up.
  if maxLife - this.life < (maxLife / 3)
    this.vy *= 1.075
    this.vx *= 1.075
    this.opacity = (maxLife - this.life) / 100
  # Else we are going to rotate the star ever so slightly every two frames
  else if this.life % 2 is 0
    this.rotation++


  if this.life >= maxLife
    this.life = 0
    this.scale = 0
    this.x = Math.floor((Math.random() * canvas.width) + 1)
    this.y = Math.floor((Math.random() * canvas.height) + 1)
    this.vx = Math.random() - 0.5
    this.vy = Math.random() - 0.5
    self.vx = Math.random() * 2 - 1
    self.vy = Math.random() * 2 - 1
    particlePool.push particles.shift()

  this

Star::render = (context) ->
  star = this
  starCanvas = document.createElement 'canvas'
  starCanvas.width = star.size
  starCanvas.height = star.size
  starContext = starCanvas.getContext '2d'
  starContext.save()
  starContext.fillStyle = star.color
  starContext.strokeStyle = star.border
  starContext.globalAlpha = star.opacity
  starContext.translate (star.size / 2), (star.size / 2)
  starContext.rotate star.rotation * Math.PI / 180
  starContext.translate -(star.size / 2), -(star.size / 2)
  starContext.scale star.scale, star.scale
  starContext.beginPath()
  i = 0
  while i <= (star.points * 2)
    rotation = i * Math.PI / star.points
    rad = if i % 2 is 0 then star.outerRad else star.innerRad
    starContext.lineTo (star.size / 2) + rad * Math.cos(rotation), (star.size / 2) + rad * Math.sin(rotation)
    ++i
  starContext.fill()
  starContext.stroke()
  starContext.restore()

  context.drawImage starCanvas, star.x, star.y



debounce = (func, delay) ->
  inDebounce = undefined
  inDebounce = undefined
  ->
    args = undefined
    context = undefined
    context = this
    args = arguments
    clearTimeout inDebounce
    inDebounce = setTimeout((->
      func.apply context, args
    ), delay)



extend = (a, b) ->
  for key of b
    if b.hasOwnProperty(key) and b[key] isnt undefined
      a[key] = b[key]
  a


requestAnimationFrame = window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.msRequestAnimationFrame or (callback) -> setTimeout callback, 1000 / 60



window.ShootingStars = ShootingStars = (config) ->
  self = this
  canvasId = config.id
  defaults = {
    particleLife: 300,
    particleRenderProbability: 0.05,
    amount: 5,
    resizePoll: 250,
    star: {
      size: {
        upper: 50,
        lower: 25
      },
      rotateLimit: 45,
      points: 5,
      innerRadius: 0.5,
      borderColor: '#000',
      fillColor: 'red',
    }
  };
  self.options = extend defaults, config
  self.canvas = canvas = document.getElementById canvasId
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.ctx = canvas.getContext '2d'
  self.maxLife = self.options.particleLife # This means a particles is alive for 300 frames
  self.particles = []
  self.particlePool = []
  self.particleProbability = self.options.particleRenderProbability
  self.poolSize = self.options.amount
  window.addEventListener 'resize', debounce((->
    self.canvas.width = window.innerWidth
    self.canvas.height = window.innerHeight
    self.flushPool()
    return
  ), self.options.resizePoll)
  self


ShootingStars::flushPool = ->
  that = this
  canvas = that.canvas
  particlePool = that.particlePool = []
  particles = that.particles = []
  poolSize = self.poolSize = that.options.amount
  if canvas.width < 450
    poolSize = self.poolSize = poolSize / 2
  i = 0
  while i < poolSize
    getRandomFromRange = (max, min) ->
      Math.floor(Math.random() * (max - min + 1) + min)
    size = getRandomFromRange that.options.star.size.upper, that.options.star.size.lower
    rotation = getRandomFromRange that.options.star.rotateLimit, 0
    particlePool.push new Star size, rotation, 5, size / 2, (size / 2) * that.options.star.innerRadius, this.options.star.borderColor, this.options.star.fillColor, Math.floor((Math.random() * canvas.width) + 1), Math.floor((Math.random() * canvas.height) + 1), that
    i++

ShootingStars::render = ->
  that = this
  canvas = that.canvas
  ctx = canvas.ctx
  particlePool = that.particlePool
  particles = that.particles
  ctx.save()
  ctx.clearRect 0, 0, canvas.width, canvas.height
  if Math.random() > that.particleProbability and particles.length < that.poolSize and particlePool.length > 0
    particles.push particlePool.shift()
  p = 0
  while p < particles.length
    particles[p].update()
    if particles[p]
      particles[p].render(ctx)
    p++
  ###
    FOR A TRIPPY EFFECT - If you render a star every frame in a different
    position and then wipe the canvas every frame you get a pretty trippy
    effect whereby the star will be blinking all over the canvas at close
    to 60 FPS.
  ###
  ctx.restore()
  # console.log new Date().toUTCString()
  requestAnimationFrame ->
    that.render()
