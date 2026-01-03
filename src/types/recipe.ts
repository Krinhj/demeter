import type { Tables } from "@/lib/supabase/database.types";

/**
 * Recipe types for the Demeter meal prep app
 */

// Database row type
export type Recipe = Tables<"recipes">;

// Ingredient structure stored in JSONB
export interface Ingredient {
  name: string;
  quantity: number | null;
  unit: string | null;
  notes: string | null;
}

// Equipment structure stored in JSONB
export interface Equipment {
  name: string;
  notes: string | null;
}

// Parsed recipe from AI (before saving to DB)
export interface ParsedRecipe {
  name: string;
  description: string | null;
  servings: number;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  ingredients: Ingredient[];
  steps: string[];
  equipment: Equipment[];
  tags: string[];
  // Estimated nutrition per serving
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  fiber: number | null;
  // Optional source tracking
  source_url: string | null;
  source_text: string | null;
}

// Recipe with typed JSONB fields
export interface RecipeWithDetails extends Omit<Recipe, "ingredients" | "steps" | "equipment"> {
  ingredients: Ingredient[];
  steps: string[];
  equipment: Equipment[];
}

// Recipe card display data (lighter for lists)
export interface RecipeCardData {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  servings: number;
  is_favorite: boolean;
  tags: string[] | null;
}

// Recipe filter options
export interface RecipeFilters {
  search?: string;
  tags?: string[];
  favorites_only?: boolean;
  sort_by?: "name" | "created_at" | "calories" | "protein";
  sort_order?: "asc" | "desc";
}

// Common ingredient units for normalization
export const COMMON_UNITS = [
  // Volume
  "cup",
  "cups",
  "tbsp",
  "tablespoon",
  "tablespoons",
  "tsp",
  "teaspoon",
  "teaspoons",
  "ml",
  "milliliter",
  "milliliters",
  "l",
  "liter",
  "liters",
  "fl oz",
  "fluid ounce",
  "fluid ounces",
  // Weight
  "g",
  "gram",
  "grams",
  "kg",
  "kilogram",
  "kilograms",
  "oz",
  "ounce",
  "ounces",
  "lb",
  "pound",
  "pounds",
  // Count
  "piece",
  "pieces",
  "whole",
  "clove",
  "cloves",
  "slice",
  "slices",
  "can",
  "cans",
  "package",
  "packages",
  "bunch",
  "bunches",
  "head",
  "heads",
  "sprig",
  "sprigs",
  "pinch",
  "dash",
] as const;

// Common recipe tags
export const COMMON_TAGS = [
  // Meal type
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "dessert",
  // Protein
  "chicken",
  "beef",
  "pork",
  "fish",
  "seafood",
  "vegetarian",
  "vegan",
  // Diet
  "high-protein",
  "low-carb",
  "low-calorie",
  "keto",
  "paleo",
  "gluten-free",
  "dairy-free",
  // Prep style
  "meal-prep",
  "quick",
  "slow-cooker",
  "instant-pot",
  "one-pot",
  "no-cook",
  // Cuisine
  "asian",
  "italian",
  "mexican",
  "mediterranean",
  "american",
  "indian",
] as const;

// Common equipment for inference
export const COMMON_EQUIPMENT = [
  "oven",
  "stovetop",
  "grill",
  "air fryer",
  "instant pot",
  "slow cooker",
  "blender",
  "food processor",
  "mixer",
  "microwave",
  "toaster",
  "skillet",
  "pot",
  "baking sheet",
  "baking dish",
  "cutting board",
  "knife",
  "whisk",
  "spatula",
  "tongs",
  "measuring cups",
  "measuring spoons",
  "mixing bowl",
  "colander",
  "thermometer",
] as const;
