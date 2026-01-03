import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { RECIPE_PARSER_SYSTEM_PROMPT } from "./prompts";
import type { ParsedRecipe, Ingredient, Equipment } from "@/types/recipe";

// Zod schema for AI structured output
const ingredientSchema = z.object({
  name: z.string().describe("The ingredient name"),
  quantity: z.number().nullable().describe("Numeric quantity (e.g., 2, 0.5)"),
  unit: z.string().nullable().describe("Unit of measurement (e.g., cups, tbsp, lb)"),
  notes: z.string().nullable().describe("Preparation notes (e.g., minced, diced)"),
});

const equipmentSchema = z.object({
  name: z.string().describe("Equipment name (e.g., Oven, Blender)"),
  notes: z.string().nullable().describe("Optional notes about the equipment"),
});

const parsedRecipeSchema = z.object({
  name: z.string().describe("Recipe name/title"),
  description: z.string().nullable().describe("Brief description of the recipe"),
  servings: z.number().min(1).describe("Number of servings"),
  prep_time_minutes: z.number().nullable().describe("Prep time in minutes"),
  cook_time_minutes: z.number().nullable().describe("Cook time in minutes"),
  ingredients: z.array(ingredientSchema).describe("List of ingredients"),
  steps: z.array(z.string()).describe("Cooking steps/directions"),
  equipment: z.array(equipmentSchema).describe("Required equipment (explicit + inferred)"),
  tags: z.array(z.string()).describe("Suggested tags for categorization"),
  calories: z.number().nullable().describe("Estimated calories per serving"),
  protein: z.number().nullable().describe("Estimated protein (g) per serving"),
  carbs: z.number().nullable().describe("Estimated carbs (g) per serving"),
  fat: z.number().nullable().describe("Estimated fat (g) per serving"),
  fiber: z.number().nullable().describe("Estimated fiber (g) per serving"),
});

export type ParseRecipeResult =
  | { success: true; recipe: ParsedRecipe }
  | { success: false; error: string };

/**
 * Parse raw recipe text into structured data using GPT-4o
 */
export async function parseRecipe(recipeText: string): Promise<ParseRecipeResult> {
  if (!recipeText.trim()) {
    return { success: false, error: "Recipe text cannot be empty" };
  }

  if (recipeText.length < 50) {
    return { success: false, error: "Recipe text is too short. Please provide a complete recipe." };
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: parsedRecipeSchema,
      system: RECIPE_PARSER_SYSTEM_PROMPT,
      prompt: `Parse the following recipe text into structured data:\n\n${recipeText}`,
    });

    // Transform to our ParsedRecipe type
    const recipe: ParsedRecipe = {
      name: object.name,
      description: object.description,
      servings: object.servings,
      prep_time_minutes: object.prep_time_minutes,
      cook_time_minutes: object.cook_time_minutes,
      ingredients: object.ingredients as Ingredient[],
      steps: object.steps,
      equipment: object.equipment as Equipment[],
      tags: object.tags,
      calories: object.calories,
      protein: object.protein,
      carbs: object.carbs,
      fat: object.fat,
      fiber: object.fiber,
      source_url: null,
      source_text: recipeText,
    };

    return { success: true, recipe };
  } catch (error) {
    console.error("Recipe parsing error:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return { success: false, error: "OpenAI API key is not configured" };
      }
      if (error.message.includes("rate limit")) {
        return { success: false, error: "Rate limit exceeded. Please try again later." };
      }
      return { success: false, error: `Failed to parse recipe: ${error.message}` };
    }

    return { success: false, error: "An unexpected error occurred while parsing the recipe" };
  }
}

/**
 * Validate a parsed recipe has required fields
 */
export function validateParsedRecipe(recipe: ParsedRecipe): string[] {
  const errors: string[] = [];

  if (!recipe.name?.trim()) {
    errors.push("Recipe name is required");
  }

  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    errors.push("At least one ingredient is required");
  }

  if (!recipe.steps || recipe.steps.length === 0) {
    errors.push("At least one cooking step is required");
  }

  if (recipe.servings < 1) {
    errors.push("Servings must be at least 1");
  }

  return errors;
}
