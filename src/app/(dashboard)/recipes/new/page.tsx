import { RecipeParseForm } from "@/components/recipes/recipe-parse-form";

export const dynamic = "force-dynamic";

export default function NewRecipePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6 lg:p-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Add Recipe</h1>
        <p className="text-muted-foreground">
          Paste a recipe and let AI do the heavy lifting
        </p>
      </div>

      {/* Parse Form */}
      <RecipeParseForm />
    </div>
  );
}
