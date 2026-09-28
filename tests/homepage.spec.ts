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
  const menu = page.getByRole('button', { name: 'Open navigation', exact: true })
  if (await menu.isVisible()) await menu.click()
  const demo = page.getByRole('navigation').getByRole('link', { name: 'Demo & Plugins', exact: true })
  await expect(demo).toBeVisible()
  await expect(demo).toHaveAttribute('href', '#demo')
  await expect(page.getByRole('navigation').getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute('href', 'https://github.com/Inflak-orchestration')
})

test('hero gives gallery and demo equal prominence with a secondary overview', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const hero = page.locator('.hero-content')
  const gallery = hero.getByRole('link', { name: 'Explore the gallery' })
  const demo = hero.getByRole('link', { name: 'Explore the demo' })
  const overview = hero.getByRole('button', { name: 'Watch overview' })
  await expect(gallery).toHaveAttribute('href', 'https://inflak-orchestration.github.io/Inflak-gallery/')
  await expect(demo).toHaveAttribute('href', '#demo')
  await expect(hero.locator('.hero-actions .button-primary')).toHaveCount(2)
  await expect(hero.getByRole('link', { name: 'Meet the architecture' })).toHaveCount(0)
  await expect(hero.locator('.hero-description')).toHaveText('A unified architecture for agents that work with people.')
  for (const [width, height] of [[1440, 900], [390, 844], [320, 568]]) {
    await page.setViewportSize({ width: width!, height: height! })
    const galleryBounds = (await gallery.boundingBox())!
    const demoBounds = (await demo.boundingBox())!
    const overviewBounds = (await overview.boundingBox())!
    expect(galleryBounds.width).toBe(demoBounds.width)
    expect(galleryBounds.height).toBe(demoBounds.height)
    expect(overviewBounds.y).toBeGreaterThanOrEqual(demoBounds.y + demoBounds.height)
    expect(demoBounds.y + demoBounds.height).toBeLessThan(height!)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await demo.click()
  await expect(page).toHaveURL(/#demo$/)
  await expect(page.locator('#demo-title')).toBeInViewport()
})

test('architecture tabs support selection and keyboard navigation', async ({ page }) => {
  await page.goto('/')
  const router = page.getByRole('tab', { name: 'L1 Router' })
  await router.focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('tab', { name: 'L2 Planner' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('#layer-panel')).toContainText('What should happen next?')
  await page.keyboard.press('End')
  await expect(page.locator('#layer-panel')).toContainText('How does it become an interface?')
  await page.keyboard.press('Home')
  await expect(router).toBeFocused()
  await page.getByRole('tab', { name: 'L3 Designer' }).click()
  await expect(page.locator('#layer-panel')).toContainText('Semantic widget contract')
})

test('Multimodal Co-Creation overview shows the registered planners, widgets, and source package', async ({ page }) => {
  await page.goto('/#inflak-main')
  const section = page.getByRole('region', { name: 'Multimodal Co-Creation', exact: true })
  await expect(section.getByRole('heading', { name: 'Multimodal Co-Creation', exact: true })).toBeVisible()
  await expect(page.locator('#architecture + #inflak-main + #in-practice + #demo')).toHaveCount(1)
  await expect(section.locator('thead th')).toHaveText(['Task planner', 'Settings form', 'Option selector', 'Content editor', 'Structure editor', 'Canvas editor', 'Parameter controls'])
  const rows = section.locator('tbody tr')
  await expect(rows).toHaveCount(5)
  for (const [index, name, supported] of [
    [0, 'Writing draft', 2], [1, 'Writing revision', 3], [2, 'Prompt enhancement', 3],
    [3, 'Image generation', 3], [4, 'Image editing', 4],
  ] as const) {
    await expect(rows.nth(index).getByRole('rowheader')).toContainText(name)
    await expect(rows.nth(index).locator('.widget-supported')).toHaveCount(supported)
  }
  await expect(section.getByRole('link', { name: 'View Multimodal Co-Creation on GitHub' })).toHaveAttribute('href', 'https://github.com/Inflak-orchestration/inflak-main')
  for (const directory of ['skills', 'registry', 'contract']) {
    await expect(section.locator(`a[href$="/tree/main/${directory}"]`)).toHaveCount(1)
  }
  await expect(section).toContainText('not a standalone agent application')
  await page.setViewportSize({ width: 320, height: 800 })
  const map = section.getByRole('region', { name: 'Planner and widget compatibility' })
  await map.focus()
  await page.keyboard.press('ArrowRight')
  await expect.poll(() => map.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('demo plugins explain layer skills consistently and group generated plugins under Author', async ({ page }) => {
  await page.goto('/#demo')
  const demo = page.locator('#demo')
  const tabs = demo.getByRole('tab')
  await expect(tabs).toHaveCount(4)
  await expect(demo.locator('img')).toHaveCount(0)
  await expect(demo.getByRole('link', { name: 'Explore layer skills' })).toHaveCount(0)
  await expect(demo.getByRole('link', { name: 'View gallery case' })).toHaveAttribute('href', /\?case=inflak-main$/)
  await expect(demo.getByRole('tab', { name: /Daily Paper/ })).toHaveCount(0)
  await expect(demo.getByRole('link', { name: 'Run locally' })).toHaveAttribute('href', /Inflak-demo#install-on-another-machine$/)
  await expect(demo.getByRole('tabpanel')).toHaveCount(1)
  await tabs.nth(0).focus()
  await page.keyboard.press('ArrowDown')
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(demo.getByRole('tabpanel').locator('.plugin-layers > div')).toHaveCount(4)
  await expect(demo.getByRole('tabpanel')).toContainText('atomic commits')
  await expect(demo.getByRole('link', { name: 'View gallery case' })).toHaveAttribute('href', /\?case=inflak-svg-authoring$/)
  await tabs.nth(2).click()
  await expect(demo.locator('option')).toHaveCount(13)
  const layerTexts: string[][] = [[], [], [], []]
  const caseIds = ['inflak-pN1-image-prompt-iteration', 'inflak-pN2-input-grounded-prompt-structure', 'inflak-pN3-sketch-layout', 'inflak-pN4-image-inpainting', 'inflak-pN5-writing-brainstorm', 'inflak-pN6', 'inflak-pN7-image-prompt-control', 'inflak-pN8', 'inflak-pN9-chart-analysis-instruction', 'inflak-pN10-svg-refinement-instruction', 'inflak-pN11-svg-prompt-enhancement', 'inflak-pN12-interactive-svg-refinement', 'inflak-pN13-proactive-intent-recommendation']
  const specificTerms = ['selected keywords', 'source spans', 'color-to-object', 'marked scope', 'narrative directions', 'source-prompt IDs', 'control specification', 'authoring bundle', 'source evidence', 'artifact-first', 'ambiguous references', 'candidate identity', 'inferred goals']
  for (let index = 0; index < 13; index++) {
    await demo.getByLabel('Interaction paradigm', { exact: true }).selectOption(String(index))
    await expect(demo.locator('#paradigm-source')).toHaveAttribute('href', new RegExp(`/inflak-pN${index + 1}-`))
    await expect(demo.locator('#paradigm-description')).not.toBeEmpty()
    await expect(demo.locator('#paradigm-case')).toHaveAttribute('href', new RegExp(`\\?case=${caseIds[index]}$`))
    const descriptions = demo.locator('#plugin-panel-paradigms > .plugin-layers dd')
    await expect(descriptions.first()).toContainText(specificTerms[index]!)
    for (let layerIndex = 0; layerIndex < 4; layerIndex++) {
      layerTexts[layerIndex]!.push(await descriptions.nth(layerIndex).innerText())
    }
  }
  for (const descriptions of layerTexts) expect(new Set(descriptions).size).toBe(13)
  await demo.getByLabel('Interaction paradigm', { exact: true }).selectOption('6')
  await expect(demo.locator('#plugin-panel-paradigms')).toContainText('frame-share sliders')
  await expect(demo.locator('#plugin-panel-paradigms > .contract')).toContainText('confirmed control specification')
  await expect(demo.locator('#plugin-panel-paradigms')).not.toContainText('In P3')
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (let index = 0; index < 4; index++) {
      await tabs.nth(index).click()
      await expect(demo.getByRole('tabpanel')).toHaveCount(1)
      await expect(demo.getByRole('tabpanel').locator(':scope > .plugin-layers dt')).toHaveText(['L1Router', 'L2Planner', 'L3Designer', 'L4Renderer'])
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
  }
  const generated = demo.getByRole('region', { name: 'Daily Paper Conclusion' })
  await expect(demo.getByRole('link', { name: 'View gallery case' })).toHaveCount(0)
  await expect(generated).toBeVisible()
  await expect(generated.locator('.plugin-layers > div')).toHaveCount(4)
  await expect(generated.getByRole('link', { name: 'View generated plugin' })).toHaveAttribute('href', /plugins\/inflak-daily-paper-conclusion$/)
  await tabs.nth(3).focus()
  await page.keyboard.press('Home')
  await expect(tabs.nth(0)).toBeFocused()
  await page.keyboard.press('End')
  await expect(tabs.nth(3)).toBeFocused()
})

test('example carousel loops, supports keyboard and dots, and keeps uniform image ratios', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const carousel = page.getByRole('region', { name: 'Inflak examples' })
  const dots = carousel.locator('.carousel-dot')
  await expect(dots).toHaveCount(5)
  await expect(carousel.locator('.example-title')).toHaveText(['Keyword grid', 'Block composer', 'Sketch canvas', 'Embedded selectors', 'Object controls'])
  await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true')
  await carousel.getByRole('button', { name: 'Previous example' }).click()
  await expect(dots.nth(4)).toHaveAttribute('aria-current', 'true')
  await carousel.getByRole('button', { name: 'Next example' }).click()
  await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true')
  await carousel.getByRole('button', { name: 'Show embedded selectors' }).click()
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
  await carousel.getByRole('button', { name: 'Expand object controls', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.locator('#figure-title')).toHaveText('Object controls')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  for (const [width, height] of [[1440, 740], [1920, 1080], [320, 568]]) {
    await page.setViewportSize({ width: width!, height: height! })
    await carousel.getByRole('button', { name: 'Show keyword grid' }).click()
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

test('overview video loads on demand, plays locally, and stops on close', async ({ page }) => {
  let videoRequested = false
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.endsWith('/inflak-overview.mp4')) videoRequested = true
  })
  await page.goto('/')
  const originalUrl = page.url()
  const opener = page.getByRole('button', { name: 'Watch overview', exact: true })
  await expect(opener).toBeVisible()
  expect(videoRequested).toBe(false)
  const video = page.locator('#case-video')
  await expect(video).not.toHaveAttribute('src')
  await opener.click()
  const dialog = page.getByRole('dialog', { name: 'Inflak overview', exact: true })
  await expect(dialog).toBeVisible()
  await expect(video).toHaveAttribute('src', /assets\/inflak-overview\.mp4$/)
  await expect(video).not.toHaveAttribute('poster')
  await expect(video).toHaveJSProperty('controls', true)
  await expect(video).toHaveJSProperty('playsInline', true)
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState)).toBeGreaterThanOrEqual(2)
  await video.evaluate((element: HTMLVideoElement) => element.play())
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0.1)
  const metadata = await video.evaluate((element: HTMLVideoElement) => ({ duration: element.duration, width: element.videoWidth, height: element.videoHeight }))
  expect(metadata.duration).toBeCloseTo(217.57, 0)
  expect(metadata.width).toBe(1662)
  expect(metadata.height).toBe(1080)
  await expect(dialog.getByRole('link', { name: 'Open video', exact: true })).toHaveAttribute('href', /assets\/inflak-overview\.mp4$/)
  await expect(page).toHaveURL(originalUrl)
  await dialog.getByRole('button', { name: 'Close video' }).click()
  await expect(dialog).not.toBeVisible()
  await expect(video).toHaveJSProperty('paused', true)
  await expect(video).not.toHaveAttribute('src')
  await expect(opener).toBeFocused()
})

test('case videos open in-page and stop on every dismissal path', async ({ page }) => {
  await page.route('**/data/gallery_cases/clips/*.mp4', (route) => route.abort())
  await page.goto('/')
  const originalUrl = page.url()
  const cases = page.locator('#in-practice .case')
  const dialog = page.locator('.video-dialog')
  const video = dialog.locator('video')
  await expect(video).not.toHaveAttribute('src')
  for (const [index, title, filename] of [
    [0, 'Multimodal Co-Creation', 'inflak-main.mp4'],
    [1, 'SVG Collage Authoring', 'inflak-svg-collage-authoring.mp4'],
  ] as const) {
    const destination = `https://inflak-orchestration.github.io/Inflak-gallery/data/gallery_cases/clips/${filename}`
    for (const [name, dismissal] of [[`Watch ${title} video`, 'escape'], [`Watch ${title}`, 'button'], [`Watch ${title}`, 'backdrop']] as const) {
      const opener = cases.nth(index).getByRole('button', { name, exact: true })
      await opener.click()
      await expect(dialog).toBeVisible()
      await expect(dialog.getByRole('heading', { name: title, exact: true })).toBeVisible()
      await expect(video).toHaveAttribute('src', destination)
      await expect(video).toHaveJSProperty('controls', true)
      await expect(video).toHaveJSProperty('playsInline', true)
      await expect(page).toHaveURL(originalUrl)
      await expect(page.locator('body')).toHaveClass('dialog-open')
      await expect(dialog.getByRole('link', { name: 'Open video' })).toHaveAttribute('href', destination)
      await expect(dialog.getByRole('status')).toContainText('Video could not be loaded.')
      if (dismissal === 'escape') await page.keyboard.press('Escape')
      else if (dismissal === 'button') await dialog.getByRole('button', { name: 'Close video' }).click()
      else await page.mouse.click(2, 2)
      await expect(dialog).not.toBeVisible()
      await expect(video).toHaveJSProperty('paused', true)
      await expect(video).not.toHaveAttribute('src')
      await expect(page.locator('body')).not.toHaveClass('dialog-open')
      await expect(opener).toBeFocused()
    }
  }
})

test('figures open, zoom, close, and restore focus', async ({ page }) => {
  await page.goto('/')
  for (const name of ['View the full flow']) {
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
  await page.route('**/data/gallery_cases/clips/*.mp4', (route) => route.abort())
  await page.goto('/')
  await page.locator('.hero-content').evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  await page.locator('.site-footer').scrollIntoViewIfNeeded()
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
  await page.getByRole('button', { name: 'View the full flow' }).click()
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Watch Multimodal Co-Creation', exact: true }).click()
  await expect(page.locator('.video-status')).toContainText('Video could not be loaded.')
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
})