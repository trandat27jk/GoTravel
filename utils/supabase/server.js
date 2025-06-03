// utils/supabase/server.js
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          // Ensure you return the cookie value string, or undefined
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name, value, options) {
          // This will be a no-op in Server Components when using next/headers cookies()
          // but Supabase client expects these methods.
          // Actual cookie setting for auth should happen in Route Handlers or Server Actions,
          // or be managed by middleware.
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignore errors when trying to set cookies from a Server Component
            // if you have a middleware setup for session refresh.
            // console.log('Attempted to set cookie from Server Component:', name, error.message);
          }
        },
        remove(name, options) {
          // Similar to set, this will be a no-op in Server Components.
          try {
            // To "remove", you typically set an empty value and an expired date.
            // Or, more simply, if cookieStore had a direct delete, but it doesn't.
            // So, we effectively try to set it to be expired/empty.
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Ignore errors
            // console.log('Attempted to remove cookie from Server Component:', name, error.message);
          }
        },
      },
    }
  );
};