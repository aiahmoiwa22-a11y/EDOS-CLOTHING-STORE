import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * SUPABASE CONNECTION
 * The URL and public key come from the `.env` file in the project root.
 * If they are missing, the site falls back to "demo mode" (browser-only storage),
 * so the project still runs for anyone who has not set them up.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;

/** true when the site is connected to the real database */
export const isLive = supabase !== null;

/** Name of the storage bucket that holds product photos */
export const PHOTO_BUCKET = "product-images";
