# Playbook Instance Template

Use this template to capture project-specific inputs (palette, assets, animation choices) while keeping the build steps aligned with the playbook. Copy this file, rename it per project (e.g., `project-vibe.md`), and fill the placeholders.

## Project Snapshot
- **Name:** {{PROJECT_NAME}}
- **Logo asset:** {{LOGO_PATH_OR_LINK}}
- **Typeface:** {{PRIMARY_FONT}} (fallbacks: {{FALLBACKS}})
- **Shadcn version/date:** {{SHADCN_VERSION_OR_DATE_INSTALLED}}

## Palette Tokens
- `--color-background`: {{HEX/VAR}}
- `--color-foreground`: {{HEX/VAR}}
- `--color-muted`: {{HEX/VAR}}
- `--color-border`: {{HEX/VAR}}
- `--color-card`: {{HEX/VAR}}
- `--color-primary`: {{HEX/VAR}}
- `--color-primary-foreground`: {{HEX/VAR}}
- `--color-accent`: {{HEX/VAR}}
- `--color-positive`: {{HEX/VAR}}
- `--color-negative`: {{HEX/VAR}}
- `--color-warning`: {{HEX/VAR}}
- Hover/active offsets: {{+/-X% RULE}}

## Typography Scale
- Headline sizes: {{HERO/H1/H2}}
- Body/base: {{TEXT_BASE}}
- Secondary: {{TEXT_SM}}
- Tracking/leading rules: {{NOTES}}

## Spacing & Radii
- Base unit: 4px/8px; key gaps (cards, sections): {{VALUES}}. Refer to `docs/spacing-guidelines.md`.
- Radius: {{RADIUS}} (map to `--radius`). Elevation defaults: {{SHADOWS}}.

## Components Installed (shadcn)
- Layout: {{LIST}}
- Forms: {{LIST}}
- Feedback/overlays: {{LIST}}
- Navigation: {{LIST}}

## Background & Motion Choices
- **Landing hero:** Gradient recipe (colors/stops): {{DETAILS}}; noise overlay: {{YES/NO}}; visual asset: {{DESCRIPTION}}.
- **Auth visual panel:** Animation type (blobs/particles), speed, opacity: {{DETAILS}}.
- **Dashboard:** Motion policy (skeletons only / light fades), background (plain/striped/noise).
- `prefers-reduced-motion` handling: {{STRATEGY}}

## Layout Selections
- **Auth:** Two-column breakpoint {{BREAKPOINT}}; form width {{WIDTH}}; visual copy: {{TAGLINE}}.
- **Landing:** Grid ratio (e.g., 1.1/0.9); CTA styles (primary/ghost colors): {{DETAILS}}.
- **Dashboard:** Shell grid `[SIDEBAR_minmax(0,1fr)]`; sidebar width {{WIDTH}}; full-bleed fix applied (yes, per `docs/fullbleed-layout.md`).

## Assets
- Icons: {{SET}} (e.g., Lucide). Sizes: {{16/20/24}}.
- Illustration/texture sources: {{LINKS_OR_NOTES}}.

## Content Tone
- Voice guidelines: {{SHORT NOTES}} (direct, confident, etc.).
- Microcopy rules for empty states/tooltips: {{NOTES}}.

## QA Checklist (per build)
- Tokens mapped to Tailwind (`var(--color-*)`).
- Shadcn components installed via CLI (list above). No custom clones for existing shadcn parts.
- Full-bleed dashboard verified on ultrawide; no hidden sidebar rails.
- Spacing matches `docs/spacing-guidelines.md`; style/structure aligns with `docs/style-guide.md` and `docs/frontend-best-practices.md`.
- Motion respects `prefers-reduced-motion`; contrast ≥ 4.5:1 for text.
