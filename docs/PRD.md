# Demeter Product Requirements Document (PRD)

**Version:** 1.0
**Date:** December 2025
**Author:** Ronnie Talabucon Jr.
**Status:** Draft for Development Review

## 1. Introduction and Vision

### 1.1 Overview

Demeter is a personal meal prep planning web application designed for recipe management, nutrition tracking, and efficient weekly meal planning. Version 1 focuses on core flows (Recipe Ingestion, Recipe Library, Meal Planning, and Grocery Lists) plus AI-powered parsing and macro-aware plan generation. Demeter will later evolve into the Nutrition Subfunction of the GAIA ecosystem.

### 1.2 Vision and Positioning

Demeter aims to be a personal nutrition control panel: fast, clean, private, and goal-driven. It must prioritize accuracy, meal-prep efficiency, and usability over complexity. The app should make hitting protein and calorie targets effortless through intelligent planning and batch-cooking optimization. For now, Demeter v1 should remain lightweight and highly usable, something the user relies on every week for meal prep.

## 2. Goals and Success Metrics

### 2.1 Primary Goals

- Provide a clean system for storing and organizing recipes with structured nutrition data.
- Offer AI-powered recipe parsing from raw text input.
- Generate weekly meal plans based on calorie and macro targets.
- Produce aggregated, categorized grocery lists from meal plans.
- Ensure strong privacy and security using Supabase Auth with strict RLS.
- Build a foundation for future AI features (cost optimization, fitness integration).
- Deploy as a secured personal web app on a custom domain.

### 2.2 Key Performance Indicators (KPIs)

| Metric                  | Target                                      | Measurement Method                             |
| ----------------------- | ------------------------------------------- | ---------------------------------------------- |
| Weekly usability        | Demeter used consistently to plan meals     | Manual usage logs, Supabase analytics          |
| Recipe parsing accuracy | 90%+ ingredients correctly parsed           | Manual QA on sample recipes                    |
| Meal plan generation    | Plans meet macro targets within 5% variance | Automated validation                           |
| Dashboard load time     | < 1.5 seconds on mid-range devices          | Lighthouse / Vercel analytics                  |
| Auth security           | 100% of pages gated behind Supabase user    | Supabase auth validation + route guard testing |

## 3. User Personas

Since Demeter is initially a personal tool, personas revolve around a single real-world user: Ronnie.

| Persona                      | Responsibilities                                           | Key Needs                                                  | Notes                         |
| ---------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------- |
| Primary User (Ronnie)        | Plan meals, track macros, generate grocery lists           | Fast recipe entry, accurate nutrition, goal-aware planning | Weekly usage for meal prep    |
| Future: GAIA Nutrition Agent | Provide insights, meal suggestions, health recommendations | Structured, clean data model                               | Introduced in future versions |

## 4. User Journeys and Core Screens

### 4.1 Dashboard

**Purpose:** Provide a quick overview of the current week's meal plan and nutrition status.

**Primary User Stories**

- "As a user, I want to see my meal plan for the week at a glance."
- "As a user, I want to see if I'm hitting my macro targets."
- "As a user, I want quick access to this week's grocery list."

**Key Features**

- Current week's meal plan overview.
- Daily/weekly macro summary (protein, carbs, fat, calories).
- Progress toward nutrition goals.
- Quick link to grocery list.

### 4.2 Recipes

**Purpose:** Manage a personal recipe library with structured nutrition data.

**Primary User Stories**

- "As a user, I want to paste a recipe and have it automatically parsed."
- "As a user, I want to view and edit recipe details."
- "As a user, I want to search and filter recipes by tags or macros."

**Key Features**

- Recipe ingestion via copy-paste with AI parsing.
- List of recipes with search and filters.
- Recipe detail view with ingredients, steps, and nutrition.
- Create/edit/delete recipes.
- Tagging system (high-protein, low-calorie, meal type).

### 4.3 Meal Plans

**Purpose:** Generate and manage weekly meal prep plans based on nutrition goals.

**Primary User Stories**

- "As a user, I want to generate a weekly meal plan based on my calorie and protein targets."
- "As a user, I want to adjust serving sizes to meet my goals."
- "As a user, I want to swap meals easily."

**Key Features**

- Weekly plan generation with AI.
- 7-day grid view (breakfast, lunch, dinner, snacks).
- Serving size adjustments.
- Manual meal swapping.
- Macro balancing across the week.

### 4.4 Grocery Lists

**Purpose:** Generate optimized shopping lists from meal plans.

**Primary User Stories**

- "As a user, I want a grocery list generated from my meal plan."
- "As a user, I want ingredients grouped by category."
- "As a user, I want to check off items as I shop."

**Key Features**

- Auto-generated from active meal plan.
- Ingredient aggregation and deduplication.
- Unit conversion (g → kg, ml → L).
- Category grouping (produce, protein, dairy, pantry).
- Checkbox interaction for shopping mode.
- Export/share functionality.

### 4.5 Goals

**Purpose:** Set and track nutrition targets.

**Primary User Stories**

- "As a user, I want to set my daily calorie target."
- "As a user, I want to set my protein range."
- "As a user, I want to track my progress toward goals."

**Key Features**

- Daily calorie target setting.
- Macro targets (protein, carbs, fat).
- Meals per day configuration.
- Preference settings (reuse meals, exclusions).

## 5. Functional Requirements

### 5.1 Dashboard (Phase 1)

