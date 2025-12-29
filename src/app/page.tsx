import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { logoutAction } from "@/server/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, LogOut, Utensils, Calendar, ShoppingCart, Target } from "lucide-react";

export default async function Home() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 lg:px-10 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-xl font-semibold">Demeter</span>
          </div>
          <form action={logoutAction}>
            <Button variant="ghost" size="sm" type="submit">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-10 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your meal prep overview.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Recipes</CardTitle>
                <CardDescription>Manage your recipe library</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-muted-foreground">0</p>
              <p className="text-sm text-muted-foreground">recipes saved</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-2 rounded-lg bg-accent/20 text-accent-foreground">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Meal Plans</CardTitle>
                <CardDescription>Weekly meal planning</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-muted-foreground">0</p>
              <p className="text-sm text-muted-foreground">active plans</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-2 rounded-lg bg-positive/10 text-positive">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Grocery Lists</CardTitle>
                <CardDescription>Shopping made easy</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-muted-foreground">0</p>
              <p className="text-sm text-muted-foreground">items to buy</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-2 rounded-lg bg-protein/10 text-protein">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Goals</CardTitle>
                <CardDescription>Track your nutrition</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-muted-foreground">--</p>
              <p className="text-sm text-muted-foreground">daily calories</p>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for future content */}
        <div className="mt-8 p-8 rounded-xl border border-dashed border-border text-center">
          <p className="text-muted-foreground">
            Your weekly meal plan and macro overview will appear here.
          </p>
        </div>
      </main>
    </div>
  );
}
