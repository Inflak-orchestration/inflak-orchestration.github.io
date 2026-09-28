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
  overview: { title: 'Inflak overview', url: asset('inflak-overview.mp4'), poster: '', description: 'An overview of Inflak and human-agent interaction orchestration.' },
  main: { title: 'Multimodal Co-Creation', url: mainVideo, poster: 'co-creation-preview.webp', description: 'A connected workflow from story writing to book-cover design.' },
  collage: { title: 'SVG Collage Authoring', url: collageVideo, poster: 'collage-preview.webp', description: 'Create, edit, and refine a persistent SVG collage with Inflak.' },
}
const organization = 'https://github.com/Inflak-orchestration'
const sourceRepository = `${organization}/inflak-main`
const demoRepository = `${organization}/Inflak-demo`
const galleryCase = (caseId: string) => {
  const url = new URL(import.meta.env.VITE_GALLERY_URL || gallery)
  url.searchParams.set('case', caseId)
  return url.href
}
const paradigms = [
  { slug: 'user-driven-prompt-refinement', name: 'User-driven prompt refinement', description: 'Select parts of an image prompt to extend, steer, or restyle before generating the image.' },
  { slug: 'user-driven-prompt-organization', name: 'User-driven prompt organization', description: 'Organize traceable units from your own visual instruction into a confirmed prompt structure.' },
  { slug: 'interaction-as-part-of-instruction', name: 'Interaction as part of instruction', description: 'Draw a color-to-object layout sketch and confirm the spatial brief before image generation.' },
  { slug: 'referenced-artifact-as-instruction', name: 'Referenced artifact as instruction', description: 'Mark a region of an existing image, add an editing instruction, and review the generated edit.' },
  { slug: 'ai-driven-prompt-suggestion', name: 'AI-driven prompt suggestion', description: 'Explore narrative directions proposed from a seed idea, then confirm a prompt for writing.' },
  { slug: 'ai-driven-prompt-decomposition', name: 'AI-driven prompt decomposition', description: 'Organize and edit fine-grained prompt components on a canvas before generating a story.' },
  { slug: 'generative-prompt-control-widgets', name: 'Generative prompt control widgets', description: 'Adjust image-prompt priorities, composition, and preferences through embedded controls.' },
  { slug: 'generative-artifact-control-widgets', name: 'Generative artifact control widgets', description: 'Create and adjust a layered SVG collage with prepared assets and deterministic object controls.' },
  { slug: 'artifact-to-structured-instruction', name: 'Artifact to structured instruction', description: 'Ground an analysis request in a chart or table and generate an evidence-backed report.' },
  { slug: 'artifact-to-multimodal-instruction', name: 'Artifact to multimodal instruction', description: 'Analyze an SVG without an initial prompt, confirm object-grounded instructions, and apply the authorized changes.' },
  { slug: 'artifact-driven-prompt-enhancement', name: 'Artifact-driven prompt enhancement', description: 'Ground an existing prompt in SVG objects, approve concrete actions, and execute the confirmed enhancement.' },
  { slug: 'interactive-artifact-refinement', name: 'Interactive artifact refinement', description: 'Refine a layered SVG collage and commit confirmed changes as new artifact revisions.' },
  { slug: 'ai-proactively-initiated-interaction', name: 'AI-proactively-initiated interaction', description: 'Choose among context-grounded next actions, resolve implementation needs, and carry out the confirmed direction.' },
]
const paradigmDetails = [
  {
    caseId: 'inflak-pN1-image-prompt-iteration',
    input: 'An image idea or draft prompt', output: 'An image from the accepted prompt',
    layers: [
      'Keeps the evolving image prompt, selected keywords, and current acceptance. Any prompt edit invalidates earlier approval before generation.',
      'Identifies whether object extension, object steering, style, or prompt confirmation is unresolved. Prepares wording with the text model and invokes image generation only for the accepted prompt.',
      'Specifies a keyword grid with separate extension, steering, and style groups, or a prompt review with accept, refine, and manual-edit returns.',
      'Renders the keyword choices and editable prompt review in a sandbox. Sends the chosen words or exact reviewed prompt back to L1, without generating the image.',
    ],
  },
  {
    input: 'The user\'s visual instruction', output: 'An image or multi-panel storyboard',
    caseId: 'inflak-pN2-input-grounded-prompt-structure',
    layers: [
      'Preserves the original wording, exact source spans, user-owned groups, order, and locks. Tracks structure confirmation separately from instruction-preview approval.',
      'Starts with source organization rather than model rewriting. Requires a deterministic preview of the confirmed structure before image generation; no GenAI preparation precedes those confirmations.',
      'Defines the source-and-structure editor, starting extracted units in Unsorted. Specifies user-authored grouping, ordering, activation, and locking, plus a separate read-only instruction preview.',
      'Implements the editor and preview, preserving source text while the user manipulates traceable units. Returns the confirmed structure or preview decision to L1.',
    ],
  },
  {
    input: 'An image prompt and object-layout sketch', output: 'A sketch-grounded image',
    caseId: 'inflak-pN3-sketch-layout',
    layers: [
      'Tracks the prompt, color-to-object legend, actual sketch files, compiled spatial brief, and generated candidate. Keeps each confirmation bound to the current layout.',
      'Resolves missing object bindings or spatial intent before brief confirmation. Calls edit_image with the real sketch and full-canvas transparent mask only when the generation brief is ready.',
      'Defines the drawing interaction, color-to-object bindings, normalized strokes, spatial-brief confirmation, and subsequent candidate review.',
      'Realizes the sketch pad and review widgets. Exports the drawn sketch and same-sized transparent mask, then returns their references and user decisions to L1.',
    ],
  },
  {
    input: 'A source image, marked region, and edit request', output: 'An accepted locally edited image',
    caseId: 'inflak-pN4-image-inpainting',
    layers: [
      'Binds the original image to its marked scope, edit request, and new candidate. Tracks whether the user keeps the original, accepts the edit, or requests another revision.',
      'Requires an actual source image, explicit edit area, and replacement instruction. Calls edit_image with either normalized boxes or a source-sized brush mask, then routes the result back for review.',
      'Specifies one active scope mode, box or brush, and a source-versus-candidate comparison with accept, retain-original, or revise outcomes.',
      'Renders region marking and comparison. Brush mode uploads a mask with transparent edit pixels and opaque preserve pixels; the widget never executes the inpaint operation.',
    ],
  },
  {
    input: 'A seed idea for writing', output: 'Text from a writer-confirmed direction',
    caseId: 'inflak-pN5-writing-brainstorm',
    layers: [
      'Keeps the seed, proposed narrative directions, writer selections, focused prompt, and actual writing result. Suggestions remain optional until the writer adopts them.',
      'Uses bounded preparation to propose four to six distinct narrative strategies. Resolves the writer\'s choice and focused prompt before a separate final-writing pass.',
      'Defines direction selection around logline, narrative lens, form, tone, hook, and tradeoff, followed by the interaction needed to focus and confirm the chosen prompt.',
      'Presents the narrative alternatives and prompt review, capturing selected material and edits. Returns the writer\'s decisions without treating a proposal as authorization to write.',
    ],
  },
  {
    input: 'One or more source prompts', output: 'A story from an approved Story Brief',
    caseId: 'inflak-pN6',
    layers: [
      'Maintains source-prompt IDs, extracted components, user organization, and Story Brief approval. Preserves which source supports each character, event, relationship, or constraint.',
      'Separates model-driven decomposition from final story generation. Chooses a hierarchy or topical organization according to the material, then requires approval of the compiled Story Brief.',
      'Defines a prompt structure tree for containment and order, or a cell map for non-hierarchical topics. Specifies a separate traceable Story Brief review.',
      'Implements component editing and reorganization while retaining source references and user-added provenance. Returns the structure or brief decision; it does not write the final story.',
    ],
  },
  {
    input: 'An image prompt and semantic control choices', output: 'An image from a confirmed control specification',
    caseId: 'inflak-pN7-image-prompt-control',
    layers: [
      'Preserves the original prompt and accepted control specification: anchored entities, priority, composition, preferences, exclusions, and weights. Routes reported image mismatches back into control refinement.',
      'Analyzes controllable prompt units before selecting the next material adjustment. Keeps content decisions ahead of dependent roles or weights, and generates only after current compiled-prompt acceptance.',
      'Defines source-anchored inline controls, including independent frame-share sliders, separate preferred and avoided candidates, and attention settings that respect provider capabilities.',
      'Implements those inline controls and returns exact values without rebalancing frame shares or turning exclusions into positive prompts. Image generation remains a later execution step.',
    ],
  },
  {
    input: 'A collage brief or layered SVG', output: 'An edited, layered SVG collage',
    caseId: 'inflak-pN8',
    layers: [
      'Tracks the canonical collage revision, stable object IDs, prepared authoring bundle, and actual host commits. Prevents already-committed changes from being replayed.',
      'Plans real transparent cutouts, replacement candidates, presets, and text options before authoring. Delegates ready preparation to the collage executor and separates new generation requests from deterministic edits.',
      'Defines object controls backed by prepared options: transforms, ordering, typography, replacement, additions, and removal. Binds Apply, Add, and Remove to concrete authorized operations.',
      'Renders controls in the persistent Artifact Canvas. Uses host selection and reversible previews, returning decisions or actual commit results without generating assets on a control click.',
    ],
  },
  {
    input: 'A chart, visualization, or tabular dataset', output: 'An evidence-grounded structured report',
    caseId: 'inflak-pN9-chart-analysis-instruction',
    layers: [
      'Keeps source evidence immutable while tracking analysis preferences and report revisions. Separates observed values from uncertain labels, missing data, and user decisions.',
      'Identifies material ambiguity in evidence or analysis direction. Hands the confirmed task to the report-generation skill using the active host model; brief and composer interactions are optional, not mandatory gates.',
      'Specifies grounded analysis-direction choices and, when needed, brief customization or report composition. Makes source support and uncertainty explicit in the interaction contract.',
      'Renders conversational analysis controls and returns selections to L1. The host generates and persists the structured report; the Renderer does not invent data or author its conclusions.',
    ],
  },
  {
    input: 'An SVG artifact; no initial prompt required', output: 'Confirmed instructions and a validated SVG revision',
    caseId: 'inflak-pN10-svg-refinement-instruction',
    layers: [
      'Binds artifact-first analysis to a source revision and stable objects. Preserves suggestions, accepted or rejected decisions, typed instruction values, and resulting revision evidence.',
      'Prepares artifact-grounded suggestions, resolves their targets and operations, and plans execution only for the concretely confirmed instruction. The SVG instruction executor applies the authorized scope in separate passes.',
      'Defines object-anchored suggestion review, relationships, and operation editing as instruction values. Final confirmation authorizes only the displayed accepted or edited scope.',
      'Renders these instruction widgets on the persistent canvas while keeping the source read-only during review. Returns semantic choices, not immediate SVG patches.',
    ],
  },
  {
    input: 'An existing prompt and its SVG artifact', output: 'A grounded enhancement and validated SVG changes',
    caseId: 'inflak-pN11-svg-prompt-enhancement',
    layers: [
      'Preserves the exact original prompt, source revision, named concepts, ambiguous references, and action spans. Tracks target-bound approvals without resolving pronouns by proximity.',
      'Resolves each prompt reference against inspected objects and requires concrete operation parameters and constraints. Sends approved work to the prompt-refinement executor without an extra aggregate approval gate.',
      'Defines object-grounded clarification and action approval, linking each choice to its prompt span and actual target. Viewing, prefilling, or editing alone is not approval.',
      'Implements clarification and approval widgets on Artifact Canvas using host hit testing and placement. Returns instruction decisions, never directly authored artifact patches.',
    ],
  },
  {
    input: 'A refinement prompt and current SVG', output: 'An accepted new artifact revision',
    caseId: 'inflak-pN12-interactive-svg-refinement',
    layers: [
      'Tracks the exact prompt, current SVG, candidate identity, interaction binding, and committed revision. Merges real host commits without executing them a second time.',
      'Grounds intended targets in the scene and prepares a real preview. Selects a palette for color changes or a spatial board for composition, and authorizes execution only from current-revision Apply evidence.',
      'Defines task-specific controls and reversible preview semantics. Adjust and Reset remain transient; Regenerate, Reject, or Dismiss never authorize a patch.',
      'Implements artifact controls using authoritative host previews and layout drafts. Returns Apply or commit evidence for validation and acceptance; no augmented-instruction compilation or export is involved.',
    ],
  },
  {
    input: 'The current request and conversation context', output: 'Execution of a confirmed next action',
    caseId: 'inflak-pN13-proactive-intent-recommendation',
    layers: [
      'Separates explicit observations from inferred goals. Keeps the selected recommendation, implementation inputs, and actual execution outcome, rather than ending when a choice is clicked.',
      'Infers feasible next actions and offers two to five distinct possibilities, or one discriminating question when intent is unclear. Resolves implementation needs and executes the confirmed task with the active model within real capabilities.',
      'Defines an intention-choice widget with optional freeform input, or a task-grounded implementation widget for parameters, editable content, review, or spatial evidence.',
      'Renders concise conversational choices and selected implementation controls. Returns user intent without displaying a ranking dossier, silently switching plugins, or executing an unconfirmed recommendation.',
    ],
  },
]
const demoPlugins = [
  {
    id: 'main', name: 'Multimodal Co-Creation', category: 'Text + image',
    caseId: 'inflak-main',
    description: 'Write a story, shape its visual direction, and create the cover in one connected conversation. Task-specific interactions keep your intent and artifacts in context.',
    input: 'A writing or image brief', output: 'Text and image artifacts', directory: 'inflak-main',
    layers: [
      'Reconstructs intent, artifacts, and previous returns. Routes to writing, revision, prompt enhancement, image generation, or image editing.',
      'One of five task planners identifies the next unresolved choice, such as audience or composition. Selects a suitable widget, or directly invokes the model or image tool when ready.',
      'One of six widget-design skills defines the selected form, selector, editor, canvas, or parameter controls: what to show, what the user can change, and what to return.',
      'Implements that contract as a sandboxed widget and returns the submitted values to the Router. It does not write the story or generate the image.',
    ],
  },
  {
    id: 'collage', name: 'Collage Authoring', category: 'Persistent artifacts',
    caseId: 'inflak-svg-authoring',
    description: 'Create an SVG composition, inspect its objects, and refine it through direct manipulation and guided revision. Each step builds on the same evolving artifact.',
    input: 'A composition brief or SVG', output: 'A revised SVG composition', directory: 'inflak-collage-authoring',
    layers: [
      'Tracks the canonical SVG, its revision, and stable object IDs. Routes creation, artifact analysis, prompt grounding, or refinement without losing earlier decisions.',
      'Determines which material choice or object-level intent remains unresolved. Selects an interaction, or hands a ready, authorized plan to the collage execution skill.',
      'Designs the selected artifact-grounded interaction: object references, editable properties, proposals, and the precise meaning of an Apply or review decision.',
      'Renders the interaction in the persistent Artifact Canvas. The host manages previews and atomic commits; the Renderer returns interaction results without executing image tools.',
    ],
  },
  {
    id: 'paradigms', name: 'Interaction Paradigms', category: '13 focused plugins',
    caseId: paradigmDetails[2]!.caseId,
    description: 'Explore thirteen independent plugins, from organizing a prompt to refining an artifact and reviewing proactive suggestions. Each supplies its own task-specific four-layer skills.',
    input: paradigmDetails[2]!.input, output: paradigmDetails[2]!.output, directory: '',
    layers: paradigmDetails[2]!.layers,
  },
  {
    id: 'author', name: 'Inflak Authoring', category: 'Plugin authoring',
    caseId: '',
    description: 'Describe the human-agent collaboration you need. Develop a four-layer plugin through conversation, preview its interactions, and validate it before publication.',
    input: 'A collaboration description', output: 'A validated plugin package', directory: 'inflak-author',
    layers: [
      'Reconstructs the current authoring revision and merges approved design decisions. Tracks the workflow, generated build, and exact preview approved for publication.',
      'Resolves one authoring gap at a time: task framing, a workflow stage, artifact flow, or interaction design. Once ready, selects an executor for building, validation, or publication.',
      'Uses eight Author-specific design skills to specify framing boards, workflow reviews, artifact-flow maps, interaction previews, resource intake, and build reviews.',
      'Renders those review interfaces and returns the author\'s decisions unchanged to the Router. Compilation and publication run through the execution skill, not the Renderer.',
    ],
  },
]
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
      <a href="#demo">Demo &amp; Plugins</a>
      <a class="nav-github" href="${organization}">${icon('github')} GitHub</a>
    </nav>
    <button class="icon-button menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="navigation" title="Open navigation">${icon('menu')}</button>
  </header>
  <main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-content">
        <h1 id="hero-title">Inflak<span class="title-period">.</span></h1>
        <p class="hero-subtitle">Human-agent interaction,<br><em>orchestrated.</em></p>
        <p class="hero-description">A unified architecture for agents that work with people.</p>
        <div class="hero-actions"><a class="button button-primary" href="${gallery}">Explore the gallery ${icon('arrow-up-right')}</a><a class="button button-primary" href="#demo">Explore the demo ${icon('arrow-down')}</a></div>
        <button class="text-link hero-overview" type="button" data-video="overview" aria-haspopup="dialog">${icon('play')} Watch overview</button>
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
          <div><h2 id="implementation-title">Multimodal Co-Creation</h2><p class="implementation-subtitle">The architecture, packaged as skills.</p></div>
          <div class="implementation-summary"><p>A co-creation plugin with five task planners and six reusable widget designs. One Router coordinates the task; one Renderer realizes the selected interaction.</p><a class="text-link" href="${sourceRepository}">View Multimodal Co-Creation on GitHub ${icon('arrow-up-right')}</a></div>
        </div>
        <div class="implementation-map-heading"><h3>Different tasks, shared widgets.</h3><span>5 planners / 6 widget designs</span></div>
        <div class="compatibility-scroll" tabindex="0" role="region" aria-label="Planner and widget compatibility">
          <table class="compatibility-table">
            <caption class="implementation-sr-only">Registered widget compatibility for the five Multimodal Co-Creation task planners</caption>
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
        <p class="implementation-host"><strong>Inside a compatible agent host.</strong> The host provides the model, registered tools, sandboxed rendering, and widget-return bridge. Multimodal Co-Creation supplies the orchestration skills, not a standalone agent application.</p>
      </div>
    </section>
    <section class="practice-band" id="in-practice" aria-labelledby="practice-title">
      <div class="container section">
        <div class="section-heading"><p class="eyebrow">03 / In practice</p><a class="text-link" href="${gallery}">All 15 recorded cases ${icon('arrow-up-right')}</a></div>
        <h2 id="practice-title">Different tasks.<br><em>The same foundation.</em></h2>
        <div class="case-grid">
          <article class="case">
            <button class="case-visual" type="button" data-video="main" aria-haspopup="dialog" aria-label="Watch Multimodal Co-Creation video"><img src="${asset('co-creation-preview.webp')}" alt="A draggable book-cover layout next to the generated Friendship Garden cover" width="1000" height="650" loading="lazy"><span class="expand-icon">${icon('play')}</span></button>
            <div class="case-meta"><span class="eyebrow">Case study / 01</span><span class="case-tag blue">Text + image</span></div>
            <h3>From a story to its world.</h3><p>A writing brief becomes a story, then a book cover. Structured forms and a draggable layout board bring different kinds of human input into one connected creative process.</p>
            <button class="text-link" type="button" data-video="main" aria-haspopup="dialog">Watch Multimodal Co-Creation ${icon('play')}</button>
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
    <section class="demo-band" id="demo" aria-labelledby="demo-title">
      <div class="container section">
        <div class="section-heading"><p class="eyebrow">04 / Demo &amp; Plugins</p><span class="section-note">One workspace. Different ways to collaborate.</span></div>
        <div class="demo-intro">
          <h2 id="demo-title">Inflak Demo</h2>
          <div><p>A runnable workspace for exploring Inflak plugins, bringing conversation, interactive widgets, and artifacts into one agent interface.</p><div class="demo-actions"><a class="button button-primary" href="${demoRepository}#install-on-another-machine">Run locally ${icon('arrow-up-right')}</a><a class="text-link" href="${demoRepository}">View source ${icon('arrow-up-right')}</a></div></div>
        </div>
        <div class="demo-facts"><span><strong>17</strong> registered plugins</span><span><strong>13</strong> interaction paradigms</span><span>Copilot SDK host + web interface</span></div>
        <div class="plugin-layout">
          <div class="plugin-tabs" role="tablist" aria-label="Demo plugins" aria-orientation="vertical">${demoPlugins.map((plugin, index) => `<button class="plugin-tab" id="plugin-tab-${plugin.id}" role="tab" aria-selected="${index === 0}" aria-controls="plugin-panel-${plugin.id}" tabindex="${index === 0 ? 0 : -1}" data-plugin="${index}"><span class="plugin-number">0${index + 1}</span><span><strong>${plugin.name}</strong><small>${plugin.category}</small></span>${icon('arrow-right')}</button>`).join('')}</div>
          <div class="plugin-panels">${demoPlugins.map((plugin, index) => `<div class="plugin-panel" id="plugin-panel-${plugin.id}" role="tabpanel" aria-labelledby="plugin-tab-${plugin.id}" tabindex="0" ${index === 0 ? '' : 'hidden'}>
            <p class="eyebrow">${plugin.category}</p><h3>${plugin.name}</h3><p class="plugin-description">${plugin.description}</p>
            ${plugin.id === 'paradigms' ? `<div class="paradigm-picker"><label for="paradigm-select">Interaction paradigm</label><select id="paradigm-select">${paradigms.map((paradigm, paradigmIndex) => `<option value="${paradigmIndex}" ${paradigmIndex === 2 ? 'selected' : ''}>P${paradigmIndex + 1} / ${paradigm.name}</option>`).join('')}</select><p id="paradigm-description" aria-live="polite">${paradigms[2]!.description}</p><a class="text-link" id="paradigm-source" href="${demoRepository}/tree/main/plugins/inflak-pN3-${paradigms[2]!.slug}">View P3 source ${icon('arrow-up-right')}</a></div>` : ''}
            <dl class="plugin-layers" aria-label="Four-layer skill responsibilities">${plugin.layers.map((description, layerIndex) => `<div><dt><span>L${layerIndex + 1}</span>${layers[layerIndex]!.name}</dt><dd>${description}</dd></div>`).join('')}</dl>
            <div class="contract"><div><span>Input</span><strong>${plugin.input}</strong></div>${icon('arrow-down')}<div><span>Output</span><strong>${plugin.output}</strong></div></div>
            <div class="plugin-links">${plugin.directory ? `<a class="text-link" href="${demoRepository}/tree/main/plugins/${plugin.directory}">View plugin source ${icon('arrow-up-right')}</a>` : ''}${plugin.caseId ? `<a class="text-link" ${plugin.id === 'paradigms' ? 'id="paradigm-case"' : ''} href="${galleryCase(plugin.caseId)}">View gallery case ${icon('arrow-up-right')}</a>` : ''}</div>
            ${plugin.id === 'author' ? `<section class="author-example" aria-labelledby="author-example-title"><p class="eyebrow">Created with Inflak Authoring</p><h4 id="author-example-title">Daily Paper Conclusion</h4><p>An Author-generated plugin that turns recent public arXiv cs.HC papers into an evidence-linked daily digest.</p><dl class="plugin-layers"><div><dt><span>L1</span>Router</dt><dd>Tracks paper scope, source evidence, digest revisions, and acceptance. Changed scope or evidence invalidates dependent conclusions.</dd></div><div><dt><span>L2</span>Planner</dt><dd>Checks collection, paper evidence, and synthesis dependencies. Uses the active host model for collection and writing, and requests human judgment where evidence or direction remains unresolved.</dd></div><div><dt><span>L3</span>Designer</dt><dd>Defines five interactions: scope setup, collection review, paper inspection, synthesis direction, and digest acceptance.</dd></div><div><dt><span>L4</span>Renderer</dt><dd>Implements those review contracts and returns decisions to L1. It does not invent papers, write conclusions, or treat export as acceptance.</dd></div></dl><a class="text-link" href="${demoRepository}/tree/main/plugins/inflak-daily-paper-conclusion">View generated plugin ${icon('arrow-up-right')}</a></section>` : ''}
          </div>`).join('')}</div>
        </div>
        <p class="demo-requirements"><strong>Run on your machine.</strong> Requires Python 3.11+, Node.js 18+, and GitHub CLI authenticated with a Copilot-enabled account. Image generation also requires a configured image provider.</p>
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
    <div class="dialog-header"><div><p class="eyebrow">Inflak / Recording</p><h2 id="video-title"></h2></div><button class="icon-button video-close" type="button" aria-label="Close video" title="Close video">${icon('x')}</button></div>
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

