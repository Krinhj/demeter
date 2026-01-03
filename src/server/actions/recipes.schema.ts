import { z } from "zod";

/**
 * Zod schemas for recipe validation
 */

// Ingredient schema
export const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
  notes: z.string().nullable(),
});

// Equipment schema
export const equipmentSchema = z.object({
  name: z.string().min(1, "Equipment name is required"),
  notes: z.string().nullable(),
});

// Schema for parsing recipe text
export const parseRecipeInputSchema = z.object({
  recipeText: z
    .string()
    .min(50, "Recipe text must be at least 50 characters")
    .max(50000, "Recipe text is too long"),
});

// Schema for creating a recipe
export const createRecipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required").max(200, "Name is too long"),
  description: z.string().max(1000, "Description is too long").nullable(),
  servings: z.number().min(1, "Servings must be at least 1").max(100, "Servings is too high"),
  prep_time_minutes: z.number().min(0).max(1440).nullable(),
  cook_time_minutes: z.number().min(0).max(1440).nullable(),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
  steps: z.array(z.string().min(1)).min(1, "At least one step is required"),
  equipment: z.array(equipmentSchema).default([]),
  tags: z.array(z.string()).default([]),
  calories: z.number().min(0).nullable(),
  protein: z.number().min(0).nullable(),
  carbs: z.number().min(0).nullable(),
  fat: z.number().min(0).nullable(),
  fiber: z.number().min(0).nullable(),
  image_url: z.string().url().nullable().optional(),
  source_url: z.string().url().nullable().optional(),
  source_text: z.string().nullable().optional(),
});

// Schema for updating a recipe
export const updateRecipeSchema = createRecipeSchema.partial().extend({
  id: z.string().uuid("Invalid recipe ID"),
});

// Schema for deleting a recipe
export const deleteRecipeSchema = z.object({
  id: z.string().uuid("Invalid recipe ID"),
});

// Schema for toggling favorite
export const toggleFavoriteSchema = z.object({
  id: z.string().uuid("Invalid recipe ID"),
});

// Schema for filtering recipes
export const recipeFiltersSchema = z.object({
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  favorites_only: z.boolean().optional(),
  sort_by: z.enum(["name", "created_at", "calories", "protein"]).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});

// Types exported from schemas
export type ParseRecipeInput = z.infer<typeof parseRecipeInputSchema>;
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
export type DeleteRecipeInput = z.infer<typeof deleteRecipeSchema>;
export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>;
export type RecipeFiltersInput = z.infer<typeof recipeFiltersSchema>;
