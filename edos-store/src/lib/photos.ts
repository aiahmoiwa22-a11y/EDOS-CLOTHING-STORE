import { fileToResizedBlob, fileToResizedDataUrl } from "@/lib/storage";
import { isLive, supabase, PHOTO_BUCKET } from "@/lib/supabase";

/**
 * Prepare a photo chosen by the admin.
 * Live site: uploads it to the database storage and returns its public address.
 * Demo mode: returns a small data address that is kept in this browser.
 */
export async function preparePhoto(file: File, folder = "products"): Promise<string> {
  if (isLive && supabase) {
    const blob = await fileToResizedBlob(file);
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
    const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
    if (error) throw new Error("Could not upload the photo. Check your connection and that you are signed in as admin.");
    return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
  }
  return fileToResizedDataUrl(file);
}
