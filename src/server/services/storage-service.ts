import { createClient } from "@/lib/supabase/server";

const RECIPE_IMAGES_BUCKET = "recipe-images";

/**
 * Upload a recipe image to Supabase Storage
 */
export async function uploadRecipeImage(
  userId: string,
  file: File
): Promise<{ url: string; path: string }> {
  const supabase = await createClient();

  // Generate unique filename with user folder
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from(RECIPE_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    throw new Error("Failed to upload image");
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(RECIPE_IMAGES_BUCKET)
    .getPublicUrl(filePath);

  return { url: publicUrl, path: filePath };
}

/**
 * Delete a recipe image from Supabase Storage
 */
export async function deleteRecipeImage(filePath: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from(RECIPE_IMAGES_BUCKET)
    .remove([filePath]);

  if (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}

/**
 * Extract the file path from a Supabase Storage URL
 */
export function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/recipe-images\/(.+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
