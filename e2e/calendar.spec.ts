import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const NOV_19 = new Date(2026, 10, 19, 10)
const DEC_10 = new Date(2026, 11, 10, 10)

/** Open the site on a given day, with the cookie question already answered. */
async function arrive(page: Page, date: Date, path = '/') {
  await page.clock.setFixedTime(date)
  await page.context().addCookies([{ name: 'cookie_consent', value: 'no', url: 'http://localhost:4173' }])
  await page.goto(path)
}

test.describe('lock before December', () => {
  test('a plain visit gets "Too early!" and the snowman game', async ({ page }) => {
    await arrive(page, NOV_19)
    await expect(page.getByRole('dialog', { name: 'Too early!' })).toBeVisible()
  })

  test('the shared ?open link goes straight to the calendar and cleans the address', async ({ page }) => {
    await arrive(page, NOV_19, '/?open')
    await expect(page.getByRole('button', { name: 'Door 19 (today), closed' })).toBeVisible()
    await expect(page.getByRole('dialog', { name: 'Too early!' })).toHaveCount(0)
    expect(new URL(page.url()).search).toBe('')

    await page.reload() // remembered on this device
    await expect(page.getByRole('dialog', { name: 'Too early!' })).toHaveCount(0)
  })
})

test.describe('doors in a real browser', () => {
  test('a door opens on click, and "Read more" on the open card is clickable', async ({ page }) => {
    await arrive(page, DEC_10)
    // Playwright fails the click if another element (e.g. the door's hit area) would receive it
    await page.getByRole('button', { name: 'Door 10 (today), closed' }).click()
    await page.getByRole('button', { name: 'Read more about Stripe payments, end to end' }).click()
    const card = page.getByRole('dialog', { name: 'Stripe payments, end to end' })
    await expect(card).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(card).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Door 10 (today), open' })).toBeVisible()
  })

  test('door 24\'s "Full CV" button is clickable and opens the CV', async ({ page }) => {
    await arrive(page, new Date(2026, 11, 24, 10))
    await page.getByRole('button', { name: 'Door 24 (today), closed' }).click()
    await page.locator('#door-24').getByRole('button', { name: 'Full CV' }).click()
    await expect(page.getByRole('dialog', { name: 'Natalia Troinich' })).toBeVisible()
  })

  test('the footer snowman replay closes on a click outside the card', async ({ page }) => {
    await arrive(page, DEC_10)
    await page.getByRole('button', { name: 'Build a snowman' }).click()
    await expect(page.getByRole('dialog', { name: 'Build a snowman' })).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
})

test.describe('phones', () => {
  test("\"Go to today's door\" scrolls to it without opening it", async ({ page, isMobile }) => {
    test.skip(!isMobile, 'the button is for phones only')
    await arrive(page, DEC_10)
    await page.getByRole('button', { name: "Go to today's door" }).click()
    const door = page.getByRole('button', { name: 'Door 10 (today), closed' })
    await expect(door).toBeInViewport()
  })
})

test.describe('accessibility (axe)', () => {
  for (const [name, open] of [
    ['calendar', async () => {}],
    ['full CV', async (page: Page) => page.getByRole('button', { name: 'Show full CV' }).click()],
    ['"Too early!"', null],
  ] as const) {
    test(`${name} has no WCAG A/AA violations`, async ({ page }) => {
      await arrive(page, open ? DEC_10 : NOV_19)
      if (open) await open(page)
      await page.waitForTimeout(800) // let entry animations settle before checking contrast
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
    })
  }
})
