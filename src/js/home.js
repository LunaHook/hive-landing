import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initNav, initFooter } from './nav.js'
import { initStarfield } from './starfield.js'

gsap.registerPlugin(ScrollTrigger)

initNav()
initStarfield()

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Hero chart animation ────────────────────────────────── */
;(function heroChart() {
  const W = 270, H = 120, SAMPLES = 40

  const hlc = document.getElementById('hlc')
  const hac = document.getElementById('hac')
  const hlv = document.getElementById('hlv')
  const hav = document.getElementById('hav')
  if (!hlc) return

  function wave(phase, base, amp, seed) {
    const pts = []
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES
      const x = t * W
      const y = base
        + Math.sin(t * 6.3 + phase) * amp
        + Math.sin(t * 14 + phase * 1.8 + seed) * (amp * 0.3)
      pts.push([x, Math.max(4, Math.min(H - 4, y))])
    }
    return pts
  }

  function toLine(pts) {
    return 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')
  }

  function toArea(pts) {
    return toLine(pts) + ` L${W},${H} L0,${H} Z`
  }

  function draw(phase) {
    const c = wave(phase, 52, 28, 0)
    const v = wave(phase * 0.75 + 1.4, 82, 16, 2.2)
    hlc.setAttribute('d', toLine(c))
    hac.setAttribute('d', toArea(c))
    hlv.setAttribute('d', toLine(v))
    hav.setAttribute('d', toArea(v))
  }

  draw(0)
  if (!reduceMotion) {
    let phase = 0, last = 0
    function loop(now) {
      if (now - last > 44) { phase += 0.045; draw(phase); last = now }
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }
})()

/* Same chart for narrative insights section */
;(function narrativeChart() {
  const W = 340, H = 130, SAMPLES = 44

  const nlc = document.getElementById('n-lc')
  const nac = document.getElementById('n-ac')
  const nlv = document.getElementById('n-lv')
  const nav_el = document.getElementById('n-av')
  if (!nlc) return

  function wave(phase, base, amp, seed) {
    const pts = []
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES
      const x = t * W
      const y = base
        + Math.sin(t * 6.3 + phase) * amp
        + Math.sin(t * 14 + phase * 1.8 + seed) * (amp * 0.3)
      pts.push([x, Math.max(4, Math.min(H - 4, y))])
    }
    return pts
  }

  function toLine(pts) {
    return 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')
  }

  function toArea(pts) {
    return toLine(pts) + ` L${W},${H} L0,${H} Z`
  }

  function draw(phase) {
    const c = wave(phase, 52, 30, 0)
    const v = wave(phase * 0.75 + 1.4, 88, 18, 2.2)
    nlc.setAttribute('d', toLine(c))
    nac.setAttribute('d', toArea(c))
    nlv.setAttribute('d', toLine(v))
    if (nav_el) nav_el.setAttribute('d', toArea(v))
  }

  draw(0)
  if (!reduceMotion) {
    let phase = 0, last = 0
    function loop(now) {
      if (now - last > 44) { phase += 0.045; draw(phase); last = now }
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }
})()

/* ── Scroll reveal ───────────────────────────────────────── */
if (!reduceMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
  document.querySelectorAll('.reveal').forEach(el => io.observe(el))
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'))
}

/* ── Count-up ────────────────────────────────────────────── */
function countUp(el) {
  const target  = parseFloat(el.dataset.count) || 0
  const suffix  = el.dataset.suffix || ''
  const isFloat = el.dataset.float === '1'
  if (reduceMotion) { el.textContent = (isFloat ? target.toFixed(1) : Math.round(target)) + suffix; return }
  const dur = 1300, start = performance.now()
  function tick(now) {
    const t = Math.min(1, (now - start) / dur)
    const val = target * (1 - Math.pow(1 - t, 3))
    el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function whenVisible(el, cb) {
  const o = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { cb(); o.disconnect() } })
  }, { threshold: 0.4 })
  o.observe(el)
}

document.querySelectorAll('[data-count]').forEach(el => whenVisible(el, () => countUp(el)))

