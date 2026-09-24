# Inflak Homepage

A standalone homepage for Inflak, a four-layer architecture for human-agent interaction orchestration. Built with Vite, TypeScript, and locally bundled fonts and icons. No backend or API keys are required.

## Development

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

## Verification

```sh
npx playwright install chromium
npm test
npm run build
npm run preview
```

The browser suite covers desktop/mobile rendering, asset loading, navigation, keyboard-operated architecture tabs, carousel arrows/dots/keyboard/dragging and uniform image proportions, figure zoom and dismissal, focus restoration, horizontal overflow, and WCAG accessibility checks.

## Deployment

The main site is intended for <https://inflak-orchestration.github.io/>. Publish it from the `Inflak-orchestration/inflak-orchestration.github.io` repository to use that root URL. The gallery remains at <https://inflak-orchestration.github.io/Inflak-gallery/>; its header links back to the root homepage and `/#architecture`.

The production output is `dist/`. Relative asset paths support a domain root or a GitHub Pages repository subpath. A GitHub Actions workflow tests, builds, and deploys pushes to `main`. In the hosting repository, select **Settings > Pages > Source > GitHub Actions**. Pull requests run verification without deploying.

No GitHub repository is created and nothing is published by running this project locally.

## Content and Assets

- Visual reference and original logo: [Inflak-gallery](https://github.com/Inflak-orchestration/Inflak-gallery).
- Fonts: Newsreader and DM Sans, distributed locally through Fontsource. Icons: Lucide.
- The example carousel uses Embla with looping, dragging/swiping, arrow controls, and position dots. Images share 4:3 frames with contained artwork; there is no autoplay, stretching, or content cropping. Selecting an image opens the figure viewer.
- Carousel examples showcase five distinct widget types from the supplied gallery overview: keyword grid, block composer, sketch canvas, embedded selectors, and object controls. The two case-study videos remain separate from this widget showcase.
- The hero's **Watch overview** button opens `public/assets/inflak-overview.mp4` in the in-page video viewer. This 3:38 recording was remuxed from the supplied `inflak.mov` without re-encoding its H.264 video or AAC audio. The fast-start MP4 is about 77 MB and is requested only after opening the viewer. The original MOV is not included or modified.
- Figure and content source: the supplied `ACM_CHI_2027___Gao_et_al__Inflak.zip`, specifically the abstract, architecture, gallery sections, and `gallery_main.pdf`, `gallery_collage.pdf`, and `walkthrough_case.pdf` figures.
- Optimized assets in `public/assets/` are self-contained. Full figures remain available through the zoomable viewer; case previews and the hero use focused selections of the same interfaces.
- The asset script accepts PNG renderings named `gallery_main.png`, `gallery_collage.png`, `walkthrough_case.png`, and `gallery_overview_3x4.png`, plus the gallery logo. An optional third argument supplies a higher-resolution rendering of `figures/gallery_overview_3x4.pdf` for the widget crops:

```sh
node scripts/prepare-assets.mjs /path/to/rendered-figures /path/to/inflak-logo.png /path/to/high-resolution-gallery-overview.png
```

To regenerate the overview MP4 on macOS, run this from the project root with a fresh output path:

```sh
avconvert --source /path/to/inflak.mov --preset PresetPassthrough --output public/assets/inflak-overview.mp4
```

Homepage content and interaction behavior live in `src/homepage.ts`; design tokens and responsive rules are in `src/homepage.css`. Gallery and GitHub destinations are defined at the top of the TypeScript file. No paper download, publication venue, author attribution, or installation command is invented from the draft manuscript.