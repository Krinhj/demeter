"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Save, ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeIngredients } from "./recipe-ingredients";
import { RecipeSteps } from "./recipe-steps";
import { RecipeEquipment } from "./recipe-equipment";
import { RecipeMacros } from "./recipe-macros";
import { RecipeTags } from "./recipe-tags";
import { RecipeImageUpload } from "./recipe-image-upload";
import {
  parseRecipeAction,
  createRecipeAction,
} from "@/server/actions/recipes.actions";
import type { ParsedRecipe } from "@/types/recipe";

export function RecipeParseForm() {
  const router = useRouter();
  const [recipeText, setRecipeText] = useState("");
  const [parsedRecipe, setParsedRecipe] = useState<ParsedRecipe | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, startParsing] = useTransition();
  const [isSaving, startSaving] = useTransition();

  const handleParse = () => {
    setError(null);
    startParsing(async () => {
      const result = await parseRecipeAction({ recipeText });

      if (result.success) {
        setParsedRecipe(result.data);
      } else {
        setError(result.error);
      }
    });
  };

  const handleSave = () => {
    if (!parsedRecipe) return;

    setError(null);
    startSaving(async () => {
      // Include the uploaded image URL when saving
      const recipeWithImage = {
        ...parsedRecipe,
        image_url: imageUrl,
      };
      const result = await createRecipeAction(recipeWithImage);

      if (result.success) {
        router.push(`/recipes/${result.data.id}`);
      } else {
        setError(result.error);
      }
    });
  };

  const handleReset = () => {
    setParsedRecipe(null);
    setImageUrl(null);
    setError(null);
  };

  // Show parsed result
  if (parsedRecipe) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleReset}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to paste
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Recipe
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Parsed recipe preview */}
        <Card>
          <CardHeader>
            <CardTitle>{parsedRecipe.name}</CardTitle>
            {parsedRecipe.description && (
              <p className="text-muted-foreground">{parsedRecipe.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recipe Image */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Recipe Image (optional)</h3>
              <RecipeImageUpload
                currentImageUrl={imageUrl}
                onImageChange={setImageUrl}
              />
            </div>

            {/* Macros */}
            <RecipeMacros
              calories={parsedRecipe.calories}
              protein={parsedRecipe.protein}
              carbs={parsedRecipe.carbs}
              fat={parsedRecipe.fat}
            />

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Servings: {parsedRecipe.servings}</span>
              {parsedRecipe.prep_time_minutes && (
                <span>Prep: {parsedRecipe.prep_time_minutes} min</span>
              )}
              {parsedRecipe.cook_time_minutes && (
                <span>Cook: {parsedRecipe.cook_time_minutes} min</span>
              )}
            </div>

            {/* Tags */}
            <RecipeTags tags={parsedRecipe.tags} />

            {/* Tabs for content */}
            <Tabs defaultValue="ingredients" className="w-full">
              <TabsList>
                <TabsTrigger value="ingredients">
                  Ingredients ({parsedRecipe.ingredients.length})
                </TabsTrigger>
                <TabsTrigger value="steps">
                  Steps ({parsedRecipe.steps.length})
                </TabsTrigger>
                {parsedRecipe.equipment.length > 0 && (
                  <TabsTrigger value="equipment">
                    Equipment ({parsedRecipe.equipment.length})
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="ingredients" className="mt-4">
                <RecipeIngredients
                  ingredients={parsedRecipe.ingredients}
                  servings={parsedRecipe.servings}
                  originalServings={parsedRecipe.servings}
                />
              </TabsContent>
              <TabsContent value="steps" className="mt-4">
                <RecipeSteps steps={parsedRecipe.steps} />
              </TabsContent>
              {parsedRecipe.equipment.length > 0 && (
                <TabsContent value="equipment" className="mt-4">
                  <RecipeEquipment equipment={parsedRecipe.equipment} />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show paste form
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Paste Recipe</h2>
        <p className="text-sm text-muted-foreground">
          Paste a recipe from any source and we&apos;ll use AI to extract the
          ingredients, steps, equipment, and nutrition information.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Textarea */}
      <Textarea
        placeholder="Paste your recipe here...

Example:
Grilled Chicken Breast

Ingredients:
- 2 chicken breasts
- 2 tbsp olive oil
- Salt and pepper to taste

Instructions:
1. Preheat grill to medium-high heat
2. Season chicken with salt and pepper
3. Brush with olive oil
4. Grill for 6-7 minutes per side..."
        value={recipeText}
        onChange={(e) => setRecipeText(e.target.value)}
        className="min-h-[300px] font-mono text-sm"
        disabled={isParsing}
      />

      {/* Character count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{recipeText.length} characters</span>
        <span className={recipeText.length < 50 ? "text-destructive" : ""}>
          {recipeText.length < 50
            ? `${50 - recipeText.length} more characters needed`
            : "Ready to parse"}
        </span>
      </div>

      {/* Parse button */}
      <Button
        onClick={handleParse}
        disabled={isParsing || recipeText.length < 50}
        className="w-full"
        size="lg"
      >
        {isParsing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Parsing with AI...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Parse Recipe
          </>
        )}
      </Button>
    </div>
  );
}
