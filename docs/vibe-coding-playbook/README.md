# Vibe Coding Playbook

Reusable blueprints for building polished frontends without guessing. Plug in your palette, logo, and background art, then follow the page recipes to ship consistently good UX across projects.

## How to Use
- **Set tokens first:** Define CSS variables for `background`, `foreground`, `muted`, `border`, `card`, `primary`, `primary-foreground`, `accent`, `positive`, `negative`, `warning`. Wire them to Tailwind theme (`colors` mapping to `var(--color-*)`).
- **Install shadcn/ui components via CLI:** Never hand-roll a component shadcn ships. Run the shadcn CLI, fetch updated docs via Context7 MCP if needed, and add components before styling.
- **Pick a page recipe:** Choose `landing-pages.md`, `auth-pages.md`, or `dashboards.md` and follow the structure/layout rules. Pull primitives from `components.md`, visuals/motion from `motion-and-visuals.md`, and palette guidance from `theming.md`.
- **Drop in brand assets:** Swap palette values, logo, and left-panel artwork/animation (auth) or hero backgrounds (landing) without changing layout rules.

## Principles
- Shadcn-first UI with light theme tokens and predictable spacing; only extend components for brand micro-adjustments.
- Full-bleed layouts where content should fill the viewport; avoid accidental max-width wrappers on dashboards.
- Strong typography (Space Grotesk or similar expressive sans) and limited, purposeful motion.

## Files
- `landing-pages.md` – Hero-first landing layout, staggered content, CTA patterns.
- `auth-pages.md` – Two-column login/register pattern with animated visual panel.
- `dashboards.md` – App shell, full-bleed fix, cards/tables layout.
- `components.md` – Shadcn usage rules, extension patterns, icons/states.
- `theming.md` – Palette tokens and how to remap them per project.
- `motion-and-visuals.md` – Animation cadence, background treatments, and do/don’t list.
- `playbook-instance-template.md` – Copy this into `docs/project-vibe.md` (outside this folder) for each project’s filled-in inputs so it’s easy to duplicate this folder without cleanup.
- `glassmorphism.md` – Frosted glass pattern (blur + border + contrast rules) for hero/auth overlays or callouts.
- **PRD alignment:** If the repo includes a PRD, mirror its scope/constraints. In this codebase, see `docs/PRD.md` for Hermes-specific goals, core screens (dashboard, accounts, categories, transactions), single-user auth stance, Supabase/RLS requirements, and performance targets (<1.5s dashboard load). Replace with your project’s PRD when reusing.
