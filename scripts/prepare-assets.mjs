import sharp from 'sharp'
import { mkdir, copyFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'

const [sourceArgument, logoArgument, widgetOverviewArgument] = process.argv.slice(2)
if (!sourceArgument || !logoArgument) throw new Error('Usage: node scripts/prepare-assets.mjs <rendered-figure-directory> <logo.png>')
const source = resolve(sourceArgument)
const output = resolve('public/assets')
await mkdir(output, { recursive: true })
await copyFile(resolve(logoArgument), join(output, 'inflak-logo.png'))
const logo = await sharp(logoArgument).metadata()
const logoSymbol = await sharp(logoArgument)
  .extract({ left: 0, top: 0, width: Math.round(logo.width * 0.48), height: logo.height })
  .png().toBuffer()
await sharp(logoSymbol)
  .trim()
  .ensureAlpha()
  .resize(56, 56, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({ top: 4, bottom: 4, left: 4, right: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png().toFile(join(output, 'favicon.png'))

for (const [original, destination] of [['gallery_main', 'gallery-main'], ['gallery_collage', 'gallery-collage'], ['walkthrough_case', 'walkthrough']]) {
  await sharp(join(source, `${original}.png`)).webp({ quality: 90 }).toFile(join(output, `${destination}.webp`))
}

const crop = (name, bounds, width) => sharp(join(source, `${name}.png`)).extract(bounds).resize({ width }).png().toBuffer()
const layout = await crop('gallery_main', { left: 1167, top: 91, width: 386, height: 356 }, 520)
const cover = await crop('gallery_main', { left: 1565, top: 91, width: 235, height: 356 }, 275)
const story = await crop('gallery_main', { left: 293, top: 86, width: 307, height: 363 }, 300)
const form = await crop('gallery_main', { left: 2, top: 126, width: 286, height: 253 }, 300)
const collage = await crop('gallery_collage', { left: 121, top: 52, width: 574, height: 414 }, 540)

const widgetOverview = widgetOverviewArgument || join(source, 'gallery_overview_3x4.png')
const overviewSize = await sharp(widgetOverview).metadata()
const widgetCrops = [
  { name: 'keyword-grid', left: 8, top: 76, width: 220, height: 228 },
  { name: 'block-composer', left: 246, top: 84, width: 189, height: 210 },
  { name: 'sketch-canvas', left: 478, top: 77, width: 207, height: 216 },
  { name: 'embedded-selectors', left: 13, top: 687, width: 220, height: 137 },
  { name: 'object-controls', left: 479, top: 969, width: 217, height: 228 },
]
for (const widget of widgetCrops) {
  await sharp(widgetOverview).extract({
    left: Math.round(widget.left * overviewSize.width / 700),
    top: Math.round(widget.top * overviewSize.height / 1200),
    width: Math.round(widget.width * overviewSize.width / 700),
    height: Math.round(widget.height * overviewSize.height / 1200),
  }).resize(640, 480, { fit: 'contain', background: '#ffffff' })
    .webp({ quality: 90 }).toFile(join(output, `example-${widget.name}.webp`))
}

await sharp({ create: { width: 1000, height: 650, channels: 3, background: '#ffffff' } })
  .composite([{ input: layout, left: 50, top: 80 }, { input: cover, left: 655, top: 90 }])
  .webp({ quality: 88 }).toFile(join(output, 'co-creation-preview.webp'))
await sharp(collage).resize(900, 550, { fit: 'contain', background: '#ffffff' })
  .extend({ top: 50, bottom: 50, left: 50, right: 50, background: '#ffffff' })
  .webp({ quality: 88 }).toFile(join(output, 'collage-preview.webp'))

function grid(width, height) {
  const pixels = Buffer.alloc(width * height * 3)
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const offset = (row * width + column) * 3
      const line = row % 36 === 0 || column % 36 === 0
      pixels[offset] = line ? 234 : 245
      pixels[offset + 1] = line ? 232 : 243
      pixels[offset + 2] = line ? 227 : 238
    }
  }
  return sharp(pixels, { raw: { width, height, channels: 3 } })
}

await grid(1800, 960).composite([
  { input: form, left: 55, top: 615 },
  { input: story, left: 385, top: 560 },
  { input: await sharp(layout).resize(360).toBuffer(), left: 720, top: 585 },
  { input: await sharp(cover).resize(230).toBuffer(), left: 1110, top: 552 },
  { input: await sharp(collage).resize(370).toBuffer(), left: 1370, top: 610 },
]).webp({ quality: 86 }).toFile(join(output, 'hero.webp'))
await grid(780, 1470).composite([
  { input: await sharp(layout).resize(440).toBuffer(), left: 25, top: 900 },
  { input: await sharp(cover).resize(245).toBuffer(), left: 490, top: 925 },
]).webp({ quality: 86 }).toFile(join(output, 'hero-mobile.webp'))
console.log('Prepared homepage images, five 4:3 carousel examples, and the gallery logo in public/assets.')