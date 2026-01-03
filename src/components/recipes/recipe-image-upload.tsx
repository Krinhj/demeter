"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadRecipeImageAction } from "@/server/actions/storage.actions";
import { cn } from "@/lib/utils";

interface RecipeImageUploadProps {
  currentImageUrl: string | null;
  onImageChange: (url: string | null) => void;
  className?: string;
}

export function RecipeImageUpload({
  currentImageUrl,
  onImageChange,
  className,
}: RecipeImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setError(null);

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Allowed: JPEG, PNG, WebP, GIF");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size: 5MB");
      return;
    }

    // Show preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadRecipeImageAction(formData);

      if (result.success) {
        onImageChange(result.data.url);
        setPreviewUrl(result.data.url);
      } else {
        setError(result.error);
        setPreviewUrl(currentImageUrl);
      }
    } catch {
      setError("Failed to upload image");
      setPreviewUrl(currentImageUrl);
    } finally {
      setIsUploading(false);
      // Revoke the local preview URL
      URL.revokeObjectURL(localPreview);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageChange(null);
    setError(null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <img
            src={previewUrl}
            alt="Recipe preview"
            className="h-full w-full object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <div className="absolute right-2 top-2 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={handleClick}
              disabled={isUploading}
              className="h-8 w-8"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              disabled={isUploading}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className={cn(
            "flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/50 transition-colors hover:bg-muted",
            isUploading && "cursor-not-allowed opacity-50"
          )}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload an image
              </span>
              <span className="text-xs text-muted-foreground">
                JPEG, PNG, WebP, GIF (max 5MB)
              </span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
