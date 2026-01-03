import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Beef, Wheat, Droplets } from "lucide-react";
import { getRecipes } from "@/server/services/recipes-service";

// Mock data for demonstration
const mockNutritionGoals = {
  calories: { current: 1850, target: 2200 },
  protein: { current: 145, target: 180 },
  carbs: { current: 180, target: 220 },
  fat: { current: 65, target: 75 },
};

const mockWeeklyPlan = [
  { day: "Mon", meals: { breakfast: "Oatmeal & Berries", lunch: "Chicken Salad", dinner: "Salmon & Veggies" } },
  { day: "Tue", meals: { breakfast: "Eggs & Toast", lunch: "Turkey Wrap", dinner: "Beef Stir Fry" } },
  { day: "Wed", meals: { breakfast: "Smoothie Bowl", lunch: "Quinoa Bowl", dinner: "Grilled Chicken" } },
  { day: "Thu", meals: { breakfast: "Greek Yogurt", lunch: "Tuna Salad", dinner: "Pasta Primavera" } },
  { day: "Fri", meals: { breakfast: "Pancakes", lunch: "Chicken Soup", dinner: "Fish Tacos" } },
  { day: "Sat", meals: { breakfast: "Avocado Toast", lunch: "Buddha Bowl", dinner: "Steak & Potatoes" } },
  { day: "Sun", meals: { breakfast: "Eggs Benedict", lunch: "Meal Prep", dinner: "Roast Chicken" } },
];

export default async function DashboardPage() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });

  // Fetch recent recipes from database
  const recentRecipes = await getRecipes({ sort_by: "created_at", sort_order: "desc" });
  const recentRecipesDisplay = recentRecipes.slice(0, 3);

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Your weekly meal prep at a glance
        </p>
      </div>

      {/* Macro Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Flame className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockNutritionGoals.calories.current}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}/ {mockNutritionGoals.calories.target}
              </span>
            </div>
            <Progress
              value={(mockNutritionGoals.calories.current / mockNutritionGoals.calories.target) * 100}
              className="mt-2 h-2"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {mockNutritionGoals.calories.target - mockNutritionGoals.calories.current} remaining today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
            <Beef className="h-4 w-4 text-protein" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockNutritionGoals.protein.current}g
              <span className="text-sm font-normal text-muted-foreground">
                {" "}/ {mockNutritionGoals.protein.target}g
              </span>
            </div>
            <Progress
              value={(mockNutritionGoals.protein.current / mockNutritionGoals.protein.target) * 100}
              className="mt-2 h-2 [&>div]:bg-protein"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {mockNutritionGoals.protein.target - mockNutritionGoals.protein.current}g remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Carbs</CardTitle>
            <Wheat className="h-4 w-4 text-carbs" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockNutritionGoals.carbs.current}g
              <span className="text-sm font-normal text-muted-foreground">
                {" "}/ {mockNutritionGoals.carbs.target}g
              </span>
            </div>
            <Progress
              value={(mockNutritionGoals.carbs.current / mockNutritionGoals.carbs.target) * 100}
              className="mt-2 h-2 [&>div]:bg-carbs"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {mockNutritionGoals.carbs.target - mockNutritionGoals.carbs.current}g remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fat</CardTitle>
            <Droplets className="h-4 w-4 text-fat" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockNutritionGoals.fat.current}g
              <span className="text-sm font-normal text-muted-foreground">
                {" "}/ {mockNutritionGoals.fat.target}g
              </span>
            </div>
            <Progress
              value={(mockNutritionGoals.fat.current / mockNutritionGoals.fat.target) * 100}
              className="mt-2 h-2 [&>div]:bg-fat"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {mockNutritionGoals.fat.target - mockNutritionGoals.fat.current}g remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Meal Plan Grid */}
      <Card>
        <CardHeader>
          <CardTitle>This Week&apos;s Meal Plan</CardTitle>
          <CardDescription>Your planned meals for the week</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop: 7-column grid, Mobile: Vertical stack */}
          <div className="hidden md:grid md:grid-cols-7 gap-2">
            {mockWeeklyPlan.map((day) => (
              <div
                key={day.day}
                className={`rounded-lg border p-3 ${
                  day.day === today.slice(0, 3)
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <div className={`text-sm font-semibold mb-2 ${
                  day.day === today.slice(0, 3) ? "text-primary" : ""
                }`}>
                  {day.day}
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">Breakfast</p>
                    <p className="text-xs truncate">{day.meals.breakfast}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">Lunch</p>
                    <p className="text-xs truncate">{day.meals.lunch}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">Dinner</p>
                    <p className="text-xs truncate">{day.meals.dinner}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Vertical list */}
          <div className="md:hidden space-y-3">
            {mockWeeklyPlan.map((day) => (
              <div
                key={day.day}
                className={`rounded-lg border p-4 ${
                  day.day === today.slice(0, 3)
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <div className={`text-base font-semibold mb-3 ${
                  day.day === today.slice(0, 3) ? "text-primary" : ""
                }`}>
                  {day.day}
                </div>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <p className="text-xs uppercase text-muted-foreground w-20">Breakfast</p>
                    <p className="text-sm flex-1">{day.meals.breakfast}</p>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <p className="text-xs uppercase text-muted-foreground w-20">Lunch</p>
                    <p className="text-sm flex-1">{day.meals.lunch}</p>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <p className="text-xs uppercase text-muted-foreground w-20">Dinner</p>
                    <p className="text-sm flex-1">{day.meals.dinner}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row: Recent Recipes + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Recipes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Recipes</CardTitle>
            <CardDescription>Your most recently added recipes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecipesDisplay.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="font-medium">{recipe.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {recipe.calories} cal · {recipe.protein}g protein
                    </p>
                  </div>
                </div>
              ))}
              {recentRecipesDisplay.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recipes yet. Add your first recipe to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Grocery List Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Grocery List</CardTitle>
            <CardDescription>Items you need to buy this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Chicken Breast</span>
                <span className="text-muted-foreground">2 lbs</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Salmon Fillets</span>
                <span className="text-muted-foreground">4 pieces</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Quinoa</span>
                <span className="text-muted-foreground">1 bag</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Mixed Vegetables</span>
                <span className="text-muted-foreground">3 bags</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Greek Yogurt</span>
                <span className="text-muted-foreground">2 containers</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                12 items total · 3 categories
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
