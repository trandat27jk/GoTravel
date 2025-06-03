// utils/supabase/client.js

// Import createBrowserClient from the new @supabase/ssr package
import { createBrowserClient } from '@supabase/ssr';

// Create a single Supabase client instance for client-side usage.
// This client is designed to work in the browser environment.
const supabase = createBrowserClient(
  // These environment variables are automatically exposed to the client-side
  // when prefixed with NEXT_PUBLIC_ in Next.js.
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Export the created Supabase client for use in client components.
export default supabase;
