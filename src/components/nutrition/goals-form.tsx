"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { saveNutritionGoalsAction } from "@/server/actions/nutrition-goals.actions";
import {
  DIETARY_PREFERENCES,
  COMMON_EXCLUSIONS,
  REPETITION_TOLERANCE_OPTIONS,
  type NutritionGoals,
  type MealRepetitionTolerance,
} from "@/types/nutrition";
import { useToast } from "@/hooks/use-toast";

interface GoalsFormProps {
  initialGoals: NutritionGoals;
}

export function GoalsForm({ initialGoals }: GoalsFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    dailyCalories: initialGoals.daily_calories,
    proteinMin: initialGoals.protein_min,
    proteinMax: initialGoals.protein_max,
    carbsTarget: initialGoals.carbs_target,
    fatTarget: initialGoals.fat_target,
    mealsPerDay: initialGoals.meals_per_day,
    mealRepetitionTolerance: (initialGoals.meal_repetition_tolerance || "medium") as MealRepetitionTolerance,
    autoGenerateWeekly: initialGoals.auto_generate_weekly ?? false,
    dietaryPreferences: initialGoals.dietary_preferences || [],
    exclusions: initialGoals.exclusions || [],
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

    const result = await saveNutritionGoalsAction(formData);

    if (result.success) {
      toast({
        title: "Goals updated!",
        description: "Your nutrition goals have been saved.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Nutrition Targets */}
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Targets</CardTitle>
          <CardDescription>Your daily calorie and macro goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Meal Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Meal Settings</CardTitle>
          <CardDescription>Configure your daily meal structure</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Meal Variety */}
      <Card>
        <CardHeader>
          <CardTitle>Meal Variety Preferences</CardTitle>
          <CardDescription>
            How comfortable are you eating the same meals throughout the week?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                      <div className="h-4 w-4 rounded-full bg-primary ml-2 flex-shrink-0" />
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
        </CardContent>
      </Card>

      {/* Dietary Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Dietary Preferences</CardTitle>
          <CardDescription>Select your dietary preferences and any foods to exclude</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                      dietaryPreferences: toggleArrayItem(formData.dietaryPreferences || [], pref),
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
                      exclusions: toggleArrayItem(formData.exclusions || [], exclusion),
                    })
                  }
                >
                  {exclusion}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Goals
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
