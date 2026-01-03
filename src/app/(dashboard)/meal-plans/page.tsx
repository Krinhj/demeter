import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Calendar, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getMealPlans } from "@/server/services/meal-plans-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDayLabel, type DayOfWeek } from "@/types/meal-plan";

export default async function MealPlansPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

  const mealPlans = await getMealPlans(user.id, { limit: 20 });

  return (
    <div className="space-y-6 px-6 py-8 lg:px-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meal Plans</h1>
          <p className="mt-2 text-muted-foreground">
            Create and manage your weekly meal plans
          </p>
        </div>
        <Button asChild>
          <Link href="/meal-plans/new">
            <Plus className="mr-2 h-4 w-4" />
            New Plan
          </Link>
        </Button>
      </div>

      {mealPlans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No meal plans yet</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Get started by creating your first meal plan for the week
            </p>
            <Button asChild>
              <Link href="/meal-plans/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Meal Plan
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {mealPlans.map((plan) => {
            const startDate = new Date(plan.week_start);
            const endDate = new Date(plan.week_end);
            const isUpcoming = startDate > new Date();
            const isCurrent =
              startDate <= new Date() && endDate >= new Date();

            return (
              <Link key={plan.id} href={`/meal-plans/${plan.id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle>{plan.name}</CardTitle>
                          {plan.is_active && (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Active
                            </Badge>
                          )}
                          {isCurrent && !plan.is_active && (
                            <Badge variant="secondary">Current Week</Badge>
                          )}
                          {isUpcoming && (
                            <Badge variant="outline">Upcoming</Badge>
                          )}
                        </div>
                        <CardDescription className="mt-1">
                          {getDayLabel((startDate.getDay() === 0 ? 6 : startDate.getDay() - 1) as DayOfWeek)},{" "}
                          {startDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          -{" "}
                          {endDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {plan.total_calories !== null && (
                        <div>
                          <span className="font-semibold text-foreground">
                            {plan.total_calories.toLocaleString()}
                          </span>{" "}
                          cal/week
                        </div>
                      )}
                      {plan.total_protein !== null && (
                        <div>
                          <span className="font-semibold text-foreground">
                            {Math.round(plan.total_protein)}g
                          </span>{" "}
                          protein
                        </div>
                      )}
                      {plan.total_carbs !== null && (
                        <div>
                          <span className="font-semibold text-foreground">
                            {Math.round(plan.total_carbs)}g
                          </span>{" "}
                          carbs
                        </div>
                      )}
                      {plan.total_fat !== null && (
                        <div>
                          <span className="font-semibold text-foreground">
                            {Math.round(plan.total_fat)}g
                          </span>{" "}
                          fat
                        </div>
                      )}
                    </div>
                    {plan.notes && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {plan.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