/* ── Gauge arcs ──────────────────────────────────────────── */
function animGauge(el, pct) {
  const CIRC = 314
  const off = CIRC * (1 - Math.min(100, Math.max(0, pct)) / 100)
  if (reduceMotion) { el.style.transition = 'none' }
  el.getBoundingClientRect()
  el.style.strokeDashoffset = String(off)
}

const insightsEl = document.getElementById('insights')
if (insightsEl) {
  whenVisible(insightsEl, () => {
    const arcC = document.querySelector('.arc-c')
    const arcV = document.querySelector('.arc-v')
    if (arcC) animGauge(arcC, 41)
    if (arcV) animGauge(arcV, 58)
  })
}

/* ── Heatmap ─────────────────────────────────────────────── */
const heat = document.getElementById('heatmap')
if (heat) {
  const frag = document.createDocumentFragment()
  for (let i = 0; i < 17 * 6; i++) {
    const cell = document.createElement('i')
    const r = Math.random()
    const intensity = r < 0.45 ? 0.05 : 0.12 + Math.pow(r, 2) * 0.82
    const isMid = Math.random() < 0.3
    cell.style.background = isMid
      ? `rgba(176,96,255,${intensity.toFixed(2)})`
      : `rgba(34,224,255,${intensity.toFixed(2)})`
    frag.appendChild(cell)
  }
  heat.appendChild(frag)
}

/* ── Scroll narrative chapters ───────────────────────────── */
;(function scrollNarrative() {
  const narrative  = document.getElementById('narrative')
  const chapters   = Array.from(document.querySelectorAll('.n-chapter'))
  const dots       = Array.from(document.querySelectorAll('.np-dot'))
  if (!narrative || !chapters.length) return

  let currentIndex = 0

  function goTo(index, direction) {
    const prev = chapters[currentIndex]
    const next = chapters[index]
    if (prev === next) return

    prev.classList.add('exiting')
    prev.classList.remove('active')

    // Remove exiting class after transition
    prev.addEventListener('transitionend', () => prev.classList.remove('exiting'), { once: true })

    next.classList.add('active')
    currentIndex = index

    dots.forEach((d, i) => d.classList.toggle('active', i === index))
  }

  // Dot click navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const narrativeTop = narrative.getBoundingClientRect().top + window.scrollY
      const narrativeH   = narrative.offsetHeight
      const targetScroll = narrativeTop + (i / chapters.length) * (narrativeH - window.innerHeight)
      window.scrollTo({ top: targetScroll + 1, behavior: 'smooth' })
    })
  })

  if (reduceMotion) {
    // No GSAP — chapters still work via scroll
    chapters.forEach((ch, i) => { if (i > 0) ch.classList.remove('active') })
  }

  ScrollTrigger.create({
    trigger: narrative,
    start: 'top top',
    end: 'bottom bottom',
    pin: '#narrative-sticky',
    pinSpacing: false,
    onUpdate(self) {
      const totalChapters = chapters.length
      const raw = self.progress * totalChapters
      const idx = Math.min(totalChapters - 1, Math.floor(raw))
      if (idx !== currentIndex) goTo(idx)
    },
  })
})()

/* ── Swatch interaction in theme chapter ─────────────────── */
document.querySelectorAll('.vt-swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    document.querySelectorAll('.vt-swatch').forEach(s => {
      s.style.boxShadow = ''
      s.classList.remove('selected')
    })
    sw.classList.add('selected')
    const color = getComputedStyle(sw).backgroundColor
    sw.style.boxShadow = `0 0 14px ${color.replace(')', ',0.7)').replace('rgb', 'rgba')}`
  })
})

/* ── Hero GSAP entrance ──────────────────────────────────── */
if (!reduceMotion) {
  gsap.fromTo('.hero-copy > *', {
    opacity: 0, y: 30,
  }, {
    opacity: 1, y: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.1,
  })

  gsap.fromTo('.hero-visual', {
    opacity: 0, x: 30,
  }, {
    opacity: 1, x: 0,
    duration: 1.1,
    ease: 'power3.out',
    delay: 0.3,
  })
}

initFooter()
