// app/layout.tsx
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script'; // Import Script from next/script

export const metadata: Metadata = {
  title: 'GoTravel - Your World of Joy', // Custom title for SEO
  description: 'Find your perfect travel experience with GoTravel. Explore exciting destinations, popular tours, and read customer reviews.', // Custom description for SEO
  // Preconnect to essential third-party origins for faster loading (e.g., Supabase)
  other: {
    'rel': 'preconnect',
    // IMPORTANT: Replace with your actual Supabase URL hostname (e.g., 'https://your-project-id.supabase.co')
    'href': 'https://pmphzemlxomivyriwith.supabase.co',
  },
  // You might also add other preconnects here if your images or other assets
  // come from different primary domains (e.g., 'https://i.pinimg.com', 'https://images.unsplash.com')
  // although next/image's remotePatterns generally handle this for images.
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Google Analytics Script (gtag.js) */}
        {/*
          - strategy="afterInteractive": Ensures the script loads after hydration,
            allowing critical page content to load first, but before the browser becomes idle.
            This is good for analytics as it doesn't block initial rendering.
          - src: Loads the gtag.js library with your Measurement ID.
        */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        {/*
          Google Analytics Initialization Script
          - id: A unique ID for this inline script.
          - strategy="afterInteractive": Same loading strategy as the gtag.js library.
          - dangerouslySetInnerHTML: Used to inject raw HTML/JS. This initializes the dataLayer
            and sends the initial page_view event.
          - process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID: Accesses your Measurement ID from environment variables.
        */}
        <Script
          id="google-analytics-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname, // Recommended for Next.js SPA navigation
              });
            `,
          }}
        />

        {/* Navbar component, displayed at the top of every page */}
        <Navbar />
        {/* Main content area, where page-specific components will be rendered */}
        <main>{children}</main>
        {/* Footer component, displayed at the bottom of every page */}
        <Footer />
      </body>
    </html>
  );
}