- **FR-1:** Display current week's meal plan in grid format.
- **FR-2:** Show daily and weekly macro summaries.
- **FR-3:** Display progress toward nutrition goals.
- **FR-4:** Provide quick access to grocery list.

### 5.2 Recipes (Phase 1)

- **FR-5:** Accept pasted recipe text and parse via AI into structured data.
- **FR-6:** Store recipe name, ingredients (quantity + unit), steps, servings.
- **FR-7:** Calculate and store macros per serving (protein, carbs, fat, calories).
- **FR-8:** Provide searchable recipe list with filters.
- **FR-9:** Allow editing or deletion of recipes.
- **FR-10:** Support tagging for categorization.

### 5.3 Meal Plans (Phase 1)

- **FR-11:** Generate weekly plans based on calorie and macro targets.
- **FR-12:** Balance macros across the full week, not just per day.
- **FR-13:** Support serving size adjustments.
- **FR-14:** Allow manual meal swapping.
- **FR-15:** Optimize for meal-prep efficiency (batch cooking, reuse).

### 5.4 Grocery Lists (Phase 1)

- **FR-16:** Aggregate ingredients from active meal plan.
- **FR-17:** Deduplicate and combine like ingredients.
- **FR-18:** Convert units for shopping convenience.
- **FR-19:** Group by grocery category.
- **FR-20:** Provide checkbox interaction for shopping mode.

### 5.5 Goals (Phase 1)

- **FR-21:** Store daily calorie target.
- **FR-22:** Store macro targets (protein range, carbs, fat).
- **FR-23:** Store meals per day preference.
- **FR-24:** Store dietary preferences and exclusions.

### 5.6 Authentication & Authorization (Phase 1)

- **FR-25:** Use Supabase Auth (email/password) with only one allowed user.
- **FR-26:** Disable signups in Supabase.
- **FR-27:** Enforce RLS so all records are scoped to `auth.uid()`.
- **FR-28:** Redirect unauthenticated users to the login page.

### 5.7 Future Enhancements (Phase 2+)

- **FR-29 (AI):** Cost-aware meal planning with budget constraints.
- **FR-30 (AI):** "What can I make with these ingredients?" query.
- **FR-31:** Fitness/gym integration for dynamic macro adjustment.
- **FR-32:** Public recipe sharing.
- **FR-33:** Nutrition label scanning.
- **FR-34:** Leftover tracking and waste reduction.
- **FR-35:** Export meal plans and grocery lists as PDF.
- **FR-36:** Grocery List API for iPhone Shortcuts integration (see [spec](./features/grocery-list-api.md)).

## 6. Architecture and Technical Constraints

- Frontend Framework: Next.js 15 App Router, TypeScript, server components where possible.
- Styling: Tailwind CSS + Shadcn UI components.
- State Management: Server actions, minimal client state.
- Database: Supabase Postgres with RLS and policies.
- AI Framework: Mastra for agent orchestration (recipe parsing, meal planning).
- Deployment: Vercel (primary hosting).
- Auth: Supabase Auth with single private user.
- Data Loading: Server components + Supabase queries.
- Browser Compatibility: Latest Chrome/Firefox/Edge; no IE.
- Security: Private repo, environment variables via Vercel, RLS in database.

## 7. Non-Functional Requirements

- Performance: Dashboard loads under 1 second after authentication.
- Security: Strict RLS, secure cookies, no client-exposed tokens.
- Reliability: AI parsing must gracefully handle incomplete data.
- UX Simplicity: Minimal clicks required to add a recipe or generate a plan.
- Privacy: Only authenticated owner can access Demeter.
- Responsiveness: Mobile-optimized for grocery shopping use case.

## 8. Roadmap and Release Plan

| Phase   | Focus                    | Key Deliverables                                   | Dependencies                   |
| ------- | ------------------------ | -------------------------------------------------- | ------------------------------ |
| Phase 1 | Core Flows + AI Parsing  | Recipes, Meal Plans, Grocery Lists, Auth           | Supabase project, Mastra setup |
| Phase 2 | Quality-of-life upgrades | Better filters, recipe import from URLs, favorites | User workflows                 |
| Phase 3 | AI enhancements          | Cost-aware planning, ingredient-based suggestions  | More recipe data               |
| Phase 4 | Advanced features        | Fitness integration, public sharing, analytics     | External APIs                  |

## 9. Out of Scope

- Multi-user support.
- Shared or collaborative meal plans.
- Real-time grocery store API integrations.
- Mobile-native apps.
- Restaurant/takeout recommendations.
- Calorie counting from photos.

## 10. Assumptions and Dependencies

- User manages all recipes manually (no external recipe syncing).
- Supabase availability is reliable for storage and auth.
- Only one user account will ever access the system.
- OpenAI API available for recipe parsing and meal plan generation.
- Nutrition data derived from ingredient parsing (not external nutrition APIs initially).

## 11. Open Questions

- Should recipes support images/photos?
- Should meal plans support multiple weeks in advance?
- Should grocery lists integrate with delivery services (Instacart, etc.)?
- Should Demeter track pantry inventory?
- Will future GAIA integration require a shared session or token?

## 12. Success Criteria for Launch

- Recipe parsing works reliably for common recipe formats.
- Meal plan generation meets macro targets within acceptable variance.
- Grocery lists correctly aggregate and categorize ingredients.
- Authentication gates all pages.
- Demeter is deployed to a secure custom domain.
- User adopts Demeter successfully for weekly meal prep.

_Last Updated: December 2025_
_Owner: Ronnie Talabucon Jr._
