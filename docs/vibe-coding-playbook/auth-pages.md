# Auth Pages

Two-column auth layout with a visual canvas on the left and forms on the right. Swaps to a single column on small screens while keeping the visual vibe.

## Layout
- **Grid:** `min-h-screen grid lg:grid-cols-[1fr_420px]` (adjust second track to match desired form width). Add `min-w-0` to both children.
- **Left (visual):** `relative overflow-hidden` with gradient + noise + animated element (particles, blurred blobs). Centered tagline and short value prop.
- **Right (form):** Card or bare column with `max-w-sm` and generous spacing (`space-y-6`). Keep header (logo + title), form, and footer links.
- **Mobile:** Stack (`grid-cols-1`), move visual above form; keep padding `px-6 py-10`.

## Visual Panel Guidance
- Use abstract animation (CSS keyframes or lightweight canvas) with opacity under 0.35; avoid distracting loops.
- Add a subtle grid/line overlay; keep text readable with `backdrop-blur` if overlaying copy.
- Slot in logo or brand mark small; avoid heavy marketing copy here.

## Form Pattern (shadcn)
- Components: `Form`, `FormField`, `Label`, `Input`, `Button`, `Separator`, `Alert`/`Callout` for errors, `Checkbox` if needed. Add via shadcn CLI.
- States: disabled while submitting, inline errors, password toggle, `aria-live` for form-level errors.
- Social login buttons: ghost style with icon left; separate with `Separator` and caption.
- Include “Remember me” and “Forgot password” as inline text links; use neutral emphasis.

## Content
- Title + short description (one line). Keep action clarity (“Sign in to continue”).
- Provide secondary action for new users (link to sign up) and legal links (TOS/Privacy) in the footer.

## Motion
- Form slides/fades up subtly; visual panel can float elements slowly (5–12s cycles). Respect `prefers-reduced-motion`.

## Checklist
- [ ] Two-column layout active on large screens; single column on mobile.
- [ ] Visual panel contrast verified; text remains legible.
- [ ] Form states covered (idle, loading, error, success, disabled).
- [ ] Buttons and inputs sourced from shadcn, not custom clones.
