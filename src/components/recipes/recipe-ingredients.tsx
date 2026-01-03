import type { Ingredient } from "@/types/recipe";

interface RecipeIngredientsProps {
  ingredients: Ingredient[];
  servings?: number;
  originalServings?: number;
}

function formatQuantity(quantity: number | null, unit: string | null): string {
  if (quantity === null) return "";

  // Format fractions nicely
  const fractions: Record<number, string> = {
    0.25: "¼",
    0.33: "⅓",
    0.5: "½",
    0.66: "⅔",
    0.75: "¾",
  };

  const whole = Math.floor(quantity);
  const decimal = quantity - whole;

  let result = "";
  if (whole > 0) {
    result += whole;
  }

  // Check for common fractions
  const closestFraction = Object.entries(fractions).find(
    ([key]) => Math.abs(parseFloat(key) - decimal) < 0.05
  );

  if (closestFraction) {
    result += (whole > 0 ? " " : "") + closestFraction[1];
  } else if (decimal > 0) {
    result = quantity.toFixed(1).replace(/\.0$/, "");
  }

  if (unit) {
    result += " " + unit;
  }

  return result;
}

export function RecipeIngredients({
  ingredients,
  servings,
  originalServings,
}: RecipeIngredientsProps) {
  const multiplier =
    servings && originalServings ? servings / originalServings : 1;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Ingredients</h3>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => {
          const adjustedQuantity = ingredient.quantity
            ? ingredient.quantity * multiplier
            : null;

          return (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                <span className="font-medium">
                  {formatQuantity(adjustedQuantity, ingredient.unit)}
                </span>{" "}
                {ingredient.name}
                {ingredient.notes && (
                  <span className="text-muted-foreground">
                    , {ingredient.notes}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
