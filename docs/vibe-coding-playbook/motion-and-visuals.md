# Motion and Visuals

Principles for animations, backgrounds, and atmospherics that stay tasteful and reusable.

## Motion Cadence
- Use micro-staggers (50–120ms) for entering text/CTAs; cards can fade/slide up with `transition` 200–300ms.
- Limit parallax/floating to visuals, not text. Movement amplitude 8–12px; duration 6–12s loops.
- Respect `prefers-reduced-motion`; fall back to static gradients/noise.

## Background Treatments
- Layered gradients (1–2 radial + 1 linear) anchored to corners; opacity < 0.5 to keep text legible.
- Subtle noise overlay (PNG or CSS) at low opacity to avoid flatness.
- Optional grid/line pattern using `background-size` and `linear-gradient` stripes.
- Animated shapes: blurred blobs with slow keyframes; keep saturation aligned to `primary/accent` tokens.
- Glass overlays: when using frosted glass, pair a light blur with a translucent fill + border; see `glassmorphism.md` for a complete recipe.

## Page-Specific Notes
- **Landing:** Hero gets the richest background; subsequent sections stay lighter with simple dividers.
- **Auth:** Left panel hosts the animation; right form stays clean. Keep animation CPU-light.
- **Dashboard:** Minimal motion—prefer shimmering skeletons and quick dropdown animations; avoid looping backgrounds.

## Tools & Components
- Use CSS keyframes for light blob animations; for complex sequences, use Framer Motion with layout-aware transitions.
- Overlay utilities: `backdrop-blur`, `mix-blend-lighten` sparingly to keep contrast.

## Checklist
- [ ] Motion disabled or reduced when user prefers.
- [ ] Backgrounds keep 4.5:1 contrast for text.
- [ ] Animations GPU-friendly (transform/opacity), no layout thrash.
- [ ] Visual weight concentrated in designated panels only.
