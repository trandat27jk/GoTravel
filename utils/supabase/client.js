// utils/supabase/client.js

// Import createBrowserClient from the @supabase/ssr package
import { createBrowserClient } from '@supabase/ssr';

// Export a function named createClient that creates and returns
// a new Supabase client instance for client-side usage.
export const createClient = () => { // Changed to a named export function
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};