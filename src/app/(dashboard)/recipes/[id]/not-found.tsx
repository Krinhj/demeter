import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecipeNotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-semibold">Recipe not found</h2>
      <p className="mt-2 text-muted-foreground">
        The recipe you&apos;re looking for doesn&apos;t exist or has been deleted.
      </p>
      <Button asChild className="mt-6">
        <Link href="/recipes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recipes
        </Link>
      </Button>
    </div>
  );
}
