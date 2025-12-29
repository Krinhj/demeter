# Landing Pages

Blueprint for hero-led landing pages that feel intentional and flexible.

## Layout
- **Hero first:** Full-width section with `py-16 md:py-24`, `max-w-6xl` content wrapper centered but allow background visuals to bleed edge to edge.
- **Grid:** `lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12`. Left = headline/CTA; right = visual (mock screenshot, device frame, or gradient card stack).
- **Stacking:** On mobile, stack content (`flex flex-col gap-8`); keep CTA above the fold.
- **Nav:** Minimal top bar with logo + ghost buttons; keep CTA as primary.

## Content Recipe
- Headline with one bold verb, subhead ~2 lines, primary + secondary CTA (primary solid, secondary ghost/text).
- Use supporting bullets (3 max) with icons from Lucide; align to grid.
- Social proof: small logo strip or rating chips under CTAs.

## Visuals
- Background: layered gradient (`radial` + `linear`) plus subtle noise overlay; keep contrast with text.
- Visual panel: card stack with shadows, or blurred glass panel; ensure `rounded-xl` and border.
- Avoid random stock art; use simplified UI mock or abstract shapes matching palette.

## Motion
- Staggered fade/slide for headline, subhead, CTAs (50–120ms offsets).
- Light floating/parallax on hero visual; cap movement to 8–12px.
- Keep scroll-based animations subtle; avoid blocking content.

## Components (shadcn-first)
- Buttons (primary/secondary/ghost), Badge for highlights, Accordion for FAQs, Tabs for feature comparisons, Cards for feature rows.
- Add via shadcn CLI; prefer extending tokens over rewriting components.

## Responsiveness
- Collapse grid to single column under `lg`; keep spacing `gap-6`+.
- Ensure hero visual scales down without cropping key content; use `object-contain` and `aspect-[4/3]` wrappers.

## Checklist
- [ ] Palette tokens applied to backgrounds, borders, CTA states.
- [ ] Copy length keeps headline/subhead readable on small screens.
- [ ] Visual contrast verified (4.5:1 for text on backgrounds).
- [ ] Motion disabled gracefully if `prefers-reduced-motion`.
