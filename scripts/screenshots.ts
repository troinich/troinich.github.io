/**
 * Takes the README screenshots from the production build: `npm run screenshots`.
 * Fixed date (10 December) and reduced motion, so the pictures come out the same every time.
 */
import { chromium, devices, type BrowserContextOptions, type Page } from '@playwright/test'
import { preview } from 'vite'

const PORT = 4175
const BASE = `http://localhost:${PORT}`
const OUT = 'docs/screenshots'

const server = await preview({ preview: { port: PORT, strictPort: true } })
const browser = await chromium.launch()

async function open(options: BrowserContextOptions) {
  const context = await browser.newContext({ ...options, reducedMotion: 'reduce' })
  await context.addCookies([{ name: 'cookie_consent', value: 'no', url: BASE }])
  const page = await context.newPage()
  await page.clock.install({ time: new Date(2026, 11, 10, 10) })
  await page.goto(BASE)
  await page.evaluate(() => document.fonts.ready)
  await page.clock.runFor(6000) // the arrival pulse is over; today's door keeps its steady glow
  return { page, done: () => context.close() }
}

const shot = (file: string) => ({ path: `${OUT}/${file}.jpg`, type: 'jpeg' as const, quality: 85 })

/** CSS transitions (the door swing or fade) run in real time, not on the page's fake clock. */
async function settle(page: Page) {
  await page.clock.runFor(1500)
  await page.waitForTimeout(1200)
  await page.mouse.move(0, 0)
  await page.evaluate(() => window.scrollTo(0, 0)) // clicking a door may have scrolled to it
  await page.waitForTimeout(300)
}

const doorButton = (page: Page, id: number) => page.getByRole('button', { name: new RegExp(`^Door ${id}( \\(today\\))?, closed$`) })

// 1. The calendar on a desktop: a few doors open, today's door (10) with its ribbon
{
  const { page, done } = await open({ viewport: { width: 1280, height: 1180 }, deviceScaleFactor: 2 })
  for (const id of [3, 7, 24]) await doorButton(page, id).click()
  await settle(page)
  await page.screenshot(shot('calendar'))

  // 2. A door's "Read more" card
  await doorButton(page, 10).click()
  await page.locator('#door-10').getByRole('button', { name: /Read more/ }).click()
  await page.clock.runFor(1000)
  await page.waitForTimeout(600)
  await page.getByRole('dialog').screenshot(shot('read-more'))
  await done()
}

// 3. Phones: doors 1–24 in order, with "Go to today's door"
{
  const { page, done } = await open(devices['iPhone 13'])
  await doorButton(page, 1).click()
  await settle(page)
  // start at the buttons, so the picture shows the phone-only shortcut and the doors in order
  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button')].find((b) => b.textContent === 'Open all doors')!
    window.scrollTo(0, buttons.getBoundingClientRect().top + window.scrollY - 16)
  })
  await page.waitForTimeout(300)
  await page.screenshot(shot('phone'))
  await done()
}

// 4. The snowman game, step 3 of 3, with the hat and carrot being dragged onto the picture
{
  const { page, done } = await open({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 })
  await page.getByRole('button', { name: 'Build a snowman' }).click()
  await page.getByRole('button', { name: 'Roll some snow' }).click()
  await page.clock.runFor(500)
  await page.getByRole('button', { name: 'Find buttons' }).click()
  await page.clock.runFor(500)
  const piece = await page.getByRole('button', { name: 'Dress him up' }).boundingBox()
  const picture = await page.getByRole('img', { name: /three coal buttons/ }).boundingBox()
  if (!piece || !picture) throw new Error('snowman game not found')
  await page.mouse.move(piece.x + piece.width / 2, piece.y + piece.height / 2)
  await page.mouse.down()
  await page.mouse.move(picture.x + picture.width * 0.6, picture.y + picture.height * 0.33, { steps: 8 })
  await page.clock.runFor(300)
  await page.getByRole('dialog').screenshot(shot('snowman'))
  await page.mouse.up()
  await done()
}

await browser.close()
server.httpServer.close()
console.log(`Saved to ${OUT}/`)
