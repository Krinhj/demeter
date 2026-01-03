import { Flame, Beef, Wheat, Droplets } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RecipeMacrosProps {
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  className?: string;
  size?: "sm" | "default";
}

export function RecipeMacros({
  calories,
  protein,
  carbs,
  fat,
  className,
  size = "default",
}: RecipeMacrosProps) {
  const hasData = calories || protein || carbs || fat;

  if (!hasData) {
    return null;
  }

  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {calories != null && (
        <Badge variant="secondary" className={cn("gap-1 font-normal", textSize)}>
          <Flame className={cn(iconSize, "text-chart-1")} />
          {Math.round(calories)} cal
        </Badge>
      )}
      {protein != null && (
        <Badge variant="secondary" className={cn("gap-1 font-normal", textSize)}>
          <Beef className={cn(iconSize, "text-protein")} />
          {Math.round(protein)}g
        </Badge>
      )}
      {carbs != null && (
        <Badge variant="secondary" className={cn("gap-1 font-normal", textSize)}>
          <Wheat className={cn(iconSize, "text-carbs")} />
          {Math.round(carbs)}g
        </Badge>
      )}
      {fat != null && (
        <Badge variant="secondary" className={cn("gap-1 font-normal", textSize)}>
          <Droplets className={cn(iconSize, "text-fat")} />
          {Math.round(fat)}g
        </Badge>
      )}
    </div>
  );
}
