"use server";

import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getMealPlans as getMealPlansService,
  getActiveMealPlan as getActiveMealPlanService,
  getMealPlanById as getMealPlanByIdService,
  createMealPlan as createMealPlanService,
  updateMealPlanEntry as updateMealPlanEntryService,
  deleteMealPlan as deleteMealPlanService,
  setActiveMealPlan as setActiveMealPlanService,
} from "@/server/services/meal-plans-service";
import {
  createMealPlanSchema,
  updateMealPlanEntrySchema,
  deleteMealPlanSchema,
  setActiveMealPlanSchema,
  getMealPlanSchema,
  mealPlanFiltersSchema,
  type CreateMealPlanInput,
  type UpdateMealPlanEntryInput,
  type DeleteMealPlanInput,
  type SetActiveMealPlanInput,
  type GetMealPlanInput,
  type MealPlanFiltersInput,
} from "./meal-plans.schema";
import type { ActionResult } from "@/lib/action-result";
import type { MealPlan, MealPlanWithEntries, MealPlanEntry } from "@/types/meal-plan";

/**
 * Get all meal plans for current user
 */
export async function getMealPlansAction(
  filters?: MealPlanFiltersInput
): Promise<ActionResult<MealPlan[]>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Validate filters if provided
    let validatedFilters = filters;
    if (filters) {
      const validation = mealPlanFiltersSchema.safeParse(filters);
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.errors[0]?.message || "Invalid filters",
        };
      }
      validatedFilters = validation.data;
    }

    const mealPlans = await getMealPlansService(user.id, validatedFilters);

    return {
      success: true,
      data: mealPlans,
    };
  } catch (error) {
    console.error("Error in getMealPlansAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch meal plans",
    };
  }
}

/**
 * Get active meal plan for current user
 */
export async function getActiveMealPlanAction(): Promise<ActionResult<MealPlanWithEntries | null>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const mealPlan = await getActiveMealPlanService(user.id);

    return {
      success: true,
      data: mealPlan,
    };
  } catch (error) {
    console.error("Error in getActiveMealPlanAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch active meal plan",
    };
  }
}

/**
 * Get meal plan by ID
 */
export async function getMealPlanAction(
  input: GetMealPlanInput
): Promise<ActionResult<MealPlanWithEntries | null>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const validation = getMealPlanSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0]?.message || "Invalid input",
      };
    }

    const mealPlan = await getMealPlanByIdService(user.id, validation.data.id);

    return {
      success: true,
      data: mealPlan,
    };
  } catch (error) {
    console.error("Error in getMealPlanAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch meal plan",
    };
  }
}

/**
 * Create a new meal plan
 */
export async function createMealPlanAction(
  input: CreateMealPlanInput
): Promise<ActionResult<MealPlan>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const validation = createMealPlanSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0]?.message || "Invalid input",
      };
    }

    const mealPlan = await createMealPlanService(user.id, validation.data);

    revalidateTag("meal-plans", "max");
    revalidateTag(`meal-plans-${user.id}`, "max");

    return {
      success: true,
      data: mealPlan,
    };
  } catch (error) {
    console.error("Error in createMealPlanAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create meal plan",
    };
  }
}

/**
 * Update meal plan entry
 */
export async function updateMealPlanEntryAction(
  input: UpdateMealPlanEntryInput
): Promise<ActionResult<MealPlanEntry>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const validation = updateMealPlanEntrySchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0]?.message || "Invalid input",
      };
    }

    const { id, ...updates } = validation.data;
    const entry = await updateMealPlanEntryService(user.id, id, updates);

    revalidateTag("meal-plans", "max");
    revalidateTag(`meal-plans-${user.id}`, "max");
    revalidateTag(`meal-plan-${entry.meal_plan_id}`, "max");

    return {
      success: true,
      data: entry,
    };
  } catch (error) {
    console.error("Error in updateMealPlanEntryAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update meal plan entry",
    };
  }
}

/**
 * Delete meal plan
 */
export async function deleteMealPlanAction(
  input: DeleteMealPlanInput
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const validation = deleteMealPlanSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0]?.message || "Invalid input",
      };
    }

    await deleteMealPlanService(user.id, validation.data.id);

    revalidateTag("meal-plans", "max");
    revalidateTag(`meal-plans-${user.id}`, "max");
    revalidateTag(`meal-plan-${validation.data.id}`, "max");

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error("Error in deleteMealPlanAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete meal plan",
    };
  }
}

/**
 * Set active meal plan
 */
export async function setActiveMealPlanAction(
  input: SetActiveMealPlanInput
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const validation = setActiveMealPlanSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0]?.message || "Invalid input",
      };
    }

    await setActiveMealPlanService(user.id, validation.data.id);

    revalidateTag("meal-plans", "max");
    revalidateTag(`meal-plans-${user.id}`, "max");

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error("Error in setActiveMealPlanAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to set active meal plan",
    };
  }
}
