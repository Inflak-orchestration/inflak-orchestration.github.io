import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/newsreader/500.css'
import '@fontsource/newsreader/500-italic.css'
import { createIcons, ArrowUpRight, ArrowRight, ArrowLeft, ArrowDown, BookOpen, Menu, X, Maximize2, ZoomIn, ZoomOut, Play, Check, Minus, Folder, FileJson, Files } from 'lucide'
import EmblaCarousel from 'embla-carousel'
import './homepage.css'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`
const gallery = 'https://inflak-orchestration.github.io/Inflak-gallery/'
const mainVideo = new URL('data/gallery_cases/clips/inflak-main.mp4', gallery).href
const collageVideo = new URL('data/gallery_cases/clips/inflak-svg-collage-authoring.mp4', gallery).href
const recordings = {
  main: { title: 'InFlak Main', url: mainVideo, poster: 'co-creation-preview.webp', description: 'A connected workflow from story writing to book-cover design.' },
  collage: { title: 'SVG Collage Authoring', url: collageVideo, poster: 'collage-preview.webp', description: 'Create, edit, and refine a persistent SVG collage with Inflak.' },
}
const organization = 'https://github.com/Inflak-orchestration'
const sourceRepository = `${organization}/inflak-main`
const icon = (name: string) => `<i data-lucide="${name === 'github' ? 'book-open' : name}" aria-hidden="true"></i>`
const mainPlanners = [
  { id: 'writing-draft', name: 'Writing draft', purpose: 'Create new text' },
  { id: 'writing-revision', name: 'Writing revision', purpose: 'Refine existing text' },
  { id: 'prompt-enhancement', name: 'Prompt enhancement', purpose: 'Improve an instruction' },
  { id: 'image-generation', name: 'Image generation', purpose: 'Create a new image' },
  { id: 'image-edit', name: 'Image editing', purpose: 'Transform an existing image' },
]
const mainWidgets = [
  { name: 'Settings form', planners: ['writing-draft', 'writing-revision', 'image-generation', 'image-edit'] },
  { name: 'Option selector', planners: ['writing-draft', 'writing-revision', 'prompt-enhancement', 'image-generation', 'image-edit'] },
  { name: 'Content editor', planners: ['prompt-enhancement'] },
  { name: 'Structure editor', planners: ['prompt-enhancement'] },
  { name: 'Canvas editor', planners: ['image-generation', 'image-edit'] },
  { name: 'Parameter controls', planners: ['writing-revision', 'image-edit'] },
]
const examples = [
  { id: 'keyword-grid', title: 'Keyword grid', description: 'Selectable keyword suggestions refine an image prompt, with a side-by-side comparison before confirmation.' },
  { id: 'block-composer', title: 'Block composer', description: 'Draggable instruction blocks organize subject, action, and composition into a structured prompt.' },
  { id: 'sketch-canvas', title: 'Sketch canvas', description: 'A drawing canvas captures spatial intent through colored sketches, a brush-width slider, and drawing tools.' },
  { id: 'embedded-selectors', title: 'Embedded selectors', description: 'Inline dropdowns turn highlighted prompt phrases into precise, adjustable parameters.' },
  { id: 'object-controls', title: 'Object controls', description: 'Color choices and a layout map support direct manipulation of individual elements in an SVG artifact.' },
]
const layers = [
  { name: 'Router', question: 'What is happening now?', description: 'Reconstruct the current state from the user\'s intent, artifacts, and interaction history. Route control to the planner that can advance the task.', input: 'Intent + artifacts + history', output: 'Orchestration context', example: 'A request for a book cover reaches the image-generation planner, together with the story already written.' },
  { name: 'Planner', question: 'What should happen next?', description: 'Identify the gap that blocks progress. Decide whether to involve the human or proceed directly to execution when enough information is available.', input: 'Orchestration context', output: 'Interaction or execution requirement', example: 'The cover needs a composition. The planner asks for a spatial layout before generating the image.' },
  { name: 'Designer', question: 'What interaction fits this moment?', description: 'Turn the interaction requirement into a semantic widget contract: the context to present, the controls to offer, and the information to return.', input: 'Interaction requirement', output: 'Semantic widget contract', example: 'A layout board lets the user arrange the title, the garden, and the characters on the book cover.' },
  { name: 'Renderer', question: 'How does it become an interface?', description: 'Realize the contract as a sandboxed interface. Validate the user\'s return and send it back to the Router, where the next decision begins.', input: 'Semantic widget contract', output: 'Interface + validated return', example: 'The user submits the arranged cover. Its layout returns to the Router and grounds the next generation step.' },
]

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <a class="brand" href="#" aria-label="Inflak home"><img src="${asset('inflak-logo.png')}" alt="Inflak" width="142" height="44"></a>
    <nav id="navigation" aria-label="Primary navigation">
      <a class="nav-home" href="#" aria-current="page">Overview</a>
      <a href="#architecture">Architecture</a>
      <a href="${gallery}">Case gallery ${icon('arrow-up-right')}</a>
      <a class="nav-github" href="${sourceRepository}">${icon('github')} GitHub</a>
    </nav>
    <button class="icon-button menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="navigation" title="Open navigation">${icon('menu')}</button>
  </header>
  <main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-content">
        <h1 id="hero-title">Inflak<span class="title-period">.</span></h1>
        <p class="hero-subtitle">Human-agent interaction,<br><em>orchestrated.</em></p>
        <p class="hero-description">The right interaction, at the right moment.<br>A unified architecture for agents that work with people.</p>
        <div class="hero-actions"><a class="button button-primary" href="${gallery}">Explore the gallery ${icon('arrow-up-right')}</a><a class="text-link" href="#architecture">Meet the architecture ${icon('arrow-down')}</a></div>
      </div>
      <div class="examples-carousel" role="region" aria-roledescription="carousel" aria-label="Inflak examples">
        <div class="examples-viewport" id="examples-viewport" tabindex="0" role="group" aria-label="Example slides">
          <div class="examples-track">
            ${examples.map((example, index) => `<div class="example-slide" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${examples.length}: ${example.title}"><button class="example-image" data-figure="example-${example.id}" aria-label="Expand ${example.title.toLowerCase()}" title="Expand ${example.title.toLowerCase()}"><img src="${asset(`example-${example.id}.webp`)}" alt="${example.description}" width="640" height="480" draggable="false"></button><p class="example-title">${example.title}</p></div>`).join('')}
          </div>
        </div>
        <div class="hero-caption">
          <span>Different widgets. Shared orchestration.</span>
          <div class="carousel-controls">
            <button class="icon-button carousel-previous" aria-label="Previous example" title="Previous example" aria-controls="examples-viewport">${icon('arrow-left')}</button>
            <div class="carousel-dots" role="group" aria-label="Choose an example">${examples.map((example, index) => `<button class="carousel-dot" aria-label="Show ${example.title.toLowerCase()}" title="${example.title}" aria-current="${index === 0}" aria-controls="examples-viewport" data-slide="${index}"><span></span></button>`).join('')}</div>
            <button class="icon-button carousel-next" aria-label="Next example" title="Next example" aria-controls="examples-viewport">${icon('arrow-right')}</button>
          </div>
          <a href="#in-practice">See Inflak in practice ${icon('arrow-down')}</a>
        </div>
        <p class="carousel-status" aria-live="polite" aria-atomic="true"></p>
      </div>
    </section>
    <section class="intro-band" aria-label="About Inflak">
      <div class="container intro-content">
        <p class="intro-statement">Beyond a prompt.<br><em>A shared process.</em></p>
        <div class="intro-detail"><p>Working with an agent is rarely a straight line. Intent evolves, artifacts change, and different moments call for different ways to interact.</p><p>Inflak coordinates that process through four composable layers, connecting human input, agent reasoning, and interactive interfaces.</p></div>
        <div class="facts"><div><strong>4</strong><span>orchestration layers</span></div><div><strong>13</strong><span>interaction paradigms</span></div></div>
      </div>
    </section>
    <section class="section container" id="architecture" aria-labelledby="architecture-title">
      <div class="section-heading"><p class="eyebrow">01 / The architecture</p><span class="section-note">Separate responsibilities. Shared context.</span></div>
      <h2 id="architecture-title">Four layers.<br><em>One evolving conversation.</em></h2>
      <div class="architecture-layout">
        <div class="layer-tabs" role="tablist" aria-label="Architecture layers" aria-orientation="vertical">${layers.map((layer, index) => `<button class="layer-tab" id="layer-tab-${index}" role="tab" aria-selected="${index === 0}" aria-controls="layer-panel" tabindex="${index === 0 ? 0 : -1}" data-layer="${index}"><span class="layer-index">L${index + 1}</span><span>${layer.name}</span>${icon('arrow-up-right')}</button>`).join('')}</div>
        <div class="layer-panel" id="layer-panel" role="tabpanel" aria-labelledby="layer-tab-0" tabindex="0"></div>
      </div>
      <div class="architecture-foot"><p>${icon('arrow-right')} Every interaction and execution result returns to the Router. The next step follows the current state, not a fixed script.</p><button class="text-link" data-figure="walkthrough" type="button">View the full flow ${icon('maximize-2')}</button></div>
    </section>
    <section class="implementation-band" id="inflak-main" aria-labelledby="implementation-title">
      <div class="container section">
        <div class="section-heading"><p class="eyebrow">02 / The implementation</p><span class="section-note">Agent-native. Skill-based. Composable.</span></div>
        <div class="implementation-intro">
          <div><h2 id="implementation-title">Inflak Main</h2><p class="implementation-subtitle">The architecture, packaged as skills.</p></div>
          <div class="implementation-summary"><p>A co-creation plugin with five task planners and six reusable widget designs. One Router coordinates the task; one Renderer realizes the selected interaction.</p><a class="text-link" href="${sourceRepository}">View Inflak Main on GitHub ${icon('arrow-up-right')}</a></div>
        </div>
        <div class="implementation-map-heading"><h3>Different tasks, shared widgets.</h3><span>5 planners / 6 widget designs</span></div>
        <div class="compatibility-scroll" tabindex="0" role="region" aria-label="Planner and widget compatibility">
          <table class="compatibility-table">
            <caption class="implementation-sr-only">Registered widget compatibility for the five Inflak Main task planners</caption>
            <thead><tr><th scope="col">Task planner</th>${mainWidgets.map((widget) => `<th scope="col">${widget.name}</th>`).join('')}</tr></thead>
            <tbody>${mainPlanners.map((planner) => `<tr><th scope="row"><span>${planner.name}</span><small>${planner.purpose}</small></th>${mainWidgets.map((widget) => `<td class="${widget.planners.includes(planner.id) ? 'widget-supported' : 'widget-unregistered'}">${icon(widget.planners.includes(planner.id) ? 'check' : 'minus')}<span class="implementation-sr-only">${widget.planners.includes(planner.id) ? 'Registered' : 'Not registered'}</span></td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
        <p class="compatibility-note">${icon('check')} Registered compatibility. At runtime, the planner selects a widget only when it matches the current gap, expected return, and available capabilities.</p>
        <div class="implementation-package" aria-label="Plugin package structure">
          <a href="${sourceRepository}/tree/main/skills"><span class="package-name">${icon('folder')}<code>skills/</code>${icon('arrow-up-right')}</span><strong>13 callable skills</strong><p>One Router, five Planners, six Designers, and one Renderer.</p></a>
          <a href="${sourceRepository}/tree/main/registry"><span class="package-name">${icon('file-json')}<code>registry/</code>${icon('arrow-up-right')}</span><strong>Explicit registrations</strong><p>Planner, widget, and tool definitions connect the available capabilities.</p></a>
          <a href="${sourceRepository}/tree/main/contract"><span class="package-name">${icon('files')}<code>contract/</code>${icon('arrow-up-right')}</span><strong>Shared contracts</strong><p>Cross-layer definitions support skill authoring and review.</p></a>
        </div>
        <p class="implementation-host"><strong>Inside a compatible agent host.</strong> The host provides the model, registered tools, sandboxed rendering, and widget-return bridge. Inflak Main supplies the orchestration skills, not a standalone agent application.</p>
      </div>
    </section>
    <section class="practice-band" id="in-practice" aria-labelledby="practice-title">
      <div class="container section">
        <div class="section-heading"><p class="eyebrow">03 / In practice</p><a class="text-link" href="${gallery}">All 15 recorded cases ${icon('arrow-up-right')}</a></div>
        <h2 id="practice-title">Different tasks.<br><em>The same foundation.</em></h2>
        <div class="case-grid">
          <article class="case">
            <button class="case-visual" type="button" data-video="main" aria-haspopup="dialog" aria-label="Watch InFlak Main video"><img src="${asset('co-creation-preview.webp')}" alt="A draggable book-cover layout next to the generated Friendship Garden cover" width="1000" height="650" loading="lazy"><span class="expand-icon">${icon('play')}</span></button>
            <div class="case-meta"><span class="eyebrow">Case study / 01</span><span class="case-tag blue">Text + image</span></div>
            <h3>From a story to its world.</h3><p>A writing brief becomes a story, then a book cover. Structured forms and a draggable layout board bring different kinds of human input into one connected creative process.</p>
            <button class="text-link" type="button" data-video="main" aria-haspopup="dialog">Watch InFlak Main ${icon('play')}</button>
          </article>
          <article class="case">
            <button class="case-visual" type="button" data-video="collage" aria-haspopup="dialog" aria-label="Watch SVG Collage Authoring video"><img src="${asset('collage-preview.webp')}" alt="Inflak's collage authoring interface with a visual composition and editable typography controls" width="1000" height="650" loading="lazy"><span class="expand-icon">${icon('play')}</span></button>
            <div class="case-meta"><span class="eyebrow">Case study / 02</span><span class="case-tag green">Persistent artifacts</span></div>
            <h3>Make. Refine. Make it yours.</h3><p>A collage evolves through theme selection, direct manipulation, and guided revision. Composable interaction flows work on the same artifact as the task unfolds.</p>
            <button class="text-link" type="button" data-video="collage" aria-haspopup="dialog">Watch SVG Collage Authoring ${icon('play')}</button>
          </article>
        </div>
      </div>
    </section>
  </main>
  <footer class="container site-footer"><a class="brand" href="#" aria-label="Back to top"><img src="${asset('inflak-logo.png')}" alt="Inflak" width="118" height="37" loading="lazy"></a><p>Human-agent interaction, orchestrated.</p><a class="text-link" href="#">Back to top ${icon('arrow-up-right')}</a></footer>
  <dialog class="figure-dialog" aria-labelledby="figure-title">
    <div class="dialog-header"><div><p class="eyebrow">Inflak / A closer look</p><h2 id="figure-title"></h2></div><button class="icon-button dialog-close" aria-label="Close figure" title="Close figure">${icon('x')}</button></div>
    <div class="figure-scroll" tabindex="0" role="region" aria-label="Figure detail"><img id="figure-image" alt=""></div>
    <div class="dialog-footer"><p id="figure-description"></p><button class="icon-button zoom-toggle" aria-label="Zoom in" title="Zoom in" aria-pressed="false">${icon('zoom-in')}</button><a class="text-link" href="${gallery}">Visit gallery ${icon('arrow-up-right')}</a></div>
  </dialog>
  <dialog class="video-dialog" aria-labelledby="video-title" aria-describedby="video-description">
    <div class="dialog-header"><div><p class="eyebrow">Inflak / Case recording</p><h2 id="video-title"></h2></div><button class="icon-button video-close" type="button" aria-label="Close video" title="Close video">${icon('x')}</button></div>
    <div class="video-stage"><video id="case-video" controls playsinline preload="none" aria-labelledby="video-title"></video></div>
    <p class="video-status" role="status" hidden></p>
    <div class="dialog-footer"><p id="video-description"></p><a class="text-link video-direct" target="_blank" rel="noopener noreferrer">Open video ${icon('arrow-up-right')}</a></div>
  </dialog>
`

const refreshIcons = () => createIcons({ icons: { ArrowUpRight, ArrowRight, ArrowLeft, ArrowDown, BookOpen, Menu, X, Maximize2, ZoomIn, ZoomOut, Play, Check, Minus, Folder, FileJson, Files } })
const viewport = document.querySelector<HTMLElement>('.examples-viewport')!
const carousel = EmblaCarousel(viewport, { loop: true, align: 'start', slidesToScroll: 1 })
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
const dots = [...document.querySelectorAll<HTMLButtonElement>('.carousel-dot')]
const carouselRegion = document.querySelector<HTMLElement>('.examples-carousel')!
function syncCarousel() {
  const selected = carousel.selectedScrollSnap()
  dots.forEach((dot, index) => dot.setAttribute('aria-current', String(index === selected)))
  const visibleSlides = carousel.slidesInView()
  carousel.slideNodes().forEach((slide, index) => { slide.inert = !visibleSlides.includes(index) })
  document.querySelector('.carousel-status')!.textContent = `${selected + 1} of ${examples.length}: ${examples[selected]!.title}`
}
document.querySelector('.carousel-previous')!.addEventListener('click', () => carousel.scrollPrev(reducedMotion.matches))
document.querySelector('.carousel-next')!.addEventListener('click', () => carousel.scrollNext(reducedMotion.matches))
dots.forEach((dot, index) => dot.addEventListener('click', () => carousel.scrollTo(index, reducedMotion.matches)))
carouselRegion.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') carousel.scrollPrev(reducedMotion.matches)
  else if (event.key === 'ArrowRight') carousel.scrollNext(reducedMotion.matches)
  else if (event.key === 'Home') carousel.scrollTo(0, reducedMotion.matches)
  else if (event.key === 'End') carousel.scrollTo(examples.length - 1, reducedMotion.matches)
  else return
  event.preventDefault()
})
carousel.on('select', syncCarousel).on('reInit', syncCarousel).on('slidesInView', syncCarousel)
syncCarousel()
import.meta.hot?.dispose(() => carousel.destroy())

const tabs = [...document.querySelectorAll<HTMLButtonElement>('.layer-tab')]
const panel = document.querySelector<HTMLDivElement>('#layer-panel')!
function selectLayer(index: number) {
  const layer = layers[index]!
  tabs.forEach((tab, tabIndex) => {
    tab.setAttribute('aria-selected', String(tabIndex === index))
    tab.tabIndex = tabIndex === index ? 0 : -1
  })
  panel.setAttribute('aria-labelledby', `layer-tab-${index}`)
  panel.innerHTML = `<p class="eyebrow">L${index + 1} / ${layer.name}</p><h3>${layer.question}</h3><p class="layer-description">${layer.description}</p><div class="contract"><div><span>Input</span><strong>${layer.input}</strong></div>${icon('arrow-down')}<div><span>Output</span><strong>${layer.output}</strong></div></div><p class="layer-example"><span>In practice</span>${layer.example}</p>`
  refreshIcons()
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectLayer(index))
  tab.addEventListener('keydown', (event) => {
    let next = index
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return
    event.preventDefault()
    selectLayer(next)
    tabs[next]!.focus()
  })
})
selectLayer(0)

const menu = document.querySelector<HTMLButtonElement>('.menu-toggle')!
const navigation = document.querySelector<HTMLElement>('#navigation')!
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false')
  menu.setAttribute('aria-label', 'Open navigation')
  menu.title = 'Open navigation'
  navigation.classList.remove('is-open')
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true'
  menu.setAttribute('aria-expanded', String(open))
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation')
  menu.title = open ? 'Close navigation' : 'Open navigation'
  navigation.classList.toggle('is-open', open)
})
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu))
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu()
    menu.focus()
  }
})
document.addEventListener('click', (event) => {
  if (event.target instanceof Node && !navigation.contains(event.target) && !menu.contains(event.target)) closeMenu()
})

const figures: Record<string, { title: string; image: string; description: string }> = {
  ...Object.fromEntries(examples.map((example) => [`example-${example.id}`, { title: example.title, image: `example-${example.id}.webp`, description: example.description }])),
  'co-creation': { title: 'Multimodal co-creation', image: 'gallery-main.webp', description: 'From a structured writing brief to a story, a visual direction, and a composed book cover.' },
  collage: { title: 'Iterative collage authoring', image: 'gallery-collage.webp', description: 'Initial creation, analysis and revision, and incremental refinement around one persistent artifact.' },
  walkthrough: { title: 'The orchestration flow', image: 'walkthrough.webp', description: 'Sketch-guided image generation through the interaction, execution, and completion pathways.' },
}
const dialog = document.querySelector<HTMLDialogElement>('.figure-dialog')!
const figureImage = document.querySelector<HTMLImageElement>('#figure-image')!
const zoom = document.querySelector<HTMLButtonElement>('.zoom-toggle')!
let opener: HTMLElement | null = null
function setZoom(zoomed: boolean) {
  dialog.classList.toggle('is-zoomed', zoomed)
  zoom.setAttribute('aria-pressed', String(zoomed))
  zoom.setAttribute('aria-label', zoomed ? 'Zoom out' : 'Zoom in')
  zoom.title = zoomed ? 'Zoom out' : 'Zoom in'
  zoom.innerHTML = icon(zoomed ? 'zoom-out' : 'zoom-in')
  refreshIcons()
}
document.querySelectorAll<HTMLButtonElement>('[data-figure]').forEach((button) => button.addEventListener('click', () => {
  const figure = figures[button.dataset.figure!]!
  opener = button
  document.querySelector('#figure-title')!.textContent = figure.title
  document.querySelector('#figure-description')!.textContent = figure.description
  figureImage.src = asset(figure.image)
  figureImage.alt = figure.description
  setZoom(false)
  dialog.showModal()
  document.body.classList.add('dialog-open')
  document.querySelector('.figure-scroll')!.scrollTo(0, 0)
}))
document.querySelector('.dialog-close')!.addEventListener('click', () => dialog.close())
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close()
  }
})
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open')
  opener?.focus()
})
zoom.addEventListener('click', () => setZoom(zoom.getAttribute('aria-pressed') !== 'true'))

const videoDialog = document.querySelector<HTMLDialogElement>('.video-dialog')!
const video = document.querySelector<HTMLVideoElement>('#case-video')!
const videoStatus = document.querySelector<HTMLParagraphElement>('.video-status')!
let videoOpener: HTMLButtonElement | null = null

function setVideoStatus(message: string) {
  videoStatus.textContent = message
  videoStatus.hidden = !message
}

document.querySelectorAll<HTMLButtonElement>('[data-video]').forEach((button) => button.addEventListener('click', () => {
  const recording = recordings[button.dataset.video as keyof typeof recordings]
  videoOpener = button
  document.querySelector('#video-title')!.textContent = recording.title
  document.querySelector('#video-description')!.textContent = recording.description
  document.querySelector<HTMLAnchorElement>('.video-direct')!.href = recording.url
  video.poster = asset(recording.poster)
  video.src = recording.url
  videoDialog.showModal()
  document.body.classList.add('dialog-open')
  setVideoStatus('Loading video...')
  void video.play().catch(() => {})
}))
video.addEventListener('canplay', () => { if (videoDialog.open) setVideoStatus('') })
video.addEventListener('playing', () => { if (videoDialog.open) setVideoStatus('') })
video.addEventListener('waiting', () => { if (videoDialog.open) setVideoStatus('Loading video...') })
video.addEventListener('error', () => {
  if (videoDialog.open && video.hasAttribute('src')) setVideoStatus('Video could not be loaded. The original recording is available via Open video.')
})
document.querySelector('.video-close')!.addEventListener('click', () => videoDialog.close())
videoDialog.addEventListener('click', (event) => {
  if (event.target === videoDialog) {
    const bounds = videoDialog.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) videoDialog.close()
  }
})
videoDialog.addEventListener('close', () => {
  video.pause()
  video.removeAttribute('src')
  video.removeAttribute('poster')
  video.load()
  setVideoStatus('')
  document.body.classList.remove('dialog-open')
  videoOpener?.focus()
})