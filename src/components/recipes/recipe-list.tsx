import { RecipeCard } from "./recipe-card";
import { RecipeEmptyState } from "./recipe-empty-state";
import type { RecipeCardData } from "@/types/recipe";

interface RecipeListProps {
  recipes: RecipeCardData[];
}

export function RecipeList({ recipes }: RecipeListProps) {
  if (recipes.length === 0) {
    return <RecipeEmptyState />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
