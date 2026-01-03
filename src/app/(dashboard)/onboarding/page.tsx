import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasCompletedOnboarding } from "@/server/services/nutrition-goals-service";
import { OnboardingForm } from "@/components/nutrition/onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

  // Check if user has already completed onboarding
  const completed = await hasCompletedOnboarding(user.id);
  if (completed) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Welcome to Demeter
          </h1>
          <p className="mt-2 text-muted-foreground">
            Let&apos;s set up your nutrition goals and preferences
          </p>
        </div>

        <OnboardingForm />
      </div>
    </div>
  );
}
