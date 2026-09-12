import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/newsreader/500.css'
import '@fontsource/newsreader/500-italic.css'
import { createIcons, ArrowUpRight, ArrowRight, ArrowLeft, ArrowDown, BookOpen, Menu, X, Maximize2, ZoomIn, ZoomOut } from 'lucide'
import EmblaCarousel from 'embla-carousel'
import './homepage.css'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`
const gallery = 'https://inflak-orchestration.github.io/Inflak-gallery/'
const organization = 'https://github.com/Inflak-orchestration'
const icon = (name: string) => `<i data-lucide="${name === 'github' ? 'book-open' : name}" aria-hidden="true"></i>`
const examples = [
  { id: 'writing', title: 'Writing settings', description: 'A structured form captures the audience, tone, and constraints for a story.' },
  { id: 'story', title: 'Story refinement', description: 'An editable content list refines the story before generation.' },
  { id: 'layout', title: 'Book-cover layout', description: 'A draggable layout board arranges the title, garden, and characters.' },
  { id: 'cover', title: 'Generated book cover', description: 'The Friendship Garden cover, generated from the story and the arranged layout.' },
  { id: 'collage', title: 'Collage authoring', description: 'A persistent collage evolves through visual theme selection, typography editing, and direct manipulation.' },
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
      <a class="nav-github" href="${organization}">${icon('github')} GitHub</a>
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
          <span>From intent to interaction to artifact</span>
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
    <section class="practice-band" id="in-practice" aria-labelledby="practice-title">
      <div class="container section">
        <div class="section-heading"><p class="eyebrow">02 / In practice</p><a class="text-link" href="${gallery}">All 15 recorded cases ${icon('arrow-up-right')}</a></div>
        <h2 id="practice-title">Different tasks.<br><em>The same foundation.</em></h2>
        <div class="case-grid">
          <article class="case">
            <button class="case-visual" data-figure="co-creation" aria-label="Expand multimodal co-creation figure"><img src="${asset('co-creation-preview.webp')}" alt="A draggable book-cover layout next to the generated Friendship Garden cover" width="1000" height="650" loading="lazy"><span class="expand-icon">${icon('maximize-2')}</span></button>
            <div class="case-meta"><span class="eyebrow">Case study / 01</span><span class="case-tag blue">Text + image</span></div>
            <h3>From a story to its world.</h3><p>A writing brief becomes a story, then a book cover. Structured forms and a draggable layout board bring different kinds of human input into one connected creative process.</p>
            <button class="text-link" data-figure="co-creation">Explore multimodal co-creation ${icon('arrow-right')}</button>
          </article>
          <article class="case">
            <button class="case-visual" data-figure="collage" aria-label="Expand collage authoring figure"><img src="${asset('collage-preview.webp')}" alt="Inflak's collage authoring interface with a visual composition and editable typography controls" width="1000" height="650" loading="lazy"><span class="expand-icon">${icon('maximize-2')}</span></button>
            <div class="case-meta"><span class="eyebrow">Case study / 02</span><span class="case-tag green">Persistent artifacts</span></div>
            <h3>Make. Refine. Make it yours.</h3><p>A collage evolves through theme selection, direct manipulation, and guided revision. Composable interaction flows work on the same artifact as the task unfolds.</p>
            <button class="text-link" data-figure="collage">Explore collage authoring ${icon('arrow-right')}</button>
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
`

const refreshIcons = () => createIcons({ icons: { ArrowUpRight, ArrowRight, ArrowLeft, ArrowDown, BookOpen, Menu, X, Maximize2, ZoomIn, ZoomOut } })
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