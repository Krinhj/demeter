"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Heart, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecipeMacros } from "./recipe-macros";
import { RecipeTags } from "./recipe-tags";
import { toggleFavoriteAction } from "@/server/actions/recipes.actions";
import { cn } from "@/lib/utils";
import type { RecipeCardData } from "@/types/recipe";

interface RecipeCardProps {
  recipe: RecipeCardData;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [isFavorite, setIsFavorite] = useState(recipe.is_favorite);
  const [isToggling, setIsToggling] = useState(false);

  const totalTime =
    (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsToggling(true);
    const result = await toggleFavoriteAction({ id: recipe.id });

    if (result.success) {
      setIsFavorite(result.data.is_favorite);
    }
    setIsToggling(false);
  };

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="group h-full overflow-hidden pt-0 transition-all hover:border-primary/50 hover:shadow-md">
        {/* Image placeholder */}
        <div className="relative aspect-video bg-muted">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-4xl">🍽️</span>
            </div>
          )}

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm",
              isFavorite && "text-red-500"
            )}
            onClick={handleToggleFavorite}
            disabled={isToggling}
          >
            <Heart
              className={cn("h-4 w-4", isFavorite && "fill-current")}
            />
          </Button>
        </div>

        <CardContent className="space-y-3 p-4">
          {/* Title */}
          <h3 className="line-clamp-2 font-medium leading-tight group-hover:text-primary">
            {recipe.name}
          </h3>

          {/* Description */}
          {recipe.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {recipe.description}
            </p>
          )}

          {/* Macros */}
          <RecipeMacros
            calories={recipe.calories}
            protein={recipe.protein}
            carbs={recipe.carbs}
            fat={recipe.fat}
            size="sm"
          />

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {totalTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{totalTime} min</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>

          {/* Tags */}
          <RecipeTags tags={recipe.tags} limit={3} />
        </CardContent>
      </Card>
    </Link>
  );
}
