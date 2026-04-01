# The Bleich Files — MB2T

A static investigative journalism site documenting public regulatory enforcement actions, court filings, and SEC/FINRA records related to Michael E. Bleich and associated entities.

## Structure

- `index.html` — Main investigation page (hero, red flags, timeline, money trail)
- `sources.html` — Source Vault cataloguing all 11 primary sources
- `styles.css` — All styling, organized by section with CSS custom properties as design tokens
- `scripts.js` — Hamburger menu, ticker pause/play, source filter, load animations

## Deployment

Static site — no build step required. Serve from any static host (GitHub Pages, Netlify, Vercel).

```
# Local preview
npx serve .
```

## Design Tokens

All colors, fonts, shadows, and spacing are defined as CSS custom properties in `:root` at the top of `styles.css`. Key tokens: `--ink`, `--newsprint`, `--red`, `--gold`, `--font-display`, `--font-mono`, `--font-label`.

## Accessibility

- Skip-link on `index.html`
- ARIA roles and labels on all navigation and landmark regions
- `aria-expanded` on hamburger toggle
- `prefers-reduced-motion` support for ticker animation
- Pause/play control on the ticker (WCAG 2.2.2)

## Sources

All factual claims are anchored to primary public records documented in `sources.html`. Single-source claims are flagged throughout.
