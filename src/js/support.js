import { KOFI_USERNAME } from './kofi.config.js'
import { initNav, initFooter } from './nav.js'
import { initStarfield } from './starfield.js'

initNav()
initStarfield()

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (!reduceMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
  }, { threshold: 0.08 })
  document.querySelectorAll('.reveal').forEach(el => io.observe(el))
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'))
}

/* ── Ko-fi widget ────────────────────────────────────────── */
const isConfigured = KOFI_USERNAME && KOFI_USERNAME !== 'YOUR_KOFI_USERNAME'

const kofiConfigured  = document.getElementById('kofi-configured')
const kofiPlaceholder = document.getElementById('kofi-placeholder')
const kofiFrame       = document.getElementById('kofi-frame')

if (isConfigured && kofiConfigured && kofiPlaceholder && kofiFrame) {
  kofiConfigured.style.display  = 'block'
  kofiPlaceholder.style.display = 'none'
  kofiFrame.src = `https://ko-fi.com/${KOFI_USERNAME}/?hidefeed=true&widget=true&embed=true&preview=true`
} else {
  if (kofiConfigured)  kofiConfigured.style.display  = 'none'
  if (kofiPlaceholder) kofiPlaceholder.style.display = 'block'
}

initFooter()
