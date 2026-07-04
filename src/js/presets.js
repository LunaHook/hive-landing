import { initNav, initFooter } from './nav.js'
import { initStarfield } from './starfield.js'

initNav()
initStarfield()

const BASE = import.meta.env.BASE_URL

const DARK_THEMES = [
  { id: 'midnight',       name: 'Midnight',         desc: 'Deep indigo layers on a near-black canvas. High contrast, low fatigue.',                    colors: { bg: '#0b0d12', panel: '#12151c', muted: '#8a92a6', text: '#e6e9f0', accent: '#6366f1' } },
  { id: 'tokyo-night',    name: 'Tokyo Night',       desc: 'Cool blues and purples inspired by the iconic editor theme.',                               colors: { bg: '#1a1b26', panel: '#16161e', muted: '#8a92b2', text: '#c0caf5', accent: '#7aa2f7' } },
  { id: 'dracula',        name: 'Dracula',           desc: 'Classic vampire palette — amethyst on dark charcoal. Timeless.',                           colors: { bg: '#282a36', panel: '#21222c', muted: '#9aa0b5', text: '#f8f8f2', accent: '#bd93f9' } },
  { id: 'nord',           name: 'Nord',              desc: 'Arctic blues with clean Nordic minimalism. Calm and focused.',                             colors: { bg: '#2e3440', panel: '#2b303b', muted: '#9aa6bd', text: '#eceff4', accent: '#88c0d0' } },
  { id: 'catppuccin',     name: 'Catppuccin Mocha',  desc: 'Warm pastel purples on a soft dark base. Perfectly balanced.',                            colors: { bg: '#1e1e2e', panel: '#181825', muted: '#a6adc8', text: '#cdd6f4', accent: '#cba6f7' } },
  { id: 'rose-pine',      name: 'Rosé Pine',         desc: 'Dusty rose and muted purple on deep plum. Soft yet rich.',                                colors: { bg: '#191724', panel: '#1f1d2e', muted: '#908caa', text: '#e0def4', accent: '#ebbcba' } },
  { id: 'gruvbox',        name: 'Gruvbox',           desc: 'Warm earthy tones — amber, brown, and cream on deep ochre.',                              colors: { bg: '#282828', panel: '#32302f', muted: '#a89984', text: '#ebdbb2', accent: '#fabd2f' } },
  { id: 'solarized-dark', name: 'Solarized Dark',    desc: 'The legendary Solarized palette in dark form. Designed for extended readability.',        colors: { bg: '#002b36', panel: '#073642', muted: '#93a1a1', text: '#eee8d5', accent: '#b58900' } },
  { id: 'forest',         name: 'Forest',            desc: 'Deep emerald greens on a dark woodland base. Calm and lush.',                             colors: { bg: '#0f1f17', panel: '#122a1e', muted: '#7fa890', text: '#d7f0e0', accent: '#43e97b' } },
  { id: 'sunset',         name: 'Sunset',            desc: 'Hot pink and fuchsia on a dark warm background. Bold and electric.',                      colors: { bg: '#1f1014', panel: '#2a1318', muted: '#c99aa6', text: '#ffe8ee', accent: '#ff6ec4' } },
  { id: 'ocean',          name: 'Ocean',             desc: 'Midnight blue-greens with a bright teal accent. Deep and immersive.',                     colors: { bg: '#0b1d2a', panel: '#0e2536', muted: '#84a7bd', text: '#d6ecf7', accent: '#4facfe' } },
]

