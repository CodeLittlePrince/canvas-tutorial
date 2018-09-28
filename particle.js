let canvas = {}
  , image = {}
  , requestId = 0
  , startTime = 0
function Particles(c) {
  let a = this
  let b = c.ease || 'easeInOutExpo'
  if (typeof window[b] !== 'function') {
    console.log('the function is not existed, it will use easeInOutExpo instead')
    b = 'easeInOutExpo'
  }
  this.init = (function() {
    if (!c.canvasId || !document.getElementById(c.canvasId)) {
      console.log('pls use the correct canvas id')
      return
    }
    if (!c.imgUrl) {
      console.log('pls use the correct img url')
      return
    }
    canvas.self = document.getElementById(c.canvasId)
    if (canvas.self.getContext) {
      canvas.w = canvas.self.width = document.body.clientWidth
      canvas.h = canvas.self.height = document.body.clientHeight
      canvas.ctx = canvas.self.getContext('2d')
      let d = new Image()
      image.isLoaded = false
      d.onload = function() {
        image.self = d
        image.w = d.width
        image.h = d.height
        image.x = c.imgX || parseInt(canvas.w / 2 - image.w / 2)
        image.y = c.imgY || 0
        canvas.ctx.drawImage(image.self, image.x, image.y, image.w, image.h)
        image.imgData = canvas.ctx.getImageData(image.x, image.y, image.w, image.h)
        canvas.ctx.clearRect(0, 0, canvas.w, canvas.h)
        Particles.prototype._calculate({
          color: c.fillStyle || 'rgba(26, 145, 211, 1)',
          pOffset: c.particleOffset || 2,
          startX: c.startX || (image.x + image.w / 2),
          startY: c.startY || 0,
          duration: c.duration || 3000,
          interval: c.interval || 3,
          ease: b,
          ratioX: c.ratioX || 1,
          ratioY: c.ratioY || 1,
          cols: c.cols || 100,
          rows: c.rows || 100
        })
        image.isLoaded = true
        startTime = new Date().getTime()
      }
            
      d.crossOrigin = 'anonymous'
      d.src = c.imgUrl
    }
  }
  )()
  this.draw = function() {
    if (image.isLoaded) {
      Particles.prototype._draw()
    } else {
      setTimeout(a.draw)
    }
  }
    
  this.animate = function() {
    if (image.isLoaded) {
      Particles.prototype._animate(c.delay)
    } else {
      setTimeout(a.animate)
    }
  }
}
Particles.prototype = {
  array: [],
  _calculate: function(a) {
    let k = image.imgData.length
    let f = image.imgData.data
    let m = a.cols
      , o = a.rows
    let n = parseInt(image.w / m)
      , c = parseInt(image.h / o)
    let g, e
    let l = 0
    let h = {}
    for (let d = 0; d < m; d++) {
      for (let b = 0; b < o; b++) {
        l = (b * c * image.w + d * n) * 4
        if (f[l + 3] > 100) {
          h = {
            x0: a.startX,
            y0: a.startY,
            x1: image.x + d * n + (Math.random() - 0.5) * 10 * a.pOffset,
            y1: image.y + b * c + (Math.random() - 0.5) * 10 * a.pOffset,
            fillStyle: a.color,
            delay: b / 20,
            currTime: 0,
            count: 0,
            duration: parseInt(a.duration / 16.66) + 1,
            interval: parseInt(Math.random() * 10 * a.interval),
            ease: a.ease,
            ratioX: a.ratioX,
            ratioY: a.ratioY
          }
          if (f[l + 1] < 90) {
            h.fillStyle = 'red'            
          } else {
            h.fillStyle = 'white'
          }
          this.array.push(h)
        }
      }
    }
  },
  _draw: function() {
    canvas.ctx.clearRect(0, 0, canvas.w, canvas.h)
    let b = this.array.length
    let a = null
    for (let c = 0; c < b; c++) {
      a = this.array[c]
      canvas.ctx.fillStyle = a.fillStyle
      canvas.ctx.fillRect(a.x1, a.y1, 1, 1)
    }
  },
  _render: function() {
    canvas.ctx.clearRect(0, 0, canvas.w, canvas.h)
    let l = Particles.prototype.array
    let f = l.length
    let h = null
    let d, a
    let k = 0
      , b = 0
      , c = 0
      , j = 1
      , g = 1
    for (let e = 0; e < f; e++) {
      h = l[e]
      if (h.count++ > h.delay) {
        canvas.ctx.fillStyle = h.fillStyle
        k = h.currTime
        b = h.duration
        c = h.interval
        h.ratioX !== 1 ? j = h.ratioX + Math.random() * 2 : 1
        h.ratioY !== 1 ? g = h.ratioY + Math.random() * 2 : 1
        if (l[f - 1].duration + l[f - 1].interval < l[f - 1].currTime / 2) {
          cancelAnimationFrame(requestId)
          Particles.prototype._draw()
          return
        } else {
          if (k < b + c) {
            if (k >= c) {
              d = window[h.ease]((k - c) * j, h.x0, (h.x1 - h.x0) * j, b)
              a = window[h.ease]((k - c) * g, h.y0, (h.y1 - h.y0) * g, b)
              canvas.ctx.fillRect(d, a, 1, 1)
            }
          } else {
            canvas.ctx.fillRect(h.x1, h.y1, 1, 1)
          }
        }
        h.currTime += Math.random() + 0.5
      }
    }
    requestId = requestAnimationFrame(Particles.prototype._render)
  },
  _animate: function(a) {
    if (startTime + a < new Date().getTime()) {
      requestId = requestAnimationFrame(Particles.prototype._render)
    } else {
      setTimeout(function() {
        Particles.prototype._animate(a)
      })
    }
  }
}

// 缓动函数
window.easeInOutExpo = function(e, a, g, f) {
  return g * (-Math.pow(2, -10 * e / f) + 1) + a
}
