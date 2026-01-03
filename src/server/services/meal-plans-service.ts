import { createClient } from "@/lib/supabase/server";
import type {
  MealPlan,
  MealPlanWithEntries,
  MealPlanEntry,
  MealPlanFilters,
  CreateMealPlanInput,
  UpdateMealPlanEntryInput,
  MealPlanMacros,
  DailyMacros,
} from "@/types/meal-plan";

/**
 * Get meal plans for a user with optional filters
 */
export async function getMealPlans(
  userId: string,
  filters?: MealPlanFilters
): Promise<MealPlan[]> {
  const supabase = await createClient();

  let query = supabase
    .from("meal_plans")
    .select("*")
    .eq("user_id", userId)
    .order("week_start", { ascending: false });

  if (filters?.is_active !== undefined) {
    query = query.eq("is_active", filters.is_active);
  }

  if (filters?.week_start_after) {
    query = query.gte("week_start", filters.week_start_after);
  }

  if (filters?.week_start_before) {
    query = query.lte("week_start", filters.week_start_before);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching meal plans:", error);
    throw new Error("Failed to fetch meal plans");
  }

  return data;
}

/**
 * Get active meal plan for a user
 */
export async function getActiveMealPlan(userId: string): Promise<MealPlanWithEntries | null> {
  const supabase = await createClient();

  const { data: mealPlan, error: planError } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single();

  if (planError) {
    if (planError.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching active meal plan:", planError);
    throw new Error("Failed to fetch active meal plan");
  }

  const { data: entries, error: entriesError } = await supabase
    .from("meal_plan_entries")
    .select("*")
    .eq("meal_plan_id", mealPlan.id)
    .order("day_of_week", { ascending: true })
    .order("meal_type", { ascending: true });

  if (entriesError) {
    console.error("Error fetching meal plan entries:", entriesError);
    throw new Error("Failed to fetch meal plan entries");
  }

  return {
    ...mealPlan,
    entries: entries || [],
  };
}

/**
 * Get meal plan by ID with entries
 */
export async function getMealPlanById(
  userId: string,
  mealPlanId: string
): Promise<MealPlanWithEntries | null> {
  const supabase = await createClient();

  const { data: mealPlan, error: planError } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("id", mealPlanId)
    .eq("user_id", userId)
    .single();

  if (planError) {
    if (planError.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching meal plan:", planError);
    throw new Error("Failed to fetch meal plan");
  }

  const { data: entries, error: entriesError } = await supabase
    .from("meal_plan_entries")
    .select("*")
    .eq("meal_plan_id", mealPlanId)
    .order("day_of_week", { ascending: true })
    .order("meal_type", { ascending: true });

  if (entriesError) {
    console.error("Error fetching meal plan entries:", entriesError);
    throw new Error("Failed to fetch meal plan entries");
  }

  return {
    ...mealPlan,
    entries: entries || [],
  };
}

/**
 * Create a new meal plan with entries
 */
export async function createMealPlan(
  userId: string,
  input: CreateMealPlanInput
): Promise<MealPlan> {
  const supabase = await createClient();

  // Create the meal plan
  const { data: mealPlan, error: planError } = await supabase
    .from("meal_plans")
    .insert({
      user_id: userId,
      name: input.name,
      week_start: input.week_start,
      week_end: input.week_end,
      notes: input.notes,
      is_active: false,
    })
    .select()
    .single();

  if (planError) {
    console.error("Error creating meal plan:", planError);
    throw new Error("Failed to create meal plan");
  }

  // Create entries if provided
  if (input.entries.length > 0) {
    const entriesData = input.entries.map((entry) => ({
      meal_plan_id: mealPlan.id,
      day_of_week: entry.day_of_week,
      meal_type: entry.meal_type,
      recipe_id: entry.recipe_id,
      servings: entry.servings,
      custom_meal_name: entry.custom_meal_name,
      notes: entry.notes,
    }));

    const { error: entriesError } = await supabase
      .from("meal_plan_entries")
      .insert(entriesData);

    if (entriesError) {
      console.error("Error creating meal plan entries:", entriesError);
      // Rollback: delete the meal plan
      await supabase.from("meal_plans").delete().eq("id", mealPlan.id);
      throw new Error("Failed to create meal plan entries");
    }
  }

  // Calculate and update totals
  await updateMealPlanTotals(mealPlan.id);

  // Fetch updated meal plan with totals
  const { data: updatedPlan, error: fetchError } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("id", mealPlan.id)
    .single();

  if (fetchError || !updatedPlan) {
    return mealPlan;
  }

  return updatedPlan;
}

/**
 * Update meal plan entry
 */
export async function updateMealPlanEntry(
  userId: string,
  entryId: string,
  updates: UpdateMealPlanEntryInput
): Promise<MealPlanEntry> {
  const supabase = await createClient();

  // Verify ownership through meal plan
  const { data: entry, error: verifyError } = await supabase
    .from("meal_plan_entries")
    .select("meal_plan_id, meal_plans!inner(user_id)")
    .eq("id", entryId)
    .single();

  if (verifyError || !entry) {
    throw new Error("Meal plan entry not found");
  }

  const mealPlanUserId = (entry.meal_plans as unknown as { user_id: string }).user_id;
  if (mealPlanUserId !== userId) {
    throw new Error("Unauthorized");
  }

  const { data: updated, error: updateError } = await supabase
    .from("meal_plan_entries")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", entryId)
    .select()
    .single();

  if (updateError) {
    console.error("Error updating meal plan entry:", updateError);
    throw new Error("Failed to update meal plan entry");
  }

  // Update meal plan totals
  await updateMealPlanTotals(updated.meal_plan_id);

  return updated;
}

/**
 * Delete meal plan
 */
export async function deleteMealPlan(userId: string, mealPlanId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("meal_plans")
    .delete()
    .eq("id", mealPlanId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting meal plan:", error);
    throw new Error("Failed to delete meal plan");
  }
}

/**
 * Set active meal plan (deactivates all others)
 */
export async function setActiveMealPlan(userId: string, mealPlanId: string): Promise<void> {
  const supabase = await createClient();

  // First, deactivate all meal plans
  const { error: deactivateError } = await supabase
    .from("meal_plans")
    .update({ is_active: false })
    .eq("user_id", userId);

  if (deactivateError) {
    console.error("Error deactivating meal plans:", deactivateError);
    throw new Error("Failed to deactivate meal plans");
  }

  // Then activate the selected one
  const { error: activateError } = await supabase
    .from("meal_plans")
    .update({ is_active: true })
    .eq("id", mealPlanId)
    .eq("user_id", userId);

  if (activateError) {
    console.error("Error activating meal plan:", activateError);
    throw new Error("Failed to activate meal plan");
  }
}

/**
 * Calculate and update meal plan totals
 */
async function updateMealPlanTotals(mealPlanId: string): Promise<void> {
  const supabase = await createClient();

  const { data: entries, error: entriesError } = await supabase
    .from("meal_plan_entries")
    .select("calories, protein, carbs, fat")
    .eq("meal_plan_id", mealPlanId);

  if (entriesError || !entries) {
    console.error("Error fetching entries for totals:", entriesError);
    return;
  }

  const totals = entries.reduce(
    (acc, entry) => ({
      total_calories: acc.total_calories + (entry.calories || 0),
      total_protein: acc.total_protein + (entry.protein || 0),
      total_carbs: acc.total_carbs + (entry.carbs || 0),
      total_fat: acc.total_fat + (entry.fat || 0),
    }),
    { total_calories: 0, total_protein: 0, total_carbs: 0, total_fat: 0 }
  );

  await supabase
    .from("meal_plans")
    .update(totals)
    .eq("id", mealPlanId);
}

/**
 * Calculate meal plan macros
 */
export async function calculateMealPlanMacros(
  mealPlanId: string
): Promise<MealPlanMacros> {
  const supabase = await createClient();

  const { data: entries, error } = await supabase
    .from("meal_plan_entries")
    .select("calories, protein, carbs, fat")
    .eq("meal_plan_id", mealPlanId);

  if (error || !entries) {
    return {
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fat: 0,
    };
  }

  return entries.reduce(
    (acc, entry) => ({
      total_calories: acc.total_calories + (entry.calories || 0),
      total_protein: acc.total_protein + (entry.protein || 0),
      total_carbs: acc.total_carbs + (entry.carbs || 0),
      total_fat: acc.total_fat + (entry.fat || 0),
    }),
    { total_calories: 0, total_protein: 0, total_carbs: 0, total_fat: 0 }
  );
}

/**
 * Calculate daily macros for a meal plan
 */
export async function calculateDailyMacros(
  mealPlanId: string
): Promise<DailyMacros[]> {
  const supabase = await createClient();

  const { data: entries, error } = await supabase
    .from("meal_plan_entries")
    .select("day_of_week, calories, protein, carbs, fat")
    .eq("meal_plan_id", mealPlanId);

  if (error || !entries) {
    return [];
  }

  const dailyTotals = new Map<number, DailyMacros>();

  for (const entry of entries) {
    const existing = dailyTotals.get(entry.day_of_week) || {
      day_of_week: entry.day_of_week,
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fat: 0,
    };

    dailyTotals.set(entry.day_of_week, {
      day_of_week: entry.day_of_week,
      total_calories: existing.total_calories + (entry.calories || 0),
      total_protein: existing.total_protein + (entry.protein || 0),
      total_carbs: existing.total_carbs + (entry.carbs || 0),
      total_fat: existing.total_fat + (entry.fat || 0),
    });
  }

  return Array.from(dailyTotals.values()).sort((a, b) => a.day_of_week - b.day_of_week);
}
