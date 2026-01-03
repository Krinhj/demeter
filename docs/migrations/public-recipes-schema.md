# Public Recipes Schema Design

## Overview

This document describes the database schema for the Public Recipes feature, which introduces a curated public recipe database alongside users' personal Recipe Banks.

## Architecture

### Two-Tier Recipe System

1. **Public Database (`public_recipes`)** - A curated collection of recipes that any user can browse and save
2. **Recipe Bank (`recipes`)** - A user's personal collection of recipes (own creations + saved from public)

### Copy-on-Save Model

When a user saves a recipe from the public database:
1. A copy is created in their `recipes` table
2. The `source_public_recipe_id` field links back to the original
3. `is_modified` starts as `false`
4. If the user edits the recipe, `is_modified` becomes `true`

This allows:
- Users to fully customize saved recipes
- Tracking which recipes came from the public database
- Potential future features like "sync with original" or "view changes"

## Tables

### `public_recipes`

The public recipe database with additional fields for discoverability and moderation.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Recipe name |
| `description` | text | Recipe description |
| `ingredients` | jsonb | Array of ingredient objects |
| `steps` | jsonb | Array of step strings |
| `equipment` | jsonb | Array of equipment objects |
| `servings` | integer | Number of servings |
| `prep_time_minutes` | integer | Prep time |
| `cook_time_minutes` | integer | Cook time |
| `calories` | integer | Calories per serving |
| `protein` | integer | Protein (g) per serving |
| `carbs` | integer | Carbs (g) per serving |
| `fat` | integer | Fat (g) per serving |
| `fiber` | integer | Fiber (g) per serving |
| `tags` | text[] | Recipe tags |
| `image_url` | text | Recipe image |
| `source_url` | text | Original source URL |
| `source_attribution` | text | Attribution text |
| **`cuisine`** | text | Cuisine type (e.g., "Italian", "Mexican") |
| **`difficulty`** | text | Difficulty level (e.g., "easy", "medium", "hard") |
| **`dietary_flags`** | text[] | Dietary info (e.g., ["vegetarian", "gluten-free"]) |
| **`status`** | text | Workflow status: "pending", "approved", "rejected" |
| **`submitted_by`** | uuid | User who submitted (nullable) |
| **`reviewed_by`** | uuid | Admin who reviewed (nullable) |
| **`review_notes`** | text | Admin notes on review |
| `created_at` | timestamptz | Creation timestamp |
| `updated_at` | timestamptz | Last update timestamp |

### `recipes` (Updated)

Added columns to support the copy-on-save model:

| Column | Type | Description |
|--------|------|-------------|
| **`source_public_recipe_id`** | uuid | FK to `public_recipes.id` (nullable) |
| **`is_modified`** | boolean | Whether the user has modified this copy |

## Row Level Security (RLS)

### `public_recipes` Policies

1. **Public Read Access** - Anyone can read approved recipes
   ```sql
   CREATE POLICY "Anyone can view approved public recipes"
   ON public_recipes FOR SELECT
   USING (status = 'approved');
   ```

2. **Admin Full Access** - Admins can manage all public recipes
   - Uses `is_admin()` function (to be implemented based on your admin logic)

### `recipes` Policies

Existing policies remain unchanged - users can only access their own recipes.

## AI Integration

The tiered recipe access model supports AI meal planning:

1. **Primary Source**: User's Recipe Bank (`recipes` table)
   - AI prioritizes recipes the user already has
   - Personalized to user's preferences

2. **Secondary Source**: Public Database (`public_recipes` table)
   - AI can recommend public recipes to fill gaps
   - Recipes are copied to Recipe Bank when used in a plan

## Future Considerations

### RBAC Implementation (TODO)

Role-Based Access Control will be needed for admin functionality. Options to consider:

1. **Simple Approach**: Add `is_admin` boolean column to Supabase `auth.users` metadata
   ```sql
   -- Check admin status in RLS policies
   CREATE FUNCTION is_admin() RETURNS boolean AS $$
     SELECT coalesce(
       (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
       false
     );
   $$ LANGUAGE sql SECURITY DEFINER;
   ```

2. **Supabase Custom Claims**: Use custom JWT claims for role management
   - More scalable for multiple roles
   - Requires edge function or webhook to set claims

3. **Roles Table**: Create a `user_roles` table for fine-grained permissions
   - Most flexible but more complex
   - Good if we need multiple permission levels later

For a single-owner app, option 1 (metadata flag) is likely sufficient. Set `is_admin: true` in your user's metadata via the Supabase dashboard.

### Admin Dashboard
- View pending submissions
- Approve/reject with notes
- Edit before publishing

### Recipe Submission Flow
1. User submits a recipe from their Recipe Bank
2. Status set to "pending"
3. Admin reviews and approves/rejects
4. On approval, recipe becomes visible to all users

### Sync Features
- "Update from original" for saved recipes
- Show "modified" badge on changed recipes
- Diff view showing user's changes

## Migration Files

1. `create_public_recipes_table` - Creates the `public_recipes` table with all fields
2. `add_source_tracking_to_recipes` - Adds `source_public_recipe_id` and `is_modified` to `recipes`
