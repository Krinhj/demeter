import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MoreVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getMealPlanById, calculateDailyMacros } from "@/server/services/meal-plans-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MealPlanGrid } from "@/components/meal-plans/meal-plan-grid";
import { getDayLabel, type DayOfWeek } from "@/types/meal-plan";

interface MealPlanPageProps {
  params: {
    id: string;
  };
}

export default async function MealPlanPage({ params }: MealPlanPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

  const mealPlan = await getMealPlanById(user.id, params.id);

  if (!mealPlan) {
    notFound();
  }

  const dailyMacros = await calculateDailyMacros(params.id);

  const startDate = new Date(mealPlan.week_start);
  const endDate = new Date(mealPlan.week_end);

  return (
    <div className="space-y-6 px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/meal-plans">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{mealPlan.name}</h1>
              {mealPlan.is_active && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </Badge>
              )}
            </div>
            <p className="mt-2 text-muted-foreground">
              {getDayLabel((startDate.getDay() === 0 ? 6 : startDate.getDay() - 1) as DayOfWeek)},{" "}
              {startDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}{" "}
              -{" "}
              {endDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Total Calories</div>
          <div className="text-2xl font-bold mt-1">
            {mealPlan.total_calories?.toLocaleString() || 0}
          </div>
          <div className="text-xs text-muted-foreground mt-1">per week</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Protein</div>
          <div className="text-2xl font-bold mt-1 text-[hsl(var(--color-protein))]">
            {Math.round(mealPlan.total_protein || 0)}g
          </div>
          <div className="text-xs text-muted-foreground mt-1">per week</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Carbs</div>
          <div className="text-2xl font-bold mt-1 text-[hsl(var(--color-carbs))]">
            {Math.round(mealPlan.total_carbs || 0)}g
          </div>
          <div className="text-xs text-muted-foreground mt-1">per week</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Fat</div>
          <div className="text-2xl font-bold mt-1 text-[hsl(var(--color-fat))]">
            {Math.round(mealPlan.total_fat || 0)}g
          </div>
          <div className="text-xs text-muted-foreground mt-1">per week</div>
        </div>
      </div>

      {/* Meal Plan Grid */}
      <MealPlanGrid mealPlan={mealPlan} dailyMacros={dailyMacros} />

      {/* Notes */}
      {mealPlan.notes && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-semibold mb-2">Notes</h3>
          <p className="text-sm text-muted-foreground">{mealPlan.notes}</p>
        </div>
      )}
    </div>
  );
}
