# Glassmorphism Pattern

Reusable recipe for frosted glass surfaces (cards, hero overlays) that stay readable and performant.

## Core Rules
- **Blur + transparency + border:** Combine a subtle backdrop blur (`backdrop-blur-md`/`lg`), semi-transparent fill, and a 1px border to define edges.
- **Contrast first:** Text/icons on glass panels must pass contrast over the underlying scene. Add an inner solid scrim if needed.
- **Performance:** Prefer CSS blur over heavy filters; keep the area reasonable to avoid GPU overhead.

## Token Setup
- Fill: `bg-white/8` to `bg-white/14` for light themes; invert to `bg-black/20` for dark. Tie to tokens if possible (`bg-[color:var(--color-card)]/10`).
- Border: `border border-white/30` (light) or `border-black/20` (dark). Optional inner hairline via `outline outline-1 outline-white/10`.
- Shadow: light `shadow-[0_10px_40px_-24px_rgba(0,0,0,0.45)]` or `shadow-lg` to lift from the background.
- Radius: match `--radius` (e.g., `rounded-xl`).

## Layering
- Place over gradients/noise, not busy photos. If photo/illustration is busy, add a subtle scrim behind the glass (`before` pseudo with `bg-black/10`).
- Keep padding generous (`p-6`+) so the blur effect has breathing room.
- Avoid stacking multiple glass layers; one or two key surfaces only.

## Motion
- Animate transforms/opacity only (no blur animation). Small fade/slide on enter is fine.
- Respect `prefers-reduced-motion` by skipping entrance animations.

## Use Cases
- Hero visual card stack (landing): use 1–2 glass cards with slight rotation/offset.
- Auth visual panel overlay: glass card with headline/subcopy over a gradient/animated blob background.
- Dashboard callouts: sparingly, e.g., a floating filter bar; keep tables/cards solid for readability.

## Accessibility Checklist
- [ ] Text contrast validated against the worst-case background behind the glass.
- [ ] Focus rings visible on glass surfaces (use solid tokenized ring colors).
- [ ] No blur animation; transforms/opacity only.
- [ ] Mobile tested for readability and performance.
