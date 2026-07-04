import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase.config.js'
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

/* ── Detect placeholder ──────────────────────────────────── */
const isConfigured =
  SUPABASE_URL !== 'https://YOUR_PROJECT_ID.supabase.co' &&
  SUPABASE_ANON_KEY !== 'YOUR_ANON_KEY' &&
  SUPABASE_URL.startsWith('https://')

const stateUnconfigured = document.getElementById('state-unconfigured')
const authForms          = document.getElementById('auth-forms')
const stateVerify        = document.getElementById('state-verify')
const stateLoggedin      = document.getElementById('state-loggedin')

function showOnly(el) {
  ;[stateUnconfigured, authForms, stateVerify, stateLoggedin].forEach(e => {
    if (!e) return
    if (e === el) {
      e.style.display = el.classList.contains('auth-loggedin') ? 'flex' : el.classList.contains('auth-state') ? 'flex' : 'block'
    } else {
      e.style.display = 'none'
    }
  })
}

if (!isConfigured) {
  showOnly(stateUnconfigured)
} else {
  initAuth()
}

initFooter()

function initAuth() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  showOnly(authForms)

  /* ── Elements ── */
  const tabLogin    = document.getElementById('tab-login')
  const tabSignup   = document.getElementById('tab-signup')
  const formLogin   = document.getElementById('form-login')
  const formSignup  = document.getElementById('form-signup')
  const errEl       = document.getElementById('auth-error')
  const btnLogin    = document.getElementById('btn-login')
  const btnSignup   = document.getElementById('btn-signup')
  const btnBack     = document.getElementById('btn-back-to-login')
  const btnSignout  = document.getElementById('btn-signout')
  const verifyEmail = document.getElementById('verify-email-display')
  const avatarEl    = document.getElementById('auth-avatar')
  const emailEl     = document.getElementById('auth-email-display')
  const sinceEl     = document.getElementById('auth-since')

  /* ── Tab switching ── */
  function activateTab(tab) {
    tabLogin.classList.toggle('active', tab === 'login')
    tabSignup.classList.toggle('active', tab === 'signup')
    tabLogin.setAttribute('aria-selected', String(tab === 'login'))
    tabSignup.setAttribute('aria-selected', String(tab === 'signup'))
    formLogin.style.display  = tab === 'login'  ? 'flex' : 'none'
    formSignup.style.display = tab === 'signup' ? 'flex' : 'none'
    clearError()
  }

  tabLogin.addEventListener('click',  () => activateTab('login'))
  tabSignup.addEventListener('click', () => activateTab('signup'))

  function showError(msg) {
    errEl.textContent = msg
    errEl.classList.add('visible')
  }
  function clearError() {
    errEl.textContent = ''
    errEl.classList.remove('visible')
  }

  function setLoading(btn, loading) {
    btn.disabled = loading
    btn.textContent = loading ? 'Please wait…' : btn.dataset.label || btn.textContent
  }
  btnLogin.dataset.label  = 'Sign in'
  btnSignup.dataset.label = 'Create account'

  /* ── Login ── */
  formLogin.addEventListener('submit', async e => {
    e.preventDefault()
    clearError()
    setLoading(btnLogin, true)
    const email    = formLogin.querySelector('#login-email').value.trim()
    const password = formLogin.querySelector('#login-password').value
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(btnLogin, false)
    if (error) { showError(error.message); return }
    // onAuthStateChange will handle UI update
  })

  /* ── Signup ── */
  formSignup.addEventListener('submit', async e => {
    e.preventDefault()
    clearError()
    setLoading(btnSignup, true)
    const email    = formSignup.querySelector('#signup-email').value.trim()
    const password = formSignup.querySelector('#signup-password').value
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(btnSignup, false)
    if (error) { showError(error.message); return }
    if (verifyEmail) verifyEmail.textContent = email
    showOnly(stateVerify)
  })

  /* ── Back to login ── */
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      showOnly(authForms)
      activateTab('login')
    })
  }

  /* ── Sign out ── */
  if (btnSignout) {
    btnSignout.addEventListener('click', async () => {
      await supabase.auth.signOut()
    })
  }

  /* ── Auth state change ── */
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      const user   = session.user
      const initLetter = (user.email || '?')[0].toUpperCase()
      if (avatarEl)  avatarEl.textContent  = initLetter
      if (emailEl)   emailEl.textContent   = user.email || '—'
      if (sinceEl) {
        const d = new Date(user.created_at || Date.now())
        sinceEl.textContent = `Member since ${d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      }
      showOnly(stateLoggedin)
    } else {
      showOnly(authForms)
      activateTab('login')
    }
  })
}
