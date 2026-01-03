"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealPlanCard } from "./meal-plan-card";
import type { MealPlanWithEntries, DailyMacros, DayOfWeek, MealType } from "@/types/meal-plan";
import { DAYS_OF_WEEK, MEAL_TYPES } from "@/types/meal-plan";

interface MealPlanGridProps {
  mealPlan: MealPlanWithEntries;
  dailyMacros: DailyMacros[];
}

export function MealPlanGrid({ mealPlan, dailyMacros }: MealPlanGridProps) {
  // Organize entries by day and meal type
  const entriesByDay = useMemo(() => {
    const organized = new Map<DayOfWeek, Map<MealType, typeof mealPlan.entries[0] | null>>();

    // Initialize all days and meal types
    DAYS_OF_WEEK.forEach((day) => {
      const mealMap = new Map<MealType, typeof mealPlan.entries[0] | null>();
      MEAL_TYPES.forEach((mealType) => {
        mealMap.set(mealType, null);
      });
      organized.set(day.value, mealMap);
    });

    // Fill in actual entries
    mealPlan.entries.forEach((entry) => {
      const dayMap = organized.get(entry.day_of_week as DayOfWeek);
      if (dayMap) {
        dayMap.set(entry.meal_type as MealType, entry);
      }
    });

    return organized;
  }, [mealPlan]);

  // Get macros for a specific day
  const getDayMacros = (dayOfWeek: DayOfWeek) => {
    return dailyMacros.find((m) => m.day_of_week === dayOfWeek);
  };

  return (
    <div className="space-y-6">
      {/* Desktop: 7-column grid */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-7 gap-4">
          {DAYS_OF_WEEK.map((day) => {
            const dayMacros = getDayMacros(day.value);
            const dayEntries = entriesByDay.get(day.value);

            return (
              <div key={day.value} className="space-y-4">
                {/* Day header */}
                <Card>
                  <CardHeader className="p-4 pb-3">
                    <CardTitle className="text-sm font-semibold">
                      {day.label}
                    </CardTitle>
                    {dayMacros && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round(dayMacros.total_calories)} cal
                      </div>
                    )}
                  </CardHeader>
                </Card>

                {/* Meals for this day */}
                {MEAL_TYPES.map((mealType) => {
                  const entry = dayEntries?.get(mealType) || null;
                  return (
                    <MealPlanCard
                      key={`${day.value}-${mealType}`}
                      entry={entry}
                      dayOfWeek={day.value}
                      mealType={mealType}
                      mealPlanId={mealPlan.id}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile/Tablet: Stacked by day */}
      <div className="lg:hidden space-y-6">
        {DAYS_OF_WEEK.map((day) => {
          const dayMacros = getDayMacros(day.value);
          const dayEntries = entriesByDay.get(day.value);

          return (
            <Card key={day.value}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{day.label}</CardTitle>
                  {dayMacros && (
                    <div className="text-sm text-muted-foreground">
                      {Math.round(dayMacros.total_calories)} cal
                    </div>
                  )}
                </div>
                {dayMacros && (
                  <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                    <span className="text-[hsl(var(--color-protein))]">
                      {Math.round(dayMacros.total_protein)}g protein
                    </span>
                    <span className="text-[hsl(var(--color-carbs))]">
                      {Math.round(dayMacros.total_carbs)}g carbs
                    </span>
                    <span className="text-[hsl(var(--color-fat))]">
                      {Math.round(dayMacros.total_fat)}g fat
                    </span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {MEAL_TYPES.map((mealType) => {
                  const entry = dayEntries?.get(mealType) || null;
                  return (
                    <MealPlanCard
                      key={`${day.value}-${mealType}`}
                      entry={entry}
                      dayOfWeek={day.value}
                      mealType={mealType}
                      mealPlanId={mealPlan.id}
                      compact
                    />
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
