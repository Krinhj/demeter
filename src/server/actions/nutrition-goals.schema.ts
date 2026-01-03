import { z } from "zod";

// Meal repetition tolerance enum
export const mealRepetitionToleranceSchema = z.enum(["low", "medium", "high"]);

// Create nutrition goals schema
export const createNutritionGoalsSchema = z.object({
  dailyCalories: z.number().int().min(1000).max(10000),
  proteinMin: z.number().int().min(0).max(500),
  proteinMax: z.number().int().min(0).max(500),
  carbsTarget: z.number().int().min(0).max(1000),
  fatTarget: z.number().int().min(0).max(500),
  mealsPerDay: z.number().int().min(1).max(10).default(3),
  mealRepetitionTolerance: mealRepetitionToleranceSchema.default("medium"),
  autoGenerateWeekly: z.boolean().default(false),
  dietaryPreferences: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
}).refine((data) => data.proteinMin <= data.proteinMax, {
  message: "Minimum protein must be less than or equal to maximum protein",
  path: ["proteinMax"],
});

// Update nutrition goals schema
export const updateNutritionGoalsSchema = createNutritionGoalsSchema.partial();

// Onboarding preferences schema (subset for initial onboarding)
export const onboardingPreferencesSchema = z.object({
  dailyCalories: z.number().int().min(1000).max(10000),
  proteinMin: z.number().int().min(0).max(500),
  proteinMax: z.number().int().min(0).max(500),
  carbsTarget: z.number().int().min(0).max(1000),
  fatTarget: z.number().int().min(0).max(500),
  mealsPerDay: z.number().int().min(1).max(10),
  mealRepetitionTolerance: mealRepetitionToleranceSchema,
  autoGenerateWeekly: z.boolean(),
  dietaryPreferences: z.array(z.string()),
  exclusions: z.array(z.string()),
}).refine((data) => data.proteinMin <= data.proteinMax, {
  message: "Minimum protein must be less than or equal to maximum protein",
  path: ["proteinMax"],
});

// Type exports
export type CreateNutritionGoalsInput = z.infer<typeof createNutritionGoalsSchema>;
export type UpdateNutritionGoalsInput = z.infer<typeof updateNutritionGoalsSchema>;
export type OnboardingPreferencesInput = z.infer<typeof onboardingPreferencesSchema>;
