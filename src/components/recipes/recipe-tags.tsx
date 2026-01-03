import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RecipeTagsProps {
  tags: string[] | null;
  className?: string;
  limit?: number;
}

export function RecipeTags({ tags, className, limit }: RecipeTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  const displayTags = limit ? tags.slice(0, limit) : tags;
  const remaining = limit && tags.length > limit ? tags.length - limit : 0;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {displayTags.map((tag) => (
        <Badge key={tag} variant="outline" className="text-xs font-normal">
          {tag}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
          +{remaining}
        </Badge>
      )}
    </div>
  );
}
