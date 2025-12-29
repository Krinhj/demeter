# Frontend File Structure (Template)

Canonical layout for a Next.js-style app; adjust names to your framework as needed. Keep this structure when copying the playbook.

```
project/
├─ docs/                    # PRDs, specs, playbooks
├─ public/                  # Static assets (favicons, images)
├─ src/                     # Application code
├─ package.json
├─ tsconfig.json            # `@/*` alias → `src/*`
├─ next.config.ts
├─ postcss.config.mjs
├─ tailwind.config.ts
├─ .env.local (ignored)     # Secrets
└─ README.md
```

## Guardrails
- Keep all app code/helpers/assets inside this tree; avoid sibling `src/` folders that tooling won’t see.
- Secrets stay in `.env.local` and are never committed.
- Stick to one package manager (match the lockfile).

## Source Tree (detailed for App Router)

```
src/
├─ app/                        # App Router entry
│  ├─ layout.tsx               # Root layout (fonts/theme providers)
│  ├─ globals.css              # Tailwind tokens + resets
│  ├─ (auth)/                  # Login/logout routes
│  │   └─ login/page.tsx
│  ├─ (dashboard)/             # Authenticated shell
│  │   ├─ layout.tsx           # Session gate
│  │   ├─ page.tsx             # Dashboard overview
│  │   └─ ... feature routes   # e.g., /accounts, /transactions
│  └─ api/                     # Route handlers (if needed)
├─ components/                 # Shared UI (shadcn + wrappers)
├─ schemas/                    # Validation schemas
├─ server/                     # Server actions/services
├─ lib/                        # Utilities (formatters, constants)
└─ styles/                     # Additional CSS if needed
```

## Notes
- Feature folders own their `_components`, `_sections`, and providers; avoid leaking feature logic into global UI primitives.
- Keep docs (like `project-vibe.md`) in `docs/` so agents can find project inputs.
