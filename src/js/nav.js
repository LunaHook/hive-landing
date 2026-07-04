import '../../src/css/base.css'

const BASE = import.meta.env.BASE_URL

const PAGES = [
  { label: 'Home',         href: `${BASE}`,                 match: /^(\/hive-landing\/)?(index\.html)?$/ },
  { label: 'Downloads',    href: `${BASE}downloads.html`,   match: /downloads/ },
  { label: 'Time Capsule', href: `${BASE}time-capsule.html`,match: /time-capsule/ },
  { label: 'Presets',      href: `${BASE}presets.html`,     match: /presets/ },
  { label: 'Account',      href: `${BASE}account.html`,     match: /account/ },
  { label: 'Support',      href: `${BASE}support.html`,     match: /support/ },
]

const GH_URL = 'https://github.com/LunaHook/hive'

function currentPage(href) {
  const path = window.location.pathname
  if (href === BASE || href === `${BASE}index.html`) {
    return path === BASE || path === `${BASE}index.html` || path.endsWith('/hive-landing/')
  }
  return path.includes(href.replace(BASE, '').replace('.html', ''))
}

export function initNav() {
  const navEl = document.createElement('header')
  navEl.className = 'site-nav'
  navEl.id = 'site-nav'
  navEl.setAttribute('aria-label', 'Primary navigation')

  const linksHtml = PAGES.map(p => {
    const active = currentPage(p.href)
    return `<a href="${p.href}" class="${active ? 'active' : ''}" ${active ? 'aria-current="page"' : ''}>${p.label}</a>`
  }).join('')

  navEl.innerHTML = `
    <div class="inner">
      <a class="nav-brand" href="${BASE}" aria-label="HIVE home">
        <span class="brand-hex" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="26" height="26">
            <defs>
              <linearGradient id="navHexGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#22e0ff"/><stop offset="1" stop-color="#b060ff"/>
              </linearGradient>
            </defs>
            <path d="M16 2.6 27.6 9.3v13.4L16 29.4 4.4 22.7V9.3z" fill="none" stroke="url(#navHexGrad)" stroke-width="1.6"/>
            <path d="M16 9.2 21.6 12.5v6.6L16 22.4l-5.6-3.3v-6.6z" fill="url(#navHexGrad)" opacity="0.9"/>
          </svg>
        </span>
        <span class="brand-name">HIVE</span>
      </a>
      <nav class="nav-links" aria-label="Site pages">
        ${linksHtml}
        <a class="nav-ext" href="${GH_URL}" target="_blank" rel="noopener" aria-label="GitHub repository">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          GitHub
        </a>
      </nav>
      <a class="btn btn-sm btn-primary nav-cta" href="${BASE}downloads.html">Download</a>
      <button class="nav-burger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  `

  // Mobile menu
  const mobileLinks = PAGES.map(p => {
    const active = currentPage(p.href)
    return `<a href="${p.href}" class="${active ? 'active' : ''}">${p.label}</a>`
  }).join('')

  const mobileMenu = document.createElement('div')
  mobileMenu.className = 'nav-mobile'
  mobileMenu.id = 'nav-mobile'
  mobileMenu.setAttribute('aria-hidden', 'true')
  mobileMenu.innerHTML = `
    ${mobileLinks}
    <a class="nav-ext" href="${GH_URL}" target="_blank" rel="noopener">GitHub ↗</a>
    <a class="btn btn-primary nav-mobile-cta" href="${BASE}downloads.html">Download</a>
  `

  document.body.prepend(mobileMenu)
  document.body.prepend(navEl)

  // Scroll effect
  const nav = document.getElementById('site-nav')
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // Burger toggle
  const burger = navEl.querySelector('.nav-burger')
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open')
    burger.classList.toggle('open', isOpen)
    burger.setAttribute('aria-expanded', String(isOpen))
    mobileMenu.setAttribute('aria-hidden', String(!isOpen))
    document.body.style.overflow = isOpen ? 'hidden' : ''
  })

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open')
      burger.classList.remove('open')
      burger.setAttribute('aria-expanded', 'false')
      mobileMenu.setAttribute('aria-hidden', 'true')
      document.body.style.overflow = ''
    })
  })
}

export function initFooter() {
  const footer = document.createElement('footer')
  footer.className = 'site-footer'
  footer.innerHTML = `
    <div class="foot-brand">
      <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
        <defs>
          <linearGradient id="footGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#22e0ff"/><stop offset="1" stop-color="#b060ff"/>
          </linearGradient>
        </defs>
        <path d="M16 2.6 27.6 9.3v13.4L16 29.4 4.4 22.7V9.3z" fill="none" stroke="url(#footGrad)" stroke-width="1.6"/>
      </svg>
      <span>HIVE</span>
    </div>
    <p class="foot-tag">A session command center for the OpenCode CLI.</p>
    <nav class="foot-links" aria-label="Footer links">
      ${PAGES.slice(1).map(p => `<a href="${p.href}">${p.label}</a>`).join('')}
      <a href="${GH_URL}" target="_blank" rel="noopener">GitHub</a>
    </nav>
    <p class="foot-fine">© 2026 HIVE · Built for OpenCode · Not affiliated with the OpenCode project.</p>
  `
  document.body.appendChild(footer)
}
