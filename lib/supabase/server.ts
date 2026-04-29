// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const supabaseServer = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    cookies: {
      getAll: async () => {
        const cookieStore = await cookies();
        return cookieStore.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
          options: {},
        }));
      },
      setAll: async (items) => {
        const cookieStore = await cookies();
        items.forEach((item) => {
          cookieStore.set({
            name: item.name,
            value: item.value,
            ...item.options,
          });
        });
      },
    },
  }
);