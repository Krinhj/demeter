"use server";

import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseRecipe } from "@/lib/ai/recipe-parser";
import {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleFavorite as toggleFavoriteService,
} from "@/server/services/recipes-service";
import {
  parseRecipeInputSchema,
  createRecipeSchema,
  updateRecipeSchema,
  deleteRecipeSchema,
  toggleFavoriteSchema,
} from "./recipes.schema";
import type { ActionResult } from "@/lib/action-result";
import type { ParsedRecipe } from "@/types/recipe";

/**
 * Parse recipe text using AI
 */
export async function parseRecipeAction(
  input: { recipeText: string }
): Promise<ActionResult<ParsedRecipe>> {
  // Validate input
  const validated = parseRecipeInputSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  // Parse with AI
  const result = await parseRecipe(validated.data.recipeText);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.recipe };
}

/**
 * Create a new recipe from parsed data
 */
export async function createRecipeAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  // Get current user
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be logged in to create recipes" };
  }

  // Validate input
  const validated = createRecipeSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    const id = await createRecipe({
      user_id: user.id,
      name: validated.data.name,
      description: validated.data.description,
      servings: validated.data.servings,
      prep_time_minutes: validated.data.prep_time_minutes,
      cook_time_minutes: validated.data.cook_time_minutes,
      ingredients: validated.data.ingredients,
      steps: validated.data.steps,
      equipment: validated.data.equipment,
      tags: validated.data.tags,
      calories: validated.data.calories,
      protein: validated.data.protein,
      carbs: validated.data.carbs,
      fat: validated.data.fat,
      fiber: validated.data.fiber,
      image_url: validated.data.image_url ?? null,
      source_url: validated.data.source_url ?? null,
      source_text: validated.data.source_text ?? null,
      is_favorite: false,
    });

    revalidateTag("recipes");

    return { success: true, data: { id } };
  } catch (error) {
    console.error("Error creating recipe:", error);
    return { success: false, error: "Failed to create recipe" };
  }
}

/**
 * Update an existing recipe
 */
export async function updateRecipeAction(
  input: unknown
): Promise<ActionResult<void>> {
  // Get current user
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be logged in to update recipes" };
  }

  // Validate input
  const validated = updateRecipeSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const { id, ...updates } = validated.data;

  try {
    await updateRecipe(id, updates);
    revalidateTag("recipes");
    revalidateTag(`recipe-${id}`);

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error updating recipe:", error);
    return { success: false, error: "Failed to update recipe" };
  }
}

/**
 * Delete a recipe
 */
export async function deleteRecipeAction(
  input: { id: string }
): Promise<ActionResult<void>> {
  // Get current user
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be logged in to delete recipes" };
  }

  // Validate input
  const validated = deleteRecipeSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    await deleteRecipe(validated.data.id);
    revalidateTag("recipes");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return { success: false, error: "Failed to delete recipe" };
  }
}

/**
 * Toggle recipe favorite status
 */
export async function toggleFavoriteAction(
  input: { id: string }
): Promise<ActionResult<{ is_favorite: boolean }>> {
  // Get current user
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be logged in" };
  }

  // Validate input
  const validated = toggleFavoriteSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    const isFavorite = await toggleFavoriteService(validated.data.id);
    revalidateTag("recipes");
    revalidateTag(`recipe-${validated.data.id}`);

    return { success: true, data: { is_favorite: isFavorite } };
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { success: false, error: "Failed to update favorite status" };
  }
}

/**
 * Parse and save a recipe in one action
 */
export async function parseAndSaveRecipeAction(
  input: { recipeText: string }
): Promise<ActionResult<{ id: string; recipe: ParsedRecipe }>> {
  // First parse the recipe
  const parseResult = await parseRecipeAction(input);

  if (!parseResult.success) {
    return parseResult;
  }

  // Then save it
  const createResult = await createRecipeAction(parseResult.data);

  if (!createResult.success) {
    return createResult;
  }

  return {
    success: true,
    data: {
      id: createResult.data.id,
      recipe: parseResult.data,
    },
  };
}
