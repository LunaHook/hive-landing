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

// Download click tracking (cosmetic — logs to console)
document.querySelectorAll('.dl-card').forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('.dl-card-title')?.textContent || 'unknown'
    console.info(`[HIVE] Download initiated: ${title}`)
  })
})

initFooter()
