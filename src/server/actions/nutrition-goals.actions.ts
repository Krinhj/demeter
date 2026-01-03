"use server";

import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getNutritionGoals,
  upsertNutritionGoals,
  hasCompletedOnboarding,
} from "@/server/services/nutrition-goals-service";
import {
  createNutritionGoalsSchema,
  updateNutritionGoalsSchema,
  onboardingPreferencesSchema,
  type CreateNutritionGoalsInput,
  type UpdateNutritionGoalsInput,
  type OnboardingPreferencesInput,
} from "./nutrition-goals.schema";
import type { ActionResult } from "./action-result";
import type { NutritionGoals } from "@/types/nutrition";

/**
 * Get current user's nutrition goals
 */
export async function getNutritionGoalsAction(): Promise<ActionResult<NutritionGoals | null>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: {
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        },
      };
    }

    const goals = await getNutritionGoals(user.id);

    return {
      success: true,
      data: goals,
    };
  } catch (error) {
    console.error("Error in getNutritionGoalsAction:", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Failed to fetch nutrition goals",
        code: "FETCH_ERROR",
      },
    };
  }
}

/**
 * Save nutrition goals (create or update)
 */
export async function saveNutritionGoalsAction(
  input: CreateNutritionGoalsInput | UpdateNutritionGoalsInput
): Promise<ActionResult<NutritionGoals>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: {
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        },
      };
    }

    // Validate input
    const validation = createNutritionGoalsSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: {
          message: validation.error.errors[0]?.message || "Invalid input",
          code: "VALIDATION_ERROR",
        },
      };
    }

    const goals = await upsertNutritionGoals(user.id, validation.data);

    revalidateTag("nutrition-goals");
    revalidateTag(`nutrition-goals-${user.id}`);

    return {
      success: true,
      data: goals,
    };
  } catch (error) {
    console.error("Error in saveNutritionGoalsAction:", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Failed to save nutrition goals",
        code: "SAVE_ERROR",
      },
    };
  }
}

/**
 * Save onboarding preferences (initial setup)
 */
export async function saveOnboardingPreferencesAction(
  input: OnboardingPreferencesInput
): Promise<ActionResult<NutritionGoals>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: {
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        },
      };
    }

    // Validate input
    const validation = onboardingPreferencesSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: {
          message: validation.error.errors[0]?.message || "Invalid input",
          code: "VALIDATION_ERROR",
        },
      };
    }

    const goals = await upsertNutritionGoals(user.id, {
      daily_calories: validation.data.dailyCalories,
      protein_min: validation.data.proteinMin,
      protein_max: validation.data.proteinMax,
      carbs_target: validation.data.carbsTarget,
      fat_target: validation.data.fatTarget,
      meals_per_day: validation.data.mealsPerDay,
      meal_repetition_tolerance: validation.data.mealRepetitionTolerance,
      auto_generate_weekly: validation.data.autoGenerateWeekly,
      dietary_preferences: validation.data.dietaryPreferences,
      exclusions: validation.data.exclusions,
    });

    revalidateTag("nutrition-goals");
    revalidateTag(`nutrition-goals-${user.id}`);

    return {
      success: true,
      data: goals,
    };
  } catch (error) {
    console.error("Error in saveOnboardingPreferencesAction:", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Failed to save onboarding preferences",
        code: "SAVE_ERROR",
      },
    };
  }
}

/**
 * Check if user has completed onboarding
 */
export async function checkOnboardingStatusAction(): Promise<ActionResult<{ completed: boolean }>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: {
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        },
      };
    }

    const completed = await hasCompletedOnboarding(user.id);

    return {
      success: true,
      data: { completed },
    };
  } catch (error) {
    console.error("Error in checkOnboardingStatusAction:", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Failed to check onboarding status",
        code: "CHECK_ERROR",
      },
    };
  }
}
