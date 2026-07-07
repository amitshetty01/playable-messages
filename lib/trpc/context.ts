import { getSupabaseServerClient } from "@/lib/supabase";

export async function createContext() {
  const supabase = getSupabaseServerClient();
  return { supabase };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
