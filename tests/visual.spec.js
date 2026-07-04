import { test, expect } from '@playwright/test'

const PAGES = [
  { name: 'Home',         path: '/',                 title: 'HIVE' },
  { name: 'Downloads',   path: '/downloads.html',   title: 'Download' },
  { name: 'TimeCapsule', path: '/time-capsule.html',title: 'Time Capsule' },
  { name: 'Presets',     path: '/presets.html',      title: 'Presets' },
  { name: 'Account',     path: '/account.html',      title: 'Account' },
  { name: 'Support',     path: '/support.html',      title: 'Support' },
]

for (const page of PAGES) {
  test.describe(page.name, () => {
    test('loads without console errors', async ({ page: pw }) => {
      const errors = []
      pw.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
      await pw.goto(page.path)
      await pw.waitForLoadState('networkidle')
      // Filter out expected Ko-fi/Supabase placeholder errors
      const real = errors.filter(e =>
        !e.includes('ko-fi') &&
        !e.includes('supabase') &&
        !e.includes('YOUR_PROJECT_ID') &&
        !e.includes('Failed to load resource')
      )
      expect(real, `Console errors on ${page.name}: ${real.join(', ')}`).toHaveLength(0)
    })

    test('has correct title', async ({ page: pw }) => {
      await pw.goto(page.path)
      await expect(pw).toHaveTitle(new RegExp(page.title, 'i'))
    })

    test('nav renders with brand', async ({ page: pw }) => {
      await pw.goto(page.path)
      const brand = pw.locator('.nav-brand')
      await expect(brand).toBeVisible()
      await expect(brand).toContainText('HIVE')
    })

    test('nav links are present', async ({ page: pw }) => {
      await pw.goto(page.path)
      // At desktop width links should be visible
      const links = pw.locator('.nav-links a')
      const count = await links.count()
      expect(count).toBeGreaterThanOrEqual(4)
    })

    test('footer renders', async ({ page: pw }) => {
      await pw.goto(page.path)
      const footer = pw.locator('.site-footer').first()
      await expect(footer).toBeVisible()
    })

    test('no overlapping critical elements', async ({ page: pw }) => {
      await pw.goto(page.path)
      await pw.waitForLoadState('networkidle')
      // H1 should be visible and not clipped by nav
      const h1 = pw.locator('h1').first()
      if (await h1.count() > 0) {
        const box = await h1.boundingBox()
        if (box) {
          expect(box.y, 'h1 should not be behind nav').toBeGreaterThan(60)
        }
      }
    })

    test('full-page desktop screenshot', async ({ page: pw }, testInfo) => {
      await pw.goto(page.path)
      await pw.waitForLoadState('networkidle')
      await pw.waitForTimeout(600) // let animations settle
      const screenshot = await pw.screenshot({ fullPage: true })
      await testInfo.attach(`${page.name}-desktop`, { body: screenshot, contentType: 'image/png' })
    })
  })
}

// Interactive tests
test('Downloads page — Apple Silicon card is clickable', async ({ page }) => {
  await page.goto('/downloads.html')
  const card = page.locator('.dl-card').first()
  await expect(card).toBeVisible()
  const href = await card.getAttribute('href')
  expect(href).toContain('arm64.dmg')
})

test('Presets page — theme cards have download links pointing to .hivetheme.png files', async ({ page }) => {
  await page.goto('/presets.html')
  await page.waitForLoadState('networkidle')
  const downloadBtn = page.locator('.download-btn').first()
  await expect(downloadBtn).toBeVisible()
  const href = await downloadBtn.getAttribute('href')
  expect(href).toContain('.hivetheme.png')
  const dl = await downloadBtn.getAttribute('download')
  expect(dl).toContain('.hivetheme.png')
})

test('Account page — shows unconfigured state when Supabase not set', async ({ page }) => {
  await page.goto('/account.html')
  await page.waitForLoadState('networkidle')
  // With placeholder credentials, should show setup notice
  const unconfigured = page.locator('#state-unconfigured')
  await expect(unconfigured).toBeVisible()
})

test('Home page — scroll narrative has 4 chapters', async ({ page }) => {
  await page.goto('/')
  const chapters = page.locator('.n-chapter')
  await expect(chapters).toHaveCount(4)
})

test('Mobile nav burger opens mobile menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const burger = page.locator('.nav-burger')
  await expect(burger).toBeVisible()
  await burger.click()
  const mobileMenu = page.locator('.nav-mobile')
  await expect(mobileMenu).toHaveClass(/open/)
})

test('Nav active link matches current page', async ({ page }) => {
  await page.goto('/downloads.html')
  const activeLink = page.locator('.nav-links a.active')
  await expect(activeLink).toHaveCount(1)
  await expect(activeLink).toContainText('Downloads')
})
