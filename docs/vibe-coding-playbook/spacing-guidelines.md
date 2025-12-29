# Spacing Guidelines

Lightweight spacing system for clean, legible UIs. Keep it token-driven so it can travel between projects.

## Scale
- Base unit 4px; structure favors 8px multiples (8, 16, 24, 32, 40).
- Use 4px only for micro-adjustments (icon alignment). Document any intentional deviations.

## Layout Containers
- **Dashboard shells:** `px-6 py-6` on mobile, `px-10 py-8` from `md` upward; padding lives on the layout so pages inherit it.
- **Sections:** wrap cards/blocks in flex/grid with `gap-6`. Add extra margin only when separating from sticky elements (e.g., filters).
- **Full-width banners:** drop horizontal padding inside the card (`px-0`), keep `py-4` internally so the banner aligns with gutters.

## Cards and Surfaces
- Default: `rounded-xl border bg-card p-6`. Inside padded containers, drop outer padding and move spacing to children.
- Suggested slots: Header `pb-4`, Content `space-y-4`, Footer `pt-4`. Prefer `gap`/`space-y` over stacked margins.
- Tables: combine outer `p-0` with inner `px-4 py-3` for row padding.

## Stacks, Lists, Forms
- Use `gap` for inline controls/filters (`flex flex-wrap gap-3`). Avoid ad-hoc margins between controls.
- Inline form controls share height; use `gap-4` between them.
- Rows (e.g., list items) keep consistent `py-3` and `gap-3` between icon/text/value.

## Buttons, Icons, Badges
- Icon buttons: `h-9 w-9 flex items-center justify-center`; align via parent `gap`.
- Badges: `px-3 py-1 gap-2` for icon + label. Reserve `px-4` only when the badge stands alone.
- Stacked CTAs on mobile: `flex flex-col gap-3`; avoid per-button margins.

## Debug Checklist
1. Replace stacked margins with parent `gap`/`space-y`.
2. Cards inherit padding from parents; avoid double padding.
3. Repeated elements share identical padding so numbers line up.
4. Hit areas meet 44px guidance even if glyphs are smaller.
