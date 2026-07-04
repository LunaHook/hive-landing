export function initStarfield() {
  const canvas = document.getElementById('starfield')
  if (!canvas) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return

  const ctx = canvas.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let w, h, stars = [], mouse = { x: 0, y: 0 }

  function resize() {
    w = window.innerWidth
    h = window.innerHeight
    canvas.width  = w * dpr
    canvas.height = h * dpr
    canvas.style.width  = w + 'px'
    canvas.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    buildStars()
  }

  function buildStars() {
    const count = Math.min(180, Math.floor((w * h) / 9000))
    stars = []
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.85 + 0.15,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.55 ? '34,224,255' : '176,96,255',
        size: Math.random() * 0.8 + 0.4,
      })
    }
  }

  let t = 0
  function frame() {
    ctx.clearRect(0, 0, w, h)
    t += 0.008

    const mx = (mouse.x / w - 0.5) * 6
    const my = (mouse.y / h - 0.5) * 6

    for (const s of stars) {
      // Very slow drift downward + subtle parallax on mouse
      s.y += s.z * 0.10
      if (s.y > h + 2) { s.y = -2; s.x = Math.random() * w }

      const px = s.x - mx * s.z * 0.5
      const py = s.y - my * s.z * 0.5
      const alpha = (0.3 + 0.5 * Math.sin(s.phase + t * 1.8)) * s.z
      const radius = s.size * s.z

      ctx.beginPath()
      ctx.arc(px, py, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${s.hue},${alpha.toFixed(2)})`
      ctx.fill()
    }
    requestAnimationFrame(frame)
  }

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY }, { passive: true })
  window.addEventListener('resize', resize, { passive: true })
  resize()
  requestAnimationFrame(frame)
}
