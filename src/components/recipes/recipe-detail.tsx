"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Users, Heart, Trash2, Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RecipeIngredients } from "./recipe-ingredients";
import { RecipeSteps } from "./recipe-steps";
import { RecipeEquipment } from "./recipe-equipment";
import { RecipeMacros } from "./recipe-macros";
import { RecipeTags } from "./recipe-tags";
import {
  toggleFavoriteAction,
  deleteRecipeAction,
} from "@/server/actions/recipes.actions";
import { cn } from "@/lib/utils";
import type { RecipeWithDetails } from "@/types/recipe";

interface RecipeDetailProps {
  recipe: RecipeWithDetails;
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(recipe.is_favorite);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalTime =
    (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  const handleToggleFavorite = async () => {
    setIsToggling(true);
    const result = await toggleFavoriteAction({ id: recipe.id });

    if (result.success) {
      setIsFavorite(result.data.is_favorite);
    }
    setIsToggling(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteRecipeAction({ id: recipe.id });

    if (result.success) {
      router.push("/recipes");
    } else {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" asChild>
          <Link href="/recipes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleFavorite}
            disabled={isToggling}
            className={cn(isFavorite && "text-red-500")}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </Button>

          <Button variant="outline" asChild>
            <Link href={`/recipes/${recipe.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{recipe.name}&quot;? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Recipe Card */}
      <Card>
        {/* Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-6xl">🍽️</span>
            </div>
          )}
        </div>

        <CardContent className="space-y-6 p-6">
          {/* Title and description */}
          <div>
            <h1 className="text-2xl font-bold">{recipe.name}</h1>
            {recipe.description && (
              <p className="mt-2 text-muted-foreground">{recipe.description}</p>
            )}
          </div>

          {/* Macros */}
          <RecipeMacros
            calories={recipe.calories}
            protein={recipe.protein}
            carbs={recipe.carbs}
            fat={recipe.fat}
          />

          {/* Meta info */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{recipe.servings} servings</span>
            </div>
            {recipe.prep_time_minutes && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Prep: {recipe.prep_time_minutes} min</span>
              </div>
            )}
            {recipe.cook_time_minutes && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Cook: {recipe.cook_time_minutes} min</span>
              </div>
            )}
            {totalTime > 0 && (
              <div className="flex items-center gap-2 font-medium">
                <Clock className="h-4 w-4 text-primary" />
                <span>Total: {totalTime} min</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <RecipeTags tags={recipe.tags} />

          {/* Tabs for content */}
          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList>
              <TabsTrigger value="ingredients">
                Ingredients ({recipe.ingredients.length})
              </TabsTrigger>
              <TabsTrigger value="steps">
                Steps ({recipe.steps.length})
              </TabsTrigger>
              {recipe.equipment && recipe.equipment.length > 0 && (
                <TabsTrigger value="equipment">
                  Equipment ({recipe.equipment.length})
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="ingredients" className="mt-4">
              <RecipeIngredients
                ingredients={recipe.ingredients}
                servings={recipe.servings}
                originalServings={recipe.servings}
              />
            </TabsContent>
            <TabsContent value="steps" className="mt-4">
              <RecipeSteps steps={recipe.steps} />
            </TabsContent>
            {recipe.equipment && recipe.equipment.length > 0 && (
              <TabsContent value="equipment" className="mt-4">
                <RecipeEquipment equipment={recipe.equipment} />
              </TabsContent>
            )}
          </Tabs>

          {/* Source */}
          {recipe.source_url && (
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Source:{" "}
                <a
                  href={recipe.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {new URL(recipe.source_url).hostname}
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
