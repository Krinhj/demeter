import { z } from "zod";
import type { DayOfWeek } from "@/types/meal-plan";

// Meal type schema
export const mealTypeSchema = z.enum(["breakfast", "lunch", "dinner", "snack"]);

// Day of week schema (0-6, Monday-Sunday)
export const dayOfWeekSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]) as z.ZodType<DayOfWeek>;

// Create meal plan entry schema
export const createMealPlanEntrySchema = z.object({
  day_of_week: dayOfWeekSchema,
  meal_type: mealTypeSchema,
  recipe_id: z.string().uuid().optional(),
  servings: z.number().int().min(1).max(20).default(1),
  custom_meal_name: z.string().optional(),
  notes: z.string().optional(),
});

// Create meal plan schema
export const createMealPlanSchema = z.object({
  name: z.string().min(1).max(255),
  week_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  week_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
  entries: z.array(createMealPlanEntrySchema).min(1),
}).refine(
  (data) => {
    const start = new Date(data.week_start);
    const end = new Date(data.week_end);
    return start < end;
  },
  {
    message: "Week start must be before week end",
    path: ["week_end"],
  }
);

// Update meal plan schema
export const updateMealPlanSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  notes: z.string().optional(),
  is_active: z.boolean().optional(),
});

// Update meal plan entry schema
export const updateMealPlanEntrySchema = z.object({
  id: z.string().uuid(),
  recipe_id: z.string().uuid().nullable().optional(),
  servings: z.number().int().min(1).max(20).optional(),
  custom_meal_name: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// Delete meal plan schema
export const deleteMealPlanSchema = z.object({
  id: z.string().uuid(),
});

// Set active meal plan schema
export const setActiveMealPlanSchema = z.object({
  id: z.string().uuid(),
});

// Get meal plan schema
export const getMealPlanSchema = z.object({
  id: z.string().uuid(),
});

// Meal plan filters schema
export const mealPlanFiltersSchema = z.object({
  is_active: z.boolean().optional(),
  week_start_after: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  week_start_before: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
});

// Type exports - use inferred types from schemas
export type UpdateMealPlanInput = z.infer<typeof updateMealPlanSchema>;
export type DeleteMealPlanInput = z.infer<typeof deleteMealPlanSchema>;
export type SetActiveMealPlanInput = z.infer<typeof setActiveMealPlanSchema>;
export type GetMealPlanInput = z.infer<typeof getMealPlanSchema>;
export type MealPlanFiltersInput = z.infer<typeof mealPlanFiltersSchema>;

// For CreateMealPlanInput and UpdateMealPlanEntryInput, re-export from types
// to maintain consistency with the DayOfWeek and MealType literal unions
export type {
  CreateMealPlanInput,
  CreateMealPlanEntryInput,
  UpdateMealPlanEntryInput,
} from "@/types/meal-plan";
