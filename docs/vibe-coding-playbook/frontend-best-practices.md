# Frontend Best Practices (Reusable)

Framework-agnostic-ish guidance oriented to modern React/Next apps; adapt specifics as needed.

## Core Principles
- Server-first when possible; minimize client-only state. Use server actions/SSR/SR where supported.
- Tight scope: abstractions must serve real features; avoid premature generalization.
- Security first: auth gates on protected routes; never leak secrets to client bundles.

## Structure & Ownership
- Follow a canonical tree (see `file-structure.md`).
- Each route/feature owns its `_components`/`_sections`/providers. Shared primitives live in `components/ui`.
- Keep feature logic out of global UI primitives.

## Data Flow
1. Define schemas (e.g., Zod) near domain.
2. Services/queries live in server-side helpers.
3. Server actions validate input, call services, and handle revalidation/invalidations.
4. Server components call actions directly; small client providers handle interactivity.

## Auth & Access
- Gate dashboard routes with session checks. Redirect unauthenticated users to auth.
- Keep public signups explicit; do not assume open registration.

## State Management
- Prefer server-rendered data + component-local state.
- For shared client state (filters, in-flight form data), use lightweight stores/hooks scoped to the feature.
- Mirror important filters in URLs when needed for reload/share.

## Components
- Keep `page.tsx`/`layout.tsx` server-side; mark interactive children as client components explicitly.
- Use shadcn components via CLI; avoid custom clones when an official component exists.
- Colocate component styles/config near the component; avoid magic globals.

## Networking & Errors
- Centralize fetch/helpers; handle errors with typed results and UI feedback (toasts/alerts).
- Show inline errors near the control; provide retry when possible.
- Consider optimistic UI only when data consistency is assured.

## Performance
- Avoid client waterfalls; prefetch where safe. Use `min-w-0` and full-bleed layouts to prevent overflow.
- Lazy-load heavy visuals; compress/optimize assets.

## QA Checklist
- Protected routes are gated; secrets stay server-side.
- Schemas validate inputs; actions revalidate affected data.
- Shadcn components installed via CLI; no reimplemented primitives.
- Spacing/layout follow `spacing-guidelines.md`; colors/typo follow `style-guide.md`.
- Full-bleed dashboard verified (no `max-w` wrappers on main content).
