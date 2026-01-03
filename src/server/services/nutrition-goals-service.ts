import { createClient } from "@/lib/supabase/server";
import type { NutritionGoals, NutritionGoalsInsert, NutritionGoalsUpdate } from "@/types/nutrition";

/**
 * Get nutrition goals for a user
 */
export async function getNutritionGoals(userId: string): Promise<NutritionGoals | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nutrition_goals")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching nutrition goals:", error);
    throw new Error("Failed to fetch nutrition goals");
  }

  return data;
}

/**
 * Create nutrition goals for a user
 */
export async function createNutritionGoals(
  userId: string,
  goals: Omit<NutritionGoalsInsert, "user_id" | "id" | "created_at" | "updated_at">
): Promise<NutritionGoals> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nutrition_goals")
    .insert({
      ...goals,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating nutrition goals:", error);
    throw new Error("Failed to create nutrition goals");
  }

  return data;
}

/**
 * Update nutrition goals for a user
 */
export async function updateNutritionGoals(
  userId: string,
  updates: NutritionGoalsUpdate
): Promise<NutritionGoals> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nutrition_goals")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating nutrition goals:", error);
    throw new Error("Failed to update nutrition goals");
  }

  return data;
}

/**
 * Check if user has completed onboarding (has nutrition goals set)
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const goals = await getNutritionGoals(userId);
  return goals !== null;
}

/**
 * Upsert nutrition goals (create if doesn't exist, update if exists)
 */
export async function upsertNutritionGoals(
  userId: string,
  goals: Omit<NutritionGoalsInsert, "user_id" | "id" | "created_at" | "updated_at">
): Promise<NutritionGoals> {
  const existing = await getNutritionGoals(userId);

  if (existing) {
    return await updateNutritionGoals(userId, goals);
  } else {
    return await createNutritionGoals(userId, goals);
  }
}
