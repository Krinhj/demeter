"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { saveOnboardingPreferencesAction } from "@/server/actions/nutrition-goals.actions";
import {
  DEFAULT_NUTRITION_GOALS,
  DIETARY_PREFERENCES,
  COMMON_EXCLUSIONS,
  REPETITION_TOLERANCE_OPTIONS,
  type OnboardingFormData,
} from "@/types/nutrition";
import { useToast } from "@/hooks/use-toast";

const TOTAL_STEPS = 4;

export function OnboardingForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Omit<OnboardingFormData, "step">>({
    dailyCalories: DEFAULT_NUTRITION_GOALS.dailyCalories!,
    proteinMin: DEFAULT_NUTRITION_GOALS.proteinMin!,
    proteinMax: DEFAULT_NUTRITION_GOALS.proteinMax!,
    carbsTarget: DEFAULT_NUTRITION_GOALS.carbsTarget!,
    fatTarget: DEFAULT_NUTRITION_GOALS.fatTarget!,
    mealsPerDay: DEFAULT_NUTRITION_GOALS.mealsPerDay!,
    mealRepetitionTolerance: DEFAULT_NUTRITION_GOALS.mealRepetitionTolerance!,
    autoGenerateWeekly: DEFAULT_NUTRITION_GOALS.autoGenerateWeekly!,
    dietaryPreferences: DEFAULT_NUTRITION_GOALS.dietaryPreferences!,
    exclusions: DEFAULT_NUTRITION_GOALS.exclusions!,
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const result = await saveOnboardingPreferencesAction({
      dailyCalories: formData.dailyCalories,
      proteinMin: formData.proteinMin,
      proteinMax: formData.proteinMax,
      carbsTarget: formData.carbsTarget,
      fatTarget: formData.fatTarget,
      mealsPerDay: formData.mealsPerDay,
      mealRepetitionTolerance: formData.mealRepetitionTolerance,
      autoGenerateWeekly: formData.autoGenerateWeekly,
      dietaryPreferences: formData.dietaryPreferences,
      exclusions: formData.exclusions,
    });

    if (result.success) {
      toast({
        title: "Onboarding complete!",
        description: "Your preferences have been saved.",
      });
      router.push("/");
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Nutrition Targets</h2>
              <p className="text-muted-foreground mt-1">
                Set your daily calorie and macro goals
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="dailyCalories">Daily Calories</Label>
                <Input
                  id="dailyCalories"
                  type="number"
                  value={formData.dailyCalories}
                  onChange={(e) => updateFormData({ dailyCalories: parseInt(e.target.value) || 0 })}
                  min={1000}
                  max={10000}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Total calories per day (1000-10000)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="proteinMin">Protein Min (g)</Label>
                  <Input
                    id="proteinMin"
                    type="number"
                    value={formData.proteinMin}
                    onChange={(e) => updateFormData({ proteinMin: parseInt(e.target.value) || 0 })}
                    min={0}
                    max={500}
                  />
                </div>
                <div>
                  <Label htmlFor="proteinMax">Protein Max (g)</Label>
                  <Input
                    id="proteinMax"
                    type="number"
                    value={formData.proteinMax}
                    onChange={(e) => updateFormData({ proteinMax: parseInt(e.target.value) || 0 })}
                    min={0}
                    max={500}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="carbsTarget">Carbs Target (g)</Label>
                  <Input
                    id="carbsTarget"
                    type="number"
                    value={formData.carbsTarget}
                    onChange={(e) => updateFormData({ carbsTarget: parseInt(e.target.value) || 0 })}
                    min={0}
                    max={1000}
                  />
                </div>
                <div>
                  <Label htmlFor="fatTarget">Fat Target (g)</Label>
                  <Input
                    id="fatTarget"
                    type="number"
                    value={formData.fatTarget}
                    onChange={(e) => updateFormData({ fatTarget: parseInt(e.target.value) || 0 })}
                    min={0}
                    max={500}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Meal Settings</h2>
              <p className="text-muted-foreground mt-1">
                How many meals do you eat per day?
              </p>
            </div>

            <div>
              <Label htmlFor="mealsPerDay">Meals Per Day</Label>
              <Input
                id="mealsPerDay"
                type="number"
                value={formData.mealsPerDay}
                onChange={(e) => updateFormData({ mealsPerDay: parseInt(e.target.value) || 3 })}
                min={1}
                max={10}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Typically 3 (breakfast, lunch, dinner) or 5-6 with snacks
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Meal Variety</h2>
              <p className="text-muted-foreground mt-1">
                How comfortable are you eating the same meals throughout the week?
              </p>
            </div>

            <div className="space-y-3">
              {REPETITION_TOLERANCE_OPTIONS.map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all ${
                    formData.mealRepetitionTolerance === option.value
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => updateFormData({ mealRepetitionTolerance: option.value })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{option.label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                        <Badge variant="outline" className="mt-2">
                          {option.recipesNeeded}
                        </Badge>
                      </div>
                      {formData.mealRepetitionTolerance === option.value && (
                        <CheckCircle2 className="h-5 w-5 text-primary ml-2 shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex-1">
                <Label htmlFor="autoGenerate" className="cursor-pointer">
                  Auto-generate meal plans weekly
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically create a new meal plan every week
                </p>
              </div>
              <Switch
                id="autoGenerate"
                checked={formData.autoGenerateWeekly}
                onCheckedChange={(checked) => updateFormData({ autoGenerateWeekly: checked })}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Dietary Preferences</h2>
              <p className="text-muted-foreground mt-1">
                Select your dietary preferences and any foods to exclude
              </p>
            </div>

            <div>
              <Label className="mb-3 block">Preferences</Label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_PREFERENCES.map((pref) => (
                  <Badge
                    key={pref}
                    variant={formData.dietaryPreferences.includes(pref) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() =>
                      updateFormData({
                        dietaryPreferences: toggleArrayItem(formData.dietaryPreferences, pref),
                      })
                    }
                  >
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Exclusions</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_EXCLUSIONS.map((exclusion) => (
                  <Badge
                    key={exclusion}
                    variant={formData.exclusions.includes(exclusion) ? "destructive" : "outline"}
                    className="cursor-pointer"
                    onClick={() =>
                      updateFormData({
                        exclusions: toggleArrayItem(formData.exclusions, exclusion),
                      })
                    }
                  >
                    {exclusion}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentStep / TOTAL_STEPS) * 100)}% complete
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Form content */}
      <Card>
        <CardContent className="pt-6">
          {renderStep()}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button onClick={nextStep} disabled={isSubmitting}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