const pluginTabs = [...document.querySelectorAll<HTMLButtonElement>('.plugin-tab')]
function selectPlugin(index: number) {
  pluginTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index
    tab.setAttribute('aria-selected', String(selected))
    tab.tabIndex = selected ? 0 : -1
    document.getElementById(tab.getAttribute('aria-controls')!)!.hidden = !selected
  })
}
pluginTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectPlugin(index))
  tab.addEventListener('keydown', (event) => {
    let next = index
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % pluginTabs.length
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + pluginTabs.length) % pluginTabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = pluginTabs.length - 1
    else return
    event.preventDefault()
    selectPlugin(next)
    pluginTabs[next]!.focus()
  })
})
document.querySelector<HTMLSelectElement>('#paradigm-select')!.addEventListener('change', (event) => {
  const index = Number((event.currentTarget as HTMLSelectElement).value)
  const paradigm = paradigms[index]!
  document.querySelector('#paradigm-description')!.textContent = paradigm.description
  const link = document.querySelector<HTMLAnchorElement>('#paradigm-source')!
  link.href = `${demoRepository}/tree/main/plugins/inflak-pN${index + 1}-${paradigm.slug}`
  link.innerHTML = `View P${index + 1} source ${icon('arrow-up-right')}`
  const details = paradigmDetails[index]!
  document.querySelector<HTMLAnchorElement>('#paradigm-case')!.href = galleryCase(details.caseId)
  document.querySelectorAll('#plugin-panel-paradigms > .plugin-layers dd').forEach((element, layerIndex) => {
    element.textContent = details.layers[layerIndex]!
  })
  const values = document.querySelectorAll('#plugin-panel-paradigms > .contract strong')
  values[0]!.textContent = details.input
  values[1]!.textContent = details.output
  refreshIcons()
})

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
  if (recording.poster) video.poster = asset(recording.poster)
  else video.removeAttribute('poster')
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