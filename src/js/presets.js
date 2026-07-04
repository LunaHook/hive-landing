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

/* ── Copy config ID ──────────────────────────────────────── */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const id = btn.dataset.id
    if (!id) return
    try {
      await navigator.clipboard.writeText(id)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = id
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }

    const original = btn.innerHTML
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Copied!`
    btn.classList.add('copied')
    setTimeout(() => {
      btn.innerHTML = original
      btn.classList.remove('copied')
    }, 2200)
  })
})

/* ── Swatch hover glow ───────────────────────────────────── */
document.querySelectorAll('.preset-swatch').forEach(sw => {
  sw.addEventListener('mouseenter', () => {
    const bg = getComputedStyle(sw).backgroundColor
    const glow = bg.replace('rgb(', 'rgba(').replace(')', ', 0.7)')
    sw.style.boxShadow = `0 0 14px ${glow}`
  })
  sw.addEventListener('mouseleave', () => { sw.style.boxShadow = '' })
})

initFooter()
