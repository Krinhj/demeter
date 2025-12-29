# Demeter Frontend File Structure

The canonical layout for the Demeter meal prep app (Next.js 15 + Supabase + Mastra). Use this as the single source of truth for where files live and how new features should be organized.

## Workspace Overview

```
demeter/
├─ docs/                    # PRD, structure guides, API notes
├─ public/                  # Static assets (favicons, images)
├─ src/                     # Application code (see below)
├─ package.json
├─ tsconfig.json            # `@/*` alias → `src/*`
├─ next.config.ts
├─ postcss.config.mjs
├─ tailwind.config.ts
├─ .env.local (ignored)     # Supabase keys, OpenAI key, etc.
└─ README.md
```

- Add optional root folders (e.g., `docs/screenshots-public/`) only when they serve documentation or imagery.
- Keep `.gitkeep` files out of the repo unless absolutely necessary.

## Guardrails
- All application code, Supabase helpers, and assets must remain inside the `demeter/` workspace shown above. Do **not** create sibling `src/` or `supabase/` folders at the repository root—local tooling and Vercel builds rely on this canonical layout.
- Secrets stay in `.env.local` and are never hard-coded or checked in.
- Stick to pnpm consistently (match the lockfile already committed).

## Source Tree (Detailed)

```
src/
├─ app/                        # Next.js App Router entry point
│  ├─ layout.tsx               # Root layout (server component)
│  ├─ globals.css              # Tailwind tokens + resets
│  ├─ (auth)/                  # Login/logout routes
│  │   └─ login/page.tsx
│  ├─ (dashboard)/             # Authenticated shell
│  │   ├─ layout.tsx           # Supabase session gate
│  │   ├─ page.tsx             # Dashboard overview
│  │   ├─ recipes/             # Recipe library screens
│  │   │   ├─ page.tsx         # Recipe list
│  │   │   ├─ new/page.tsx     # Add recipe (paste flow)
│  │   │   └─ [id]/page.tsx    # Recipe detail/edit
│  │   ├─ meal-plans/          # Meal planning screens
│  │   │   ├─ page.tsx         # Current/upcoming plans
│  │   │   ├─ new/page.tsx     # Generate new plan
│  │   │   └─ [id]/page.tsx    # Plan detail/edit
│  │   ├─ grocery-lists/       # Grocery list screens
│  │   │   ├─ page.tsx         # List overview
│  │   │   └─ [id]/page.tsx    # Shopping mode
│  │   └─ goals/               # Nutrition goal settings
│  │       └─ page.tsx
│  └─ api/                     # Route handlers when needed
├─ components/                 # Shared UI pieces
│  ├─ ui/                      # Shadcn/Radix primitives and wrappers
│  ├─ recipes/                 # Recipe-specific components
│  ├─ meal-plans/              # Meal plan components
│  ├─ grocery/                 # Grocery list components
│  └─ nutrition/               # Macro displays, charts
├─ hooks/                      # Shared React hooks (no domain logic)
├─ lib/                        # Utilities (formatters, unit converters)
│  └─ supabase/                # Client and server Supabase factories
├─ server/                     # Server-only modules
│  ├─ actions/                 # Server Actions per domain
│  │   ├─ recipes.actions.ts
│  │   ├─ recipes.schema.ts
│  │   ├─ meal-plans.actions.ts
│  │   ├─ meal-plans.schema.ts
│  │   ├─ grocery.actions.ts
│  │   ├─ grocery.schema.ts
│  │   ├─ goals.actions.ts
│  │   └─ goals.schema.ts
│  └─ services/                # Supabase query helpers
│      ├─ recipes.service.ts
│      ├─ meal-plans.service.ts
│      ├─ grocery.service.ts
│      └─ goals.service.ts
├─ mastra/                     # AI agent orchestration
│  ├─ agents/                  # Agent definitions
│  │   ├─ recipe-parser.ts
│  │   ├─ nutrition-normalizer.ts
│  │   ├─ meal-planner.ts
│  │   └─ grocery-aggregator.ts
│  ├─ tools/                   # Agent tools
│  └─ prompts/                 # System prompts
├─ types/                      # Shared TypeScript types/interfaces
└─ utils/                      # Non-React helpers (unit conversion, math)
```

Optional directories you may introduce when justified:
- `config/` – environment-aware constants or feature flags.
- `data/` – temporary mock fixtures for local development (remove once real data is available).

## Folder Roles
- **`src/app/`**: mirrors URL segments. Co-locate loading/error boundaries with the route. Keep each feature inside `(dashboard)` with its own `_components`, `_sections`, and optional `_providers`.
- **`src/components/`**: reusable UI shared across routes. Extend or wrap Shadcn components here to maintain consistent styling and accessibility.
- **`src/lib/`**: framework-agnostic helpers, unit conversion, Supabase client factories, and shared hooks.
- **`src/server/`**: server-only logic. Actions validate input, call services, and revalidate cache tags. Services contain Supabase queries.
- **`src/mastra/`**: AI agent definitions, tools, and prompts. Agents handle recipe parsing, nutrition calculation, meal planning, and grocery aggregation.
- **`src/utils/` & `src/types/`**: generic helpers and shared TypeScript surfaces.

## Feature Folder Conventions (`app/(dashboard)/*`)
- `page.tsx`: server component per route; keeps logic thin by importing sections.
- `_components/`: feature-scoped components; mark `'use client'` only when interactivity is required.
- `_sections/`: server-driven sections that combine data fetching with client leaves.
- `_providers/` (optional): client providers for syncing filters/search params.
- `loading.tsx`: skeleton UI for streaming.
- `error.tsx`: error boundary for the route.

## Server Actions & Services
- Place actions in `src/server/actions/<domain>.actions.ts`. They:
  1. Start with `'use server'`.
  2. Validate input using Zod schemas from `*.schema.ts`.
  3. Call the corresponding service.
  4. Return `ActionResult<T>` type.
  5. Call `revalidateTag` for affected resources.
- Services in `src/server/services/*-service.ts` encapsulate Supabase queries. Never import React or browser APIs here.

## AI Agents (Mastra)
- Place agent definitions in `src/mastra/agents/`.
- Each agent has a specific purpose:
  - `recipe-parser.ts`: Converts raw recipe text to structured data.
  - `nutrition-normalizer.ts`: Attaches macro/calorie data to ingredients.
  - `meal-planner.ts`: Generates goal-aware weekly plans.
  - `grocery-aggregator.ts`: Produces optimized shopping lists.
- Tools live in `src/mastra/tools/` and are shared across agents.
- System prompts live in `src/mastra/prompts/`.

## Data Models (Supabase Tables)

```
recipes
├─ id (uuid, PK)
├─ user_id (uuid, FK → auth.users)
├─ name (text)
├─ description (text, nullable)
├─ ingredients (jsonb) -- [{name, quantity, unit}]
├─ steps (jsonb) -- [string]
├─ servings (int)
├─ prep_time (int, minutes, nullable)
├─ cook_time (int, minutes, nullable)
├─ calories_per_serving (int)
├─ protein_per_serving (numeric)
├─ carbs_per_serving (numeric)
├─ fat_per_serving (numeric)
├─ tags (text[])
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

meal_plans
├─ id (uuid, PK)
├─ user_id (uuid, FK → auth.users)
├─ name (text)
├─ start_date (date)
├─ end_date (date)
├─ meals (jsonb) -- [{day, meal_type, recipe_id, servings}]
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

grocery_lists
├─ id (uuid, PK)
├─ user_id (uuid, FK → auth.users)
├─ meal_plan_id (uuid, FK → meal_plans, nullable)
├─ items (jsonb) -- [{name, quantity, unit, category, checked}]
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

nutrition_goals
├─ id (uuid, PK)
├─ user_id (uuid, FK → auth.users, unique)
├─ daily_calories (int)
├─ protein_min (numeric)
├─ protein_max (numeric)
├─ carbs_target (numeric, nullable)
├─ fat_target (numeric, nullable)
├─ meals_per_day (int)
├─ preferences (jsonb) -- {reuse_meals, exclusions, etc.}
├─ created_at (timestamptz)
└─ updated_at (timestamptz)
```

## Documentation & Assets
- `docs/`: PRD, structure guides, API references.
- Update these docs whenever the structure or architectural decisions change.

## Best Practices Snapshot
- Favor server components; keep client bundles lean.
- Use TypeScript in strict mode everywhere.
- Stick to kebab-case filenames (`recipe-card.tsx`) while exporting PascalCase components.
- Add new directories only when the first concrete file lands—do not commit empty folders.
- Before pushing, ensure new files respect this structure and that secrets stay confined to environment variables.

Following this structure keeps Demeter predictable, secure, and ready for upcoming features.
