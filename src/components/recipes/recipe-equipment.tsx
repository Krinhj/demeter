import { ChefHat } from "lucide-react";
import type { Equipment } from "@/types/recipe";

interface RecipeEquipmentProps {
  equipment: Equipment[];
}

export function RecipeEquipment({ equipment }: RecipeEquipmentProps) {
  if (!equipment || equipment.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Equipment</h3>
      <ul className="space-y-2">
        {equipment.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <ChefHat className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span>
              {item.name}
              {item.notes && (
                <span className="text-muted-foreground"> ({item.notes})</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
