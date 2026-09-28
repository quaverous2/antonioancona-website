# Antonio Ancona — Portfolio

An original personal portfolio designed to communicate Antonio Ancona’s professional profile, selected work, technical range, and contact details. 
The architecture goal is  a restrained, editorial single-page experience with a persistent identity/navigation area and a chronological work index. 

## Product direction

- Keep the experience focused: clear identity, concise navigation, selected projects, profile, and contact routes.
- Use a responsive two-column layout on larger screens: a persistent left rail for identity and navigation, and a main content region for the work index and content sections. Collapse gracefully to a conventional mobile flow.
- Make every project entry useful to a recruiter: title, short context, role, technology, outcome, relevant links, and accessible media where appropriate.
- Treat motion and visual effects as enhancements, never requirements for reading, navigation, or contacting Antonio.

## Technical approach

This is a static site: its production output must be ordinary HTML, CSS, JavaScript, and assets that can be copied directly to a web server. It requires no production Node.js process, database, CMS, or application server.

- **HTML5** for semantic, accessible content and metadata.
- **CSS3** for the responsive layout, design tokens/custom properties, themes, and basic transitions.
- **Vanilla JavaScript (ES modules)** for the small amount of application behavior: theme persistence, navigation state, progressive enhancement, and fallbacks. A client-side framework is not necessary at this scale.
- **GSAP** for deliberate animation sequences and refined interaction motion.
- **three.js** for one original, self-contained WebGL/canvas background effect (for example, abstract particles, flowing noise, or a distorted gradient).
- **Tweakpane**, development-only, for tuning the WebGL effect’s colors, speed, density, and responsive parameters. It must not be included in the production experience.

The background effect is optional enhancement. When WebGL is unsupported, JavaScript fails, or the visitor requests reduced motion, the site must retain a lightweight static CSS gradient/noise background and remain fully usable.

### Dependency and deployment workflow

“Static site” describes the deployed output, not the local authoring environment. Node.js and npm are used only on a development machine to install and bundle the small set of browser dependencies; they are never required by the web server.

```powershell
npm init -y
npm install three gsap
npm install --save-dev vite tweakpane
```

- `three` and `gsap` are production browser dependencies and are bundled into the built static assets.
- `tweakpane` is a development dependency used to tune visual parameters locally; it is excluded from the production experience.
- `vite` provides a local development server and creates the optimized static output. It is not a production runtime.

The project should expose these package scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Use `npm run dev` while working locally and `npm run build` before deployment. The resulting `dist/` directory is the only artifact uploaded to the web server.

```text
source files + npm packages → npm run build → dist/ static files → web server
```

## Expected technical features

### Portfolio essentials

- A professional "home" section with a short value proposition and up-to-date role information.
- "Project" section with individual project details and external links clearly identified.
- Skills section describing technologies and capabilities without inflated claims.
- Contact section with resilient email and social links; a form only when it has real validation, clear feedback, spam protection, and a working delivery path.
- Downloadable CV section.

### Engineering quality

- Semantic HTML, keyboard-operable navigation, visible focus states, meaningful headings, alt text, and form labels.
- Responsive layouts tested at mobile, tablet, and desktop widths; no hover-only controls or critical information hidden behind animation.
- Respect `prefers-reduced-motion`; preserve usable contrast in both light and dark themes if themes are offered.
- Fast loading: optimized responsive images, explicit image dimensions, lazy-loaded noncritical media, font fallbacks, and no unnecessary client-side dependencies.
- Clean structure with reusable components/styles, content separated from presentation where practical, linting/formatting, and documented local run/build commands.
- Graceful degradation when JavaScript, WebGL, or external embeds fail. Any canvas/WebGL background must have a static, lightweight fallback.

### Professional signals for CV review

- Correct page title, description, canonical URL, Open Graph/Twitter preview metadata, favicon, and a share image.
- Search-engine basics: `robots.txt`, `sitemap.xml`, descriptive URLs, and structured data for a `Person`/portfolio where appropriate.
- Security-minded deployment: HTTPS, no exposed keys, dependency updates, sensible security headers, and a privacy-conscious analytics approach (or no analytics).
- Automated checks appropriate to the chosen stack: production build, lint/type checks, and an accessibility/performance audit before deployment.
- Cross-browser verification for current Chromium, Firefox, and Safari, plus manual keyboard and screen-reader spot checks.

## Legacy site

The previous static site is retained in [`old/`](./old/) as reference material during the rebuild. It is not the intended production implementation.
