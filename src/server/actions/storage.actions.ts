"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

const RECIPE_IMAGES_BUCKET = "recipe-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Upload a recipe image
 */
export async function uploadRecipeImageAction(
  formData: FormData
): Promise<ActionResult<{ url: string; path: string }>> {
  // Get current user
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be logged in to upload images" };
  }

  // Get file from form data
  const file = formData.get("file") as File | null;

  if (!file) {
    return { success: false, error: "No file provided" };
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "File too large. Maximum size: 5MB" };
  }

  try {
    // Generate unique filename with user folder
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(RECIPE_IMAGES_BUCKET)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return { success: false, error: "Failed to upload image" };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(RECIPE_IMAGES_BUCKET)
      .getPublicUrl(filePath);

    return { success: true, data: { url: publicUrl, path: filePath } };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

/**
 * Delete a recipe image
 */
export async function deleteRecipeImageAction(
  filePath: string
): Promise<ActionResult<void>> {
  // Get current user
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be logged in to delete images" };
  }

  // Verify the file belongs to this user
  if (!filePath.startsWith(`${user.id}/`)) {
    return { success: false, error: "You can only delete your own images" };
  }

  try {
    const { error } = await supabase.storage
      .from(RECIPE_IMAGES_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("Error deleting image:", error);
      return { success: false, error: "Failed to delete image" };
    }

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, error: "Failed to delete image" };
  }
}
