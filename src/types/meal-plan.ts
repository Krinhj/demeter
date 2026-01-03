import type { Tables, TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

// Database types
export type MealPlan = Tables<"meal_plans">;
export type MealPlanInsert = TablesInsert<"meal_plans">;
export type MealPlanUpdate = TablesUpdate<"meal_plans">;

export type MealPlanEntry = Tables<"meal_plan_entries">;
export type MealPlanEntryInsert = TablesInsert<"meal_plan_entries">;
export type MealPlanEntryUpdate = TablesUpdate<"meal_plan_entries">;

// Meal types (breakfast, lunch, dinner, snack)
export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

// Days of week (0 = Monday, 6 = Sunday)
export const DAYS_OF_WEEK = [
  { value: 0, label: "Monday", short: "Mon" },
  { value: 1, label: "Tuesday", short: "Tue" },
  { value: 2, label: "Wednesday", short: "Wed" },
  { value: 3, label: "Thursday", short: "Thu" },
  { value: 4, label: "Friday", short: "Fri" },
  { value: 5, label: "Saturday", short: "Sat" },
  { value: 6, label: "Sunday", short: "Sun" },
] as const;

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Meal plan with entries (for detail views)
export interface MealPlanWithEntries extends MealPlan {
  entries: MealPlanEntry[];
}

// Entry with recipe details
export interface MealPlanEntryWithRecipe extends MealPlanEntry {
  recipe?: {
    id: string;
    name: string;
    image_url: string | null;
    prep_time_minutes: number | null;
    cook_time_minutes: number | null;
  };
}

// Create meal plan input (for forms)
export interface CreateMealPlanInput {
  name: string;
  week_start: string; // ISO date string
  week_end: string; // ISO date string
  notes?: string;
  entries: CreateMealPlanEntryInput[];
}

// Create meal plan entry input
export interface CreateMealPlanEntryInput {
  day_of_week: DayOfWeek;
  meal_type: MealType;
  recipe_id?: string;
  servings: number;
  custom_meal_name?: string;
  notes?: string;
}

// Update meal plan entry input
export interface UpdateMealPlanEntryInput {
  recipe_id?: string | null;
  servings?: number;
  custom_meal_name?: string | null;
  notes?: string | null;
}

// Meal plan filters
export interface MealPlanFilters {
  is_active?: boolean;
  week_start_after?: string;
  week_start_before?: string;
  limit?: number;
  offset?: number;
}

// Macro totals for a meal plan
export interface MealPlanMacros {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
}

// Daily macro totals
export interface DailyMacros extends MealPlanMacros {
  day_of_week: DayOfWeek;
}

// Utility function to get week start/end from a date
export function getWeekRange(date: Date): { start: string; end: string } {
  const dayOfWeek = date.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday

  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    start: monday.toISOString().split("T")[0] || "",
    end: sunday.toISOString().split("T")[0] || "",
  };
}

// Get current week range
export function getCurrentWeekRange(): { start: string; end: string } {
  return getWeekRange(new Date());
}

// Format meal type for display
export function formatMealType(mealType: MealType): string {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
}

// Get day label from day of week number
export function getDayLabel(dayOfWeek: DayOfWeek, short = false): string {
  const day = DAYS_OF_WEEK.find((d) => d.value === dayOfWeek);
  return day ? (short ? day.short : day.label) : "";
}
