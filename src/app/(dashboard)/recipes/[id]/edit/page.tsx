import { notFound } from "next/navigation";
import { RecipeEditForm } from "@/components/recipes/recipe-edit-form";
import { getRecipeById } from "@/server/services/recipes-service";

export const dynamic = "force-dynamic";

interface EditRecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params;

  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-10">
      <RecipeEditForm recipe={recipe} />
    </div>
  );
}