const LIGHT_THEMES = [
  { id: 'paper',           name: 'Paper',            desc: 'Clean white with indigo accents. Like a well-lit notebook.',                              colors: { bg: '#f7f8fa', panel: '#ffffff', muted: '#6b7280', text: '#1f2430', accent: '#4f46e5' } },
  { id: 'solarized-light', name: 'Solarized Light',  desc: 'The legendary Solarized palette in warm light form.',                                    colors: { bg: '#fdf6e3', panel: '#eee8d5', muted: '#93896f', text: '#586e75', accent: '#268bd2' } },
  { id: 'mono',            name: 'Mono',             desc: 'Pure white and black, zero distractions. Typography-first.',                             colors: { bg: '#ffffff', panel: '#fafafa', muted: '#737373', text: '#171717', accent: '#404040' } },
  { id: 'latte',           name: 'Catppuccin Latte', desc: 'Soft warm creams with a vibrant lavender accent.',                                       colors: { bg: '#eff1f5', panel: '#e6e9ef', muted: '#6c6f85', text: '#4c4f69', accent: '#8839ef' } },
  { id: 'rose-dawn',       name: 'Rosé Dawn',        desc: 'Warm ivory tones with dusty rose accents. Gentle and refined.',                          colors: { bg: '#faf4ed', panel: '#fffaf3', muted: '#797593', text: '#575279', accent: '#d7827e' } },
  { id: 'gruvbox-light',   name: 'Gruvbox Light',    desc: 'Warm parchment yellows with amber accents. Retro and cozy.',                             colors: { bg: '#fbf1c7', panel: '#f2e5bc', muted: '#7c6f64', text: '#3c3836', accent: '#b57614' } },
  { id: 'snow',            name: 'Snow',             desc: 'Cool off-whites and arctic blue accents. Crisp and airy.',                               colors: { bg: '#eceff4', panel: '#e5e9f0', muted: '#6c7689', text: '#2e3440', accent: '#5e81ac' } },
  { id: 'sandstone',       name: 'Sandstone',        desc: 'Sandy warm tones with a terracotta accent. Natural and grounded.',                       colors: { bg: '#f5f0e6', panel: '#efe8d8', muted: '#8a7f68', text: '#3a3324', accent: '#c2683f' } },
  { id: 'sky',             name: 'Sky',              desc: 'Soft sky blues with a bright azure accent. Light and open.',                             colors: { bg: '#eef5fb', panel: '#e3eef8', muted: '#5d7287', text: '#1f3349', accent: '#2f7fd1' } },
  { id: 'meadow',          name: 'Meadow',           desc: 'Soft greens on a meadow-white base. Fresh and calm.',                                   colors: { bg: '#eef6ee', panel: '#e3f0e3', muted: '#5e7a5e', text: '#21331f', accent: '#2f9e44' } },
  { id: 'blossom',         name: 'Blossom',          desc: 'Soft pinks and rose on a white canvas. Delicate and playful.',                           colors: { bg: '#fdeef4', panel: '#fbe3ee', muted: '#8a6076', text: '#4a2236', accent: '#d6336c' } },
]

const DL_ICON = `<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5v-2z"/></svg>`

function buildCard(theme) {
  const { id, name, desc, colors } = theme
  const { bg, panel, muted, text, accent } = colors
  const href = `${BASE}themes/${id}.hivetheme.png`
  const filename = `${name.replace(/[éè]/g, 'e').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '-').toLowerCase()}.hivetheme.png`

  return `<article class="card preset-card reveal">
  <div class="preset-preview" style="background:${bg}">
    <div class="preset-preview-bar" style="background:${panel}">
      <div class="preset-preview-dots">
        <div class="preset-preview-dot" style="background:#ff5f57"></div>
        <div class="preset-preview-dot" style="background:#febc2e"></div>
        <div class="preset-preview-dot" style="background:#28c840"></div>
      </div>
    </div>
    <div class="preset-swatch-row">
      <div class="preset-swatch" style="background:${panel}"></div>
      <div class="preset-swatch" style="background:${muted}"></div>
      <div class="preset-swatch" style="background:${text}"></div>
      <div class="preset-swatch" style="background:${accent}"></div>
    </div>
  </div>
  <div class="preset-body">
    <div class="preset-name">${name}</div>
    <p class="preset-desc">${desc}</p>
    <a class="download-btn" href="${href}" download="${filename}">${DL_ICON} Download</a>
  </div>
</article>`
}

function sectionLabel(label) {
  return `<div class="preset-section-label reveal"><span class="kicker">${label}</span></div>`
}

const grid = document.getElementById('preset-grid')
if (grid) {
  grid.innerHTML =
    sectionLabel('Dark Themes') +
    DARK_THEMES.map(buildCard).join('') +
    sectionLabel('Light Themes') +
    LIGHT_THEMES.map(buildCard).join('')
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!reduceMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
  }, { threshold: 0.08 })
  document.querySelectorAll('.reveal').forEach(el => io.observe(el))
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'))
}

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
