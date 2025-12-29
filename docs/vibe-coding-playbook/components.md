# Components

Shadcn-first component strategy to keep velocity high and styling consistent.

## Rules
- Always add components through the shadcn CLI. If a component exists in shadcn, do not rebuild it. Use Context7 MCP to fetch updated shadcn docs when unsure.
- Extend via tokens/utilities, not by forking. Adjust padding/radius/colors through Tailwind + CSS variables.
- Keep imports server/client-correct (e.g., form components can live in client modules; shells stay server-side if they do not need interactivity).

## Core Kit to Install Early
- Layout: `card`, `scroll-area`, `separator`.
- Navigation: `button`, `navigation-menu` or `sidebar`, `dropdown-menu`, `tabs`.
- Forms: `form`, `input`, `label`, `textarea`, `select`, `checkbox`, `toggle`, `radio-group`, `switch`, `slider`.
- Feedback: `alert`, `badge`, `toast` provider, `skeleton`.
- Overlays: `dialog`, `popover`, `sheet`, `hover-card`, `tooltip`.

## Extension Patterns
- **Buttons:** keep variants `primary/secondary/ghost/destructive`. Map colors to tokens; add `asChild` for links.
- **Cards:** base card with `border` + `shadow-sm`; slot header/body/footer; allow `asChild` for clickable cards.
- **Table:** add `tabular-nums`, zebra stripes via utilities; keep header sticky optionally with `sticky top-0 backdrop-blur`.
- **Forms:** centralize validation messages and helper text; use consistent spacing `space-y-4` inside forms.

## Icons
- Prefer Lucide; keep sizes 16/20/24 depending on density. Match color to text or status tokens (`positive/negative/warning`).

## States & Accessibility
- Provide focus rings using tokenized colors. Ensure disabled styles preserve contrast. Support `aria-live` for async feedback.

## Process Checklist
- [ ] Component added via shadcn CLI (document version if relevant).
- [ ] Tokenized colors applied; no hardcoded hex values.
- [ ] States covered (hover, focus, active, disabled, loading).
- [ ] Variants documented in the consuming page recipe.
