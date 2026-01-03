import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getNutritionGoals } from "@/server/services/nutrition-goals-service";
import { GoalsForm } from "@/components/nutrition/goals-form";

export default async function GoalsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

  const goals = await getNutritionGoals(user.id);

  // If no goals exist, redirect to onboarding
  if (!goals) {
    redirect("/onboarding");
  }

  return (
    <div className="space-y-6 px-6 py-8 lg:px-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nutrition Goals</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your daily nutrition targets and preferences
        </p>
      </div>

      <GoalsForm initialGoals={goals} />
    </div>
  );
}
