import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RecipeList } from "@/components/recipes/recipe-list";
import { RecipeFilters } from "@/components/recipes/recipe-filters";
import { getRecipes, getAllTags } from "@/server/services/recipes-service";
import type { RecipeFilters as RecipeFiltersType } from "@/types/recipe";

export const dynamic = "force-dynamic";

interface RecipesPageProps {
  searchParams: Promise<{
    search?: string;
    tags?: string;
    favorites?: string;
    sort?: string;
  }>;
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams;

  const filters: RecipeFiltersType = {
    search: params.search,
    tags: params.tags?.split(",").filter(Boolean),
    favorites_only: params.favorites === "true",
    sort_by: (params.sort as RecipeFiltersType["sort_by"]) || "created_at",
    sort_order: "desc",
  };

  const [recipes, allTags] = await Promise.all([
    getRecipes(filters),
    getAllTags(),
  ]);

  return (
    <div className="space-y-8 p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Recipes</h1>
          <p className="text-muted-foreground">
            {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} in your
            library
          </p>
        </div>
        <Button asChild>
          <Link href="/recipes/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Recipe
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <RecipeFilters allTags={allTags} />
      </Suspense>

      {/* Recipe Grid */}
      <RecipeList recipes={recipes} />
    </div>
  );
}
