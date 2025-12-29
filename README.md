# Demeter

A personal meal prep planner that helps you store recipes, track nutrition, generate weekly meal plans, and create smart grocery lists — all driven by your calorie and macro goals.

## Features

- **Recipe Ingestion** — Paste any recipe text and let AI parse it into structured data (ingredients, steps, servings, nutrition)
- **Nutrition Tracking** — Automatic macro calculation (protein, carbs, fat, calories) per serving
- **Recipe Library** — Searchable database with tags and filters (high-protein, low-calorie, meal type)
- **Weekly Meal Planner** — Generate goal-aware plans based on daily calorie targets, protein ranges, and preferences
- **Grocery Lists** — Aggregated, deduplicated shopping lists grouped by category with unit conversion

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4 + Shadcn UI
- **Database:** Supabase (Postgres + Auth with RLS)
- **AI:** Mastra Framework for agent orchestration

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Other Commands

```bash
pnpm lint     # Run ESLint
pnpm build    # Production build
pnpm start    # Run production server
```

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages
│   └── (dashboard)/       # Protected dashboard routes
├── components/
│   ├── ui/                # Shadcn primitives
│   └── [feature]/         # Feature-specific components
├── server/
│   ├── actions/           # Server actions with Zod validation
│   └── services/          # Supabase query helpers
├── lib/
│   └── supabase/          # Client and server Supabase factories
└── mastra/
    ├── agents/            # AI agents (recipe parser, meal planner, etc.)
    └── tools/             # Agent tools
```

## AI Agents

| Agent                    | Purpose                                        |
| ------------------------ | ---------------------------------------------- |
| RecipeParserAgent        | Converts raw recipe text into structured data  |
| NutritionNormalizerAgent | Attaches macro and calorie data to ingredients |
| MealPlannerAgent         | Generates goal-aware weekly meal prep plans    |
| GroceryAggregatorAgent   | Produces optimized, categorized grocery lists  |

## License

MIT
