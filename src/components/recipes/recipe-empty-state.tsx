import Link from "next/link";
import { Plus, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecipeEmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Utensils className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No recipes yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Get started by adding your first recipe. Paste a recipe from anywhere
        and we&apos;ll parse it for you.
      </p>
      <Button asChild className="mt-6">
        <Link href="/recipes/new">
          <Plus className="mr-2 h-4 w-4" />
          Add Recipe
        </Link>
      </Button>
    </div>
  );
}
