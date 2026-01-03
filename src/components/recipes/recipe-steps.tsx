interface RecipeStepsProps {
  steps: string[];
}

export function RecipeSteps({ steps }: RecipeStepsProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Instructions</h3>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
