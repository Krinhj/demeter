import { createClient } from "@/lib/supabase/server";
import type { RecipeFilters, RecipeCardData, RecipeWithDetails, Ingredient, Equipment } from "@/types/recipe";
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

/**
 * Get all recipes with optional filters
 */
export async function getRecipes(filters: RecipeFilters = {}): Promise<RecipeCardData[]> {
  const supabase = await createClient();

  let query = supabase
    .from("recipes")
    .select(`
      id,
      name,
      description,
      image_url,
      calories,
      protein,
      carbs,
      fat,
      prep_time_minutes,
      cook_time_minutes,
      servings,
      is_favorite,
      tags
    `);

  // Apply search filter
  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  // Apply favorites filter
  if (filters.favorites_only) {
    query = query.eq("is_favorite", true);
  }

  // Apply tags filter
  if (filters.tags && filters.tags.length > 0) {
    query = query.contains("tags", filters.tags);
  }

  // Apply sorting
  const sortBy = filters.sort_by || "created_at";
  const sortOrder = filters.sort_order || "desc";
  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Failed to fetch recipes");
  }

  return data || [];
}

/**
 * Get a single recipe by ID with full details
 */
export async function getRecipeById(id: string): Promise<RecipeWithDetails | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching recipe:", error);
    throw new Error("Failed to fetch recipe");
  }

  // Transform JSONB fields to typed arrays
  return {
    ...data,
    ingredients: (data.ingredients as Ingredient[]) || [],
    steps: (data.steps as string[]) || [],
    equipment: (data.equipment as Equipment[]) || [],
  };
}

/**
 * Create a new recipe
 */
export async function createRecipe(
  recipe: Omit<TablesInsert<"recipes">, "id" | "created_at" | "updated_at">
): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipes")
    .insert(recipe)
    .select("id")
    .single();

  if (error) {
    console.error("Error creating recipe:", error);
    throw new Error("Failed to create recipe");
  }

  return data.id;
}

/**
 * Update an existing recipe
 */
export async function updateRecipe(
  id: string,
  updates: TablesUpdate<"recipes">
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("recipes")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error updating recipe:", error);
    throw new Error("Failed to update recipe");
  }
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting recipe:", error);
    throw new Error("Failed to delete recipe");
  }
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(id: string): Promise<boolean> {
  const supabase = await createClient();

  // Get current status
  const { data: current, error: fetchError } = await supabase
    .from("recipes")
    .select("is_favorite")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching recipe:", fetchError);
    throw new Error("Failed to fetch recipe");
  }

  const newStatus = !current.is_favorite;

  // Update status
  const { error: updateError } = await supabase
    .from("recipes")
    .update({ is_favorite: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (updateError) {
    console.error("Error updating favorite:", updateError);
    throw new Error("Failed to update favorite");
  }

  return newStatus;
}

/**
 * Get all unique tags from recipes
 */
export async function getAllTags(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipes")
    .select("tags");

  if (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Failed to fetch tags");
  }

  // Flatten and dedupe tags
  const allTags = new Set<string>();
  data?.forEach((recipe) => {
    recipe.tags?.forEach((tag: string) => allTags.add(tag));
  });

  return Array.from(allTags).sort();
}

/**
 * Get recipe count
 */
export async function getRecipeCount(): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("recipes")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error counting recipes:", error);
    throw new Error("Failed to count recipes");
  }

  return count || 0;
}
