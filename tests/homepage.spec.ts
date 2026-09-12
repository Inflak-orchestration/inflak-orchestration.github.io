import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('loads real imagery with no runtime errors or horizontal overflow', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Inflak.', exact: true })).toBeVisible()
  await expect(page.getByText('A framework for human-agent interaction', { exact: true })).toHaveCount(0)
  await page.locator('.site-footer').scrollIntoViewIfNeeded()
  for (const image of await page.locator('img:visible').all()) {
    await expect(image).toHaveJSProperty('complete', true)
    expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(errors).toEqual([])
  await expect(page.getByRole('link', { name: 'Explore the gallery' })).toHaveAttribute('href', 'https://inflak-orchestration.github.io/Inflak-gallery/')
})

test('architecture tabs support selection and keyboard navigation', async ({ page }) => {
  await page.goto('/')
  const router = page.getByRole('tab', { name: 'L1 Router' })
  await router.focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('tab', { name: 'L2 Planner' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel')).toContainText('What should happen next?')
  await page.keyboard.press('End')
  await expect(page.getByRole('tabpanel')).toContainText('How does it become an interface?')
  await page.keyboard.press('Home')
  await expect(router).toBeFocused()
  await page.getByRole('tab', { name: 'L3 Designer' }).click()
  await expect(page.getByRole('tabpanel')).toContainText('Semantic widget contract')
})

test('example carousel loops, supports keyboard and dots, and keeps uniform image ratios', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const carousel = page.getByRole('region', { name: 'Inflak examples' })
  const dots = carousel.locator('.carousel-dot')
  await expect(dots).toHaveCount(5)
  await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true')
  await carousel.getByRole('button', { name: 'Previous example' }).click()
  await expect(dots.nth(4)).toHaveAttribute('aria-current', 'true')
  await carousel.getByRole('button', { name: 'Next example' }).click()
  await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true')
  await carousel.getByRole('button', { name: 'Show generated book cover' }).click()
  await expect(dots.nth(3)).toHaveAttribute('aria-current', 'true')
  await carousel.locator('.examples-viewport').focus()
  await page.keyboard.press('ArrowLeft')
  await expect(dots.nth(2)).toHaveAttribute('aria-current', 'true')
  await page.keyboard.press('Home')
  await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true')
  await page.keyboard.press('End')
  await expect(dots.nth(4)).toHaveAttribute('aria-current', 'true')
  const dimensions = await carousel.locator('.example-image').evaluateAll((elements) => elements.map((element) => {
    const bounds = element.getBoundingClientRect()
    const image = element.querySelector('img')!
    return { width: bounds.width, height: bounds.height, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight }
  }))
  for (const image of dimensions) {
    expect(image.width / image.height).toBeCloseTo(4 / 3, 2)
    expect(image.width).toBeCloseTo(dimensions[0]!.width, 1)
    expect(image.naturalWidth / image.naturalHeight).toBeCloseTo(4 / 3, 2)
  }
  await carousel.getByRole('button', { name: 'Expand collage authoring', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.locator('#figure-title')).toHaveText('Collage authoring')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  for (const [width, height] of [[1440, 740], [1920, 1080], [320, 568]]) {
    await page.setViewportSize({ width: width!, height: height! })
    await carousel.getByRole('button', { name: 'Show writing settings' }).click()
    await carousel.getByRole('button', { name: 'Previous example' }).click()
    await expect(dots.nth(4)).toHaveAttribute('aria-current', 'true')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('example carousel can be dragged without opening the figure', async ({ page }) => {
  await page.goto('/')
  const viewport = page.locator('.examples-viewport')
  await viewport.scrollIntoViewIfNeeded()
  const bounds = (await viewport.boundingBox())!
  const start = bounds.x + Math.min(bounds.width - 30, 250)
  const middle = bounds.y + bounds.height / 2
  await page.mouse.move(start, middle)
  await page.mouse.down()
  await page.mouse.move(start - 180, middle, { steps: 12 })
  await page.mouse.up()
  await expect(page.locator('.carousel-dot').nth(0)).toHaveAttribute('aria-current', 'false')
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('figures open, zoom, close, and restore focus', async ({ page }) => {
  await page.goto('/')
  for (const name of ['View the full flow', 'Explore multimodal co-creation', 'Explore collage authoring']) {
    const opener = page.getByRole('button', { name, exact: true })
    await opener.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('img')).toHaveJSProperty('complete', true)
    expect(await dialog.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
    await page.getByRole('button', { name: 'Zoom in', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Zoom out', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: 'Zoom out', exact: true }).click()
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await expect(opener).toBeFocused()
  }
})

test('mobile navigation and narrow layouts remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: /^(Open|Close) navigation$/ })
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('navigation').getByRole('link', { name: 'Architecture', exact: true }).click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(page).toHaveURL(/#architecture$/)
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('page and figure dialog pass accessibility checks', async ({ page }) => {
  await page.goto('/')
  await page.locator('.hero-content').evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  await page.locator('.site-footer').scrollIntoViewIfNeeded()
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
  await page.getByRole('button', { name: 'View the full flow' }).click()
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
})