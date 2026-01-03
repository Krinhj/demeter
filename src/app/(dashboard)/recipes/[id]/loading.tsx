import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Card */}
      <div className="space-y-6 rounded-lg border p-6">
        {/* Image */}
        <Skeleton className="aspect-video w-full rounded-lg" />

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-full" />
        </div>

        {/* Macros */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Meta */}
        <div className="flex gap-6">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Tabs */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-80" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
