import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "./_components/login-form";
import { Leaf } from "lucide-react";

export default async function LoginPage() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect("/");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual Panel - Left */}
      <div className="relative hidden lg:flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-accent to-teal-400">
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large circle */}
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          {/* Medium circle */}
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          {/* Small accents */}
          <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-teal-300/20 blur-xl" />
          <div className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full bg-emerald-300/20 blur-xl" />
          {/* Leaf pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="leaf-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10 0 Q15 10 10 20 Q5 10 10 0" fill="currentColor" className="text-white" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Leaf className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight mb-4">Demeter</h1>
          <p className="text-lg text-white/90 max-w-md">
            Your personal meal prep planner. Plan your week, hit your macros, simplify your shopping.
          </p>
        </div>
      </div>

      {/* Form Panel - Right */}
      <div className="flex flex-col items-center justify-center px-6 py-10 lg:px-16 bg-background">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="p-2 rounded-xl bg-primary text-primary-foreground">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="text-2xl font-semibold text-foreground">Demeter</span>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Welcome back</p>
            <h2 className="text-3xl font-semibold tracking-tight">Sign in to Demeter</h2>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
