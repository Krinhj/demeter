# Project Vibe (Demeter)

> Keep this file in `docs/project-vibe.md` (outside `docs/vibe-coding-playbook/`) so the playbook folder can be copied without edits. Duplicate it per project if needed.

## Project Snapshot
- **Name:** Demeter
- **Logo asset:** None (text-based branding, Lucide icons for UI)
- **Typeface:** Space Grotesk (fallbacks: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)
- **Shadcn version/date:** New York style, RSC enabled, installed December 2024

## Palette Tokens
- `--color-background`: #f8fcfb (cool off-white with green tint)
- `--color-foreground`: #0a1f1a (deep teal-black)
- `--color-muted`: #4a6b63 (muted teal for secondary text)
- `--color-border`: #d4e8e3 (soft seafoam)
- `--color-card`: #ffffff (pure white)
- `--color-primary`: #0d9488 (Teal 600 – main brand color)
- `--color-primary-foreground`: #ccfbf1 (light mint)
- `--color-accent`: #14b8a6 (Teal 500 – vibrant accent)
- `--color-positive`: #16a34a (green for on-track/success)
- `--color-negative`: #dc2626 (red for over-budget/alerts)
- `--color-warning`: #f59e0b (amber for approaching limits)
- `--color-protein`: #8b5cf6 (violet for protein indicators)
- `--color-carbs`: #f97316 (orange for carbs indicators)
- `--color-fat`: #eab308 (yellow for fat indicators)
- Hover/active offsets: Lighten/darken by ~8%

### Dark Mode Overrides
- `--color-background`: #030f0d
- `--color-foreground`: #ecfdf5
- `--color-card`: #071a16
- `--color-border`: #134e45
- `--color-muted`: #99b8b0

## Typography Scale
- Headline sizes: `text-3xl md:text-4xl font-semibold tracking-tight` (dashboard), `text-xl font-medium` (sections)
- Body/base: `text-base text-foreground/90`
- Secondary: `text-sm text-muted`
- Tracking/leading rules: `leading-6` or higher for paragraphs; uppercase only for badges/chips

## Spacing & Radii
- Base unit: 4px; key gaps use 8px multiples (8, 16, 24, 32, 40). See `docs/spacing-guidelines.md`.
- Radius: 12px (`--radius-base`, `rounded-xl`). Inputs: `rounded-lg`. Pills: `rounded-full`.
- Elevation defaults: `shadow-sm` for cards, `shadow-lg` for overlays/dialogs.

## Components Installed (shadcn)
- Layout: card, scroll-area, separator, resizable, sidebar
- Forms: form, input, select, switch, textarea
- Feedback/overlays: dialog, alert-dialog, sheet, tooltip, skeleton, progress, badge, avatar, chart
- Navigation: button, dropdown-menu, tabs, table

## Background & Motion Choices
- **Landing hero:** N/A (no landing page; direct to auth)
- **Auth visual panel:** Gradient background with organic shapes (leaf/wave motifs), slow keyframes (6-12s), opacity < 0.35; visual on left, form on right.
- **Dashboard:** Motion policy: skeletons for loading states, light fades on card entry; background plain with `--color-background`.
- `prefers-reduced-motion` handling: Fall back to static gradients/noise; disable floating animations.

## Layout Selections
- **Auth:** Two-column breakpoint `lg`; form width ~420px; visual panel with centered tagline.
- **Landing:** N/A (auth-first flow).
- **Dashboard:** Shell grid `grid-cols-[260px_minmax(0,1fr)]`; sidebar width 260px; full-bleed fix applied (yes, per `docs/fullbleed-layout.md`). Page padding: `px-6 lg:px-10 py-8`.

## Assets
- Icons: Lucide (via lucide-react). Sizes: 16px (inline), 20px (buttons), 32px (stat cards).
- Illustration/texture sources: Minimal; line icons for empty states only.
- Suggested icons: Utensils, ChefHat, Salad, Apple, ShoppingCart, Calendar, Target, Flame (calories), Beef (protein)

## Content Tone
- Voice guidelines: Fresh, encouraging, goal-oriented single-owner direct speech ("Plan your week", "Hit your protein target").
- Microcopy rules for empty states/tooltips: Short, actionable, no jargon. Speak to the owner directly. Use food/cooking metaphors sparingly.

## Domain-Specific UI Patterns

### Macro Display
- Use stacked horizontal bars or pill badges for protein/carbs/fat
- Color-code macros consistently: protein (violet), carbs (orange), fat (yellow)
- Show percentages alongside grams for context

### Recipe Cards
- Thumbnail placeholder with gradient or icon
- Macro summary as compact badge row
- Serving count and prep time visible at glance

### Meal Plan Grid
- 7-column week view on desktop, vertical stack on mobile
- Meals grouped by type (breakfast, lunch, dinner, snacks)
- Drag-to-swap for meal rearrangement (future)

### Grocery List
- Grouped by category (produce, protein, dairy, pantry)
- Checkbox interaction for shopping mode
- Aggregate quantities with unit normalization

## AI Integration Points
- Recipe paste → structured data (loading state with skeleton)
- Meal plan generation → streaming updates with progress indicator
- Nutrition lookup → inline micro-loaders per ingredient

## QA Checklist
- [ ] Tokens mapped to Tailwind (`var(--color-*)`).
- [ ] Shadcn components installed via CLI (list above). No custom clones for existing shadcn parts.
- [ ] Full-bleed dashboard verified; no hidden sidebar rails.
- [ ] Spacing matches `docs/spacing-guidelines.md`; style aligns with `docs/style-guide.md` and `docs/frontend-best-practices.md`.
- [ ] Motion respects `prefers-reduced-motion`; contrast >= 4.5:1 for text.
- [ ] Macro colors distinguishable for colorblind users (check with simulator).
