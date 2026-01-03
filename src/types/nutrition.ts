import type { Tables, TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

// Database types
export type NutritionGoals = Tables<"nutrition_goals">;
export type NutritionGoalsInsert = TablesInsert<"nutrition_goals">;
export type NutritionGoalsUpdate = TablesUpdate<"nutrition_goals">;

// Enums
export type MealRepetitionTolerance = "low" | "medium" | "high";

// Extended types with computed fields
export interface NutritionGoalsWithStats extends NutritionGoals {
  totalDailyCalories: number;
  proteinRange: { min: number; max: number };
}

// User preferences (for onboarding)
export interface UserPreferences {
  dailyCalories: number;
  proteinMin: number;
  proteinMax: number;
  carbsTarget: number;
  fatTarget: number;
  mealsPerDay: number;
  mealRepetitionTolerance: MealRepetitionTolerance;
  autoGenerateWeekly: boolean;
  dietaryPreferences: string[];
  exclusions: string[];
}

// Onboarding form data
export interface OnboardingFormData {
  step: number;
  // Step 1: Nutrition targets
  dailyCalories: number;
  proteinMin: number;
  proteinMax: number;
  carbsTarget: number;
  fatTarget: number;
  // Step 2: Meal settings
  mealsPerDay: number;
  // Step 3: Repetition tolerance
  mealRepetitionTolerance: MealRepetitionTolerance;
  autoGenerateWeekly: boolean;
  // Step 4: Dietary preferences
  dietaryPreferences: string[];
  exclusions: string[];
}

// Common dietary preferences
export const DIETARY_PREFERENCES = [
  "High Protein",
  "Low Carb",
  "Keto",
  "Paleo",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Meal Prep Friendly",
  "Quick Meals",
] as const;

// Common exclusions
export const COMMON_EXCLUSIONS = [
  "Beef",
  "Pork",
  "Chicken",
  "Fish",
  "Shellfish",
  "Eggs",
  "Dairy",
  "Gluten",
  "Nuts",
  "Soy",
  "Nightshades",
] as const;

// Repetition tolerance descriptions
export const REPETITION_TOLERANCE_OPTIONS = [
  {
    value: "low" as MealRepetitionTolerance,
    label: "Very Comfortable",
    description: "I'm happy eating the same meals all week (3-5 recipes needed)",
    recipesNeeded: "3-5 recipes",
  },
  {
    value: "medium" as MealRepetitionTolerance,
    label: "Moderate Variety",
    description: "I like some repetition but want options (7-10 recipes needed)",
    recipesNeeded: "7-10 recipes",
  },
  {
    value: "high" as MealRepetitionTolerance,
    label: "High Variety",
    description: "I prefer different meals each day (14+ recipes needed)",
    recipesNeeded: "14+ recipes",
  },
] as const;

// Default values
export const DEFAULT_NUTRITION_GOALS: Partial<UserPreferences> = {
  dailyCalories: 2000,
  proteinMin: 120,
  proteinMax: 180,
  carbsTarget: 200,
  fatTarget: 70,
  mealsPerDay: 3,
  mealRepetitionTolerance: "medium",
  autoGenerateWeekly: false,
  dietaryPreferences: [],
  exclusions: [],
};
