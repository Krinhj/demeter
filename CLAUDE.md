# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Demeter is a personal meal prep planner for a single owner, built with Next.js 15 (App Router), TypeScript, Tailwind CSS 4, Shadcn UI, Supabase (Postgres + Auth with RLS), and Mastra (AI agent framework). It focuses on recipe management, macro-aware meal planning, and grocery list generation.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server at http://localhost:3000
pnpm lint             # Run ESLint (required before commits)
pnpm build            # Production build
pnpm start            # Run production server
```

## Architecture

### Data Flow Pattern
1. Define Zod schemas in `src/server/actions/*.schema.ts`
2. Create Supabase helpers in `src/server/services/*-service.ts`
3. Write server actions in `src/server/actions/*.actions.ts` that validate, call services, and `revalidateTag`
4. Server components call actions directly or pass them to client components
5. AI agents in `src/mastra/agents/` handle parsing, planning, and aggregation

### Key Directories
- `src/app/(dashboard)/` - Protected dashboard routes (session-gated in layout)
- `src/server/actions/` - Server actions with Zod validation (`'use server'`)
- `src/server/services/` - Supabase query helpers (no React/browser APIs)
- `src/components/ui/` - Shadcn/Radix primitives
- `src/lib/supabase/` - Client and server Supabase factories
- `src/mastra/` - AI agents, tools, and prompts

### Server Actions Pattern
Actions in `src/server/actions/*.actions.ts` follow this structure:
1. Start with `'use server'`
2. Validate input using Zod schemas
3. Call the corresponding service
4. Return `ActionResult<T>` type (from `action-result.ts`)
5. Call `revalidateTag` for affected resources

### Client vs Server Components
- `page.tsx` and `layout.tsx` are server components
- Client components use `'use client'` and live in `_components` folders
- Pass only serializable props from server to client
- Use `useFormState` or `useTransition` for mutation feedback

### AI Agents (Mastra)
Agents in `src/mastra/agents/` handle AI-powered features:
- `recipe-parser.ts` - Converts pasted recipe text to structured data
- `nutrition-normalizer.ts` - Calculates macros from ingredients
- `meal-planner.ts` - Generates weekly plans based on goals
- `grocery-aggregator.ts` - Creates optimized shopping lists

## Coding Conventions

- **File naming**: kebab-case files (`recipe-card.tsx`), PascalCase exports
- **Path alias**: `@/*` maps to `src/*`
- **Styling**: Tailwind + Shadcn UI; use CSS variables from `globals.css`
- **Typography**: Space Grotesk font (`--font-space-grotesk`)
- **Colors**: Primary #0d9488 (Teal), Positive #16a34a, Negative #dc2626
- **Macro colors**: Protein #8b5cf6, Carbs #f97316, Fat #eab308
- **TypeScript**: Strict mode enabled
- **Package manager**: pnpm (keep lockfile consistent)

## UI Patterns (Vibe Coding Playbook)

See `docs/vibe-coding-playbook/` for complete blueprints. Key rules:

### Shadcn-First Components
- Always add components via shadcn CLI (`npx shadcn@latest add <component>`)
- Never rebuild what shadcn ships; extend via tokens/utilities, not by forking
- No hardcoded hex values; use tokenized colors from CSS variables

### Dashboard Layout (Full-Bleed)
- Grid: `grid-cols-[260px_minmax(0,1fr)]` with `min-h-screen`
- Add `min-w-0` to main, sections, and card wrappers to prevent horizontal scroll
- Avoid `container`/`max-w-*` on dashboard content; let grid span the viewport
- Page padding inside main column: `px-6 lg:px-10 py-8`

### Auth Pages
- Two-column: `grid lg:grid-cols-[1fr_420px]` with visual panel left, form right
- Visual panel: gradient with organic shapes (leaf/wave motifs), opacity < 0.35
- Form: shadcn Form/Input/Button with inline errors and `aria-live`

### Motion Guidelines
- Micro-staggers 50–120ms for entering elements; cards fade/slide 200–300ms
- Respect `prefers-reduced-motion`; fall back to static
- Dashboard: minimal motion—prefer skeletons over looping animations

### Theming Tokens
Define in `globals.css` and map to Tailwind:
- `--color-background`, `--color-foreground`, `--color-muted`, `--color-border`, `--color-card`
- `--color-primary`, `--color-primary-foreground`, `--color-accent`
- `--color-positive`, `--color-negative`, `--color-warning`
- `--color-protein`, `--color-carbs`, `--color-fat`
- `--radius` (default 12px)

### Domain-Specific Patterns
- **Macro displays**: Use stacked bars or pill badges; color-code consistently (protein violet, carbs orange, fat yellow)
- **Recipe cards**: Thumbnail placeholder, macro badge row, serving count and prep time visible
- **Meal plan grid**: 7-column week view on desktop, vertical stack on mobile
- **Grocery lists**: Grouped by category with checkbox interaction

## Supabase Guidelines

- Use `createServerClient` in server code only; never expose service keys to client
- Scope every query with `user_id = session.user.id`
- Single-user app: no public signups, only the owner account exists
- RLS enforced on all tables

### Core Tables
- `recipes` - Recipe library with ingredients, steps, and nutrition
- `meal_plans` - Weekly meal plans with recipe references
- `grocery_lists` - Shopping lists generated from plans
- `nutrition_goals` - User's calorie and macro targets

## Documentation Reference

Before adding features, consult:
- `docs/PRD.md` - Product requirements
- `docs/file-structure.md` - Canonical folder layout
- `docs/frontend-best-practices.md` - Architecture patterns
- `docs/style-guide.md` - Design tokens and palette
- `docs/spacing-guidelines.md` - Layout system
- `docs/vibe-coding-playbook/` - Reusable UI blueprints (dashboards, auth, components, theming)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...  # server-only
OPENAI_API_KEY=...             # for Mastra agents
DEMETER_LOGIN_EMAIL=...
DEMETER_LOGIN_PASSWORD=...
```
