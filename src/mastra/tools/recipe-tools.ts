import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/**
 * Tool to search and list recipes from the user's Recipe Bank
 */
export const searchRecipesTool = createTool({
  id: "search-recipes",
  description:
    "Search the user's Recipe Bank for recipes. Can filter by name, tags, favorites, and dietary preferences. Use this to find recipes the user has saved.",
  inputSchema: z.object({
    search: z
      .string()
      .optional()
      .describe("Search term to filter recipes by name"),
    tags: z
      .array(z.string())
      .optional()
      .describe("Filter by tags like 'high-protein', 'vegetarian', 'quick', etc."),
    favoritesOnly: z
      .boolean()
      .optional()
      .describe("If true, only return favorite recipes"),
    limit: z
      .number()
      .optional()
      .default(10)
      .describe("Maximum number of recipes to return"),
  }),
  execute: async ({ context }) => {
    const { search, tags, favoritesOnly, limit } = context;
    const supabase = await createClient();

    let query = supabase.from("recipes").select(`
      id,
      name,
      description,
      calories,
      protein,
      carbs,
      fat,
      prep_time_minutes,
      cook_time_minutes,
      servings,
      is_favorite,
      tags
    `);

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (favoritesOnly) {
      query = query.eq("is_favorite", true);
    }

    if (tags && tags.length > 0) {
      query = query.contains("tags", tags);
    }

    query = query.order("created_at", { ascending: false }).limit(limit || 10);

    const { data, error } = await query;

    if (error) {
      return { error: "Failed to search recipes", details: error.message };
    }

    if (!data || data.length === 0) {
      return { message: "No recipes found matching your criteria", recipes: [] };
    }

    return {
      message: `Found ${data.length} recipe(s)`,
      recipes: data.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        macros: {
          calories: r.calories,
          protein: r.protein,
          carbs: r.carbs,
          fat: r.fat,
        },
        prepTime: r.prep_time_minutes,
        cookTime: r.cook_time_minutes,
        totalTime: (r.prep_time_minutes || 0) + (r.cook_time_minutes || 0),
        servings: r.servings,
        isFavorite: r.is_favorite,
        tags: r.tags,
      })),
    };
  },
});

/**
 * Tool to get detailed information about a specific recipe
 */
export const getRecipeDetailsTool = createTool({
  id: "get-recipe-details",
  description:
    "Get full details of a specific recipe including ingredients, steps, and equipment. Use this when the user asks about a specific recipe or wants to see how to make something.",
  inputSchema: z.object({
    recipeId: z.string().describe("The ID of the recipe to get details for"),
  }),
  execute: async ({ context }) => {
    const { recipeId } = context;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", recipeId)
      .single();

    if (error) {
      return { error: "Recipe not found", details: error.message };
    }

    return {
      recipe: {
        id: data.id,
        name: data.name,
        description: data.description,
        macros: {
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fat: data.fat,
        },
        prepTime: data.prep_time_minutes,
        cookTime: data.cook_time_minutes,
        totalTime: (data.prep_time_minutes || 0) + (data.cook_time_minutes || 0),
        servings: data.servings,
        ingredients: data.ingredients,
        steps: data.steps,
        equipment: data.equipment,
        tips: data.tips,
        tags: data.tags,
        isFavorite: data.is_favorite,
        source: data.source_url,
      },
    };
  },
});

/**
 * Tool to get recipe statistics and summary
 */
export const getRecipeStatsTool = createTool({
  id: "get-recipe-stats",
  description:
    "Get statistics about the user's Recipe Bank including total count, favorite count, and available tags. Use this to give the user an overview of their recipe collection.",
  inputSchema: z.object({}),
  execute: async () => {
    const supabase = await createClient();

    // Get total count
    const { count: totalCount } = await supabase
      .from("recipes")
      .select("*", { count: "exact", head: true });

    // Get favorites count
    const { count: favoritesCount } = await supabase
      .from("recipes")
      .select("*", { count: "exact", head: true })
      .eq("is_favorite", true);

    // Get all tags
    const { data: tagsData } = await supabase.from("recipes").select("tags");

    const allTags = new Set<string>();
    tagsData?.forEach((recipe) => {
      recipe.tags?.forEach((tag: string) => allTags.add(tag));
    });

    return {
      totalRecipes: totalCount || 0,
      favoriteRecipes: favoritesCount || 0,
      availableTags: Array.from(allTags).sort(),
    };
  },
});

/**
 * Tool to find recipes by nutritional criteria
 */
export const findRecipesByNutritionTool = createTool({
  id: "find-recipes-by-nutrition",
  description:
    "Find recipes that meet specific nutritional criteria like minimum protein, maximum calories, etc. Use this for meal planning based on macro goals.",
  inputSchema: z.object({
    minProtein: z
      .number()
      .optional()
      .describe("Minimum protein in grams per serving"),
    maxCalories: z
      .number()
      .optional()
      .describe("Maximum calories per serving"),
    minCalories: z
      .number()
      .optional()
      .describe("Minimum calories per serving"),
    maxCarbs: z
      .number()
      .optional()
      .describe("Maximum carbs in grams per serving"),
    maxFat: z
      .number()
      .optional()
      .describe("Maximum fat in grams per serving"),
    limit: z
      .number()
      .optional()
      .default(10)
      .describe("Maximum number of recipes to return"),
  }),
  execute: async ({ context }) => {
    const { minProtein, maxCalories, minCalories, maxCarbs, maxFat, limit } = context;
    const supabase = await createClient();

    let query = supabase.from("recipes").select(`
      id,
      name,
      description,
      calories,
      protein,
      carbs,
      fat,
      prep_time_minutes,
      cook_time_minutes,
      servings,
      tags
    `);

    if (minProtein) {
      query = query.gte("protein", minProtein);
    }
    if (maxCalories) {
      query = query.lte("calories", maxCalories);
    }
    if (minCalories) {
      query = query.gte("calories", minCalories);
    }
    if (maxCarbs) {
      query = query.lte("carbs", maxCarbs);
    }
    if (maxFat) {
      query = query.lte("fat", maxFat);
    }

    query = query.order("protein", { ascending: false }).limit(limit || 10);

    const { data, error } = await query;

    if (error) {
      return { error: "Failed to search recipes", details: error.message };
    }

    if (!data || data.length === 0) {
      return {
        message: "No recipes found matching your nutritional criteria",
        recipes: [],
      };
    }

    return {
      message: `Found ${data.length} recipe(s) matching your criteria`,
      recipes: data.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        macros: {
          calories: r.calories,
          protein: r.protein,
          carbs: r.carbs,
          fat: r.fat,
        },
        prepTime: r.prep_time_minutes,
        cookTime: r.cook_time_minutes,
        servings: r.servings,
        tags: r.tags,
      })),
    };
  },
});

export const recipeTools = {
  searchRecipes: searchRecipesTool,
  getRecipeDetails: getRecipeDetailsTool,
  getRecipeStats: getRecipeStatsTool,
  findRecipesByNutrition: findRecipesByNutritionTool,
};
