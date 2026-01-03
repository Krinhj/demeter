"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Heart, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface RecipeFiltersProps {
  allTags: string[];
}

export function RecipeFilters({ allTags }: RecipeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const currentFavorites = searchParams.get("favorites") === "true";
  const currentSort = searchParams.get("sort") || "created_at";

  const [search, setSearch] = useState(currentSearch);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`/recipes?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: search || null });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    updateParams({ tags: newTags.length > 0 ? newTags.join(",") : null });
  };

  const handleFavoritesToggle = () => {
    updateParams({ favorites: currentFavorites ? null : "true" });
  };

  const handleSortChange = (value: string) => {
    updateParams({ sort: value === "created_at" ? null : value });
  };

  const clearFilters = () => {
    setSearch("");
    startTransition(() => {
      router.push("/recipes");
    });
  };

  const hasActiveFilters =
    currentSearch || currentTags.length > 0 || currentFavorites;

  return (
    <div className={cn("space-y-4", isPending && "opacity-70")}>
      {/* Search and Sort row */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </form>

        <div className="flex gap-2">
          <Button
            variant={currentFavorites ? "default" : "outline"}
            size="icon"
            onClick={handleFavoritesToggle}
            title="Show favorites only"
          >
            <Heart
              className={cn("h-4 w-4", currentFavorites && "fill-current")}
            />
          </Button>

          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Newest first</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="calories">Calories</SelectItem>
              <SelectItem value="protein">Protein</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags row */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.slice(0, 15).map((tag) => (
            <Badge
              key={tag}
              variant={currentTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {currentSearch && (
            <Badge variant="secondary" className="gap-1">
              Search: {currentSearch}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSearch("");
                  updateParams({ search: null });
                }}
              />
            </Badge>
          )}
          {currentTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              />
            </Badge>
          ))}
          {currentFavorites && (
            <Badge variant="secondary" className="gap-1">
              Favorites
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={handleFavoritesToggle}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-6 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
