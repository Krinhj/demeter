# Theming

Plug-and-play palette mapping so any project can inherit the vibe without rewriting components.

## Token Setup
- Define CSS variables (light theme example):
  - `--color-background`, `--color-foreground`, `--color-muted`, `--color-border`, `--color-card`
  - `--color-primary`, `--color-primary-foreground`
  - `--color-accent`, `--color-positive`, `--color-negative`, `--color-warning`
- Export tokens to Tailwind (`tailwind.config.{js,ts}` colors -> `var(--color-*)`).
- Set `--radius` for consistent rounding; default 12px works well for calm UIs.

## Palette Swaps
- When starting a new project, only swap variable values (or theme objects if using CSS-in-JS) and keep utilities untouched.
- Use a restrained palette: 1 primary, 1 accent, clear neutrals, and status colors that match the brand.
- Derive hover/active by lightening/darkening 6–10% rather than new hues.

## Typography
- Use an expressive sans (Space Grotesk or similar). Load via Next.js font utilities and assign to `font-sans`.
- Heading scale: `text-4xl/3xl/2xl` for hero, `text-xl` for section, `text-base` body, `text-sm` secondary. Adjust per density but keep hierarchy.

## Surfaces & Elevation
- Base surface: `background`; cards use `card` + `border` + `shadow-sm`. Overlays may use `shadow-lg` and slight blur.
- Keep borders subtle but present to define structure on light backgrounds.

## Applying Theme
- Auth: background gradient uses `background` as base; accent highlights from `primary`/`accent` on the visual panel.
- Landing: hero visuals pull `primary` for glow, `accent` for secondary shapes; text stays on `foreground`.
- Dashboard: charts/tables use `primary` (actual), `accent` (projection), `muted` (gridlines). Status chips use `positive/negative/warning`.

## Checklist
- [ ] Variables defined and mapped to Tailwind theme.
- [ ] Hover/active states derived, not ad-hoc hex values.
- [ ] Typography loaded and assigned once; no per-page font overrides.
- [ ] Status colors consistent across chips, charts, and toasts.
