"use client";

import { useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MealPlanEntry, DayOfWeek, MealType } from "@/types/meal-plan";
import { formatMealType } from "@/types/meal-plan";
import { cn } from "@/lib/utils";

interface MealPlanCardProps {
  entry: MealPlanEntry | null;
  dayOfWeek: DayOfWeek;
  mealType: MealType;
  mealPlanId: string;
  compact?: boolean;
}

export function MealPlanCard({
  entry,
  mealType,
  compact = false,
}: MealPlanCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Empty slot - no meal assigned
  if (!entry) {
    return (
      <Card
        className={cn(
          "border-dashed hover:border-primary/50 transition-colors cursor-pointer group",
          compact && "border-0 shadow-none bg-muted/30"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className={cn("p-4", compact && "p-3")}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              {formatMealType(mealType)}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
            <Plus className="h-4 w-4 mb-1 group-hover:text-primary transition-colors" />
            <span className="text-xs">Add meal</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Meal slot with entry
  const displayName = entry.custom_meal_name || "Untitled Meal";

  return (
    <Card
      className={cn(
        "hover:border-primary/50 transition-colors cursor-pointer group",
        compact && "border-0 shadow-none"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            {formatMealType(mealType)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
              isHovered && "opacity-100"
            )}
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-2">
          <div>
            <h4 className="font-medium text-sm line-clamp-2">{displayName}</h4>
            {entry.servings > 1 && (
              <Badge variant="outline" className="mt-1 text-xs">
                {entry.servings} servings
              </Badge>
            )}
          </div>

          {/* Macros */}
          {(entry.calories || entry.protein || entry.carbs || entry.fat) && (
            <div className="space-y-1">
              {entry.calories !== null && (
                <div className="text-xs text-muted-foreground">
                  {Math.round(entry.calories)} cal
                </div>
              )}
              <div className="flex gap-2 text-xs">
                {entry.protein !== null && (
                  <span className="text-[hsl(var(--color-protein))]">
                    {Math.round(entry.protein)}P
                  </span>
                )}
                {entry.carbs !== null && (
                  <span className="text-[hsl(var(--color-carbs))]">
                    {Math.round(entry.carbs)}C
                  </span>
                )}
                {entry.fat !== null && (
                  <span className="text-[hsl(var(--color-fat))]">
                    {Math.round(entry.fat)}F
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {entry.notes && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {entry.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
