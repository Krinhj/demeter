# UI Style Guide (Reusable)

Portable guidance for typography, color tokens, layout, and interaction. Plug in your palette and keep the rules.

## Principles
- Clarity over flourish; calm base with focused highlights.
- Expressive but readable type (Space Grotesk or similar); consistent spacing.
- Token-driven colors; avoid hardcoded hexes in components.

## Typography
- Primary font: expressive sans loaded via framework font utilities, assigned to `font-sans`.
- Hierarchy: display `text-3xl md:text-4xl font-semibold`, section `text-xl font-medium`, body `text-base text-foreground/90`, secondary `text-sm text-muted`.
- Maintain comfortable leading (`leading-6`+); uppercase only for chips/badges.

## Color Tokens (define in CSS vars)
- `background`, `foreground`, `muted`, `border`, `card`
- `primary`, `primary-foreground`, `accent`
- `positive`, `negative`, `warning`
- Usage: primary for CTAs/active nav (not destructive). Status colors for chips/charts/toasts.

## Elevation & Radii
- Global radius `--radius: 12px` (rounded-xl). Inputs `rounded-lg`, pills `rounded-full`.
- Shadows: base `shadow-sm` for cards; overlays `shadow-lg`. Prefer border + light shadow.

## Layout Patterns
- Shell: sidebar or topbar layouts inherit spacing from `spacing-guidelines.md`; keep charts/tables full width with responsive wrapping.
- Cards align via `grid gap-6 sm:grid-cols-2 xl:grid-cols-3`; prioritize key cards above the fold.
- Sticky filters/bars can use `backdrop-blur` + `border-b border-border/80`.

## Components
- **Buttons:** primary `bg-primary text-primary-foreground`, secondary `border border-border bg-transparent text-foreground`, destructive `bg-negative text-white`.
- **Inputs:** shadcn input with `rounded-lg border-border focus:ring-primary focus:border-primary`.
- **Badges/Chips:** `bg-primary/10 text-primary` or status-based.
- **Tables:** `text-sm`, zebra stripes via background utilities, amounts right-aligned with `tabular-nums`.

## States & Interaction
- Hover shifts ~8% lighter/darker; focus rings `ring-2 ring-offset-2 ring-primary`.
- Loading uses primary-colored indicators; success/error toasts use status tokens.
- Disabled uses opacity but keeps contrast for readability.

## Icons & Illustration
- Use a consistent icon set (e.g., Lucide). Sizes: 16 inline, 20 buttons, 32 stat cards.
- Illustration minimal; lean on UI mock snippets over stock art.

## Accessibility Checklist
- 4.5:1 contrast for text vs background.
- Provide textual summaries for charts.
- Semantic HTML, predictable tab order, keyboard operable components.
- Verify focus states at all breakpoints.
