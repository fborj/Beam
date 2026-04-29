import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseServer = createServerClient({
  supabaseUrl,
  supabaseKey: supabaseServiceRoleKey,
  getRequestHeader: (name) => headers().get(name) ?? undefined,
  getRequestCookie: (name) => cookies().get(name)?.value,
});
