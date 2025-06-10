// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'another-external-domain.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
        port: '',
        pathname: '**',
      },
      // Add Supabase Storage hostname here if you serve images from Supabase buckets
      {
        protocol: 'https',
        // IMPORTANT: Replace 'YOUR_PROJECT_REF.supabase.co' with your actual Supabase project reference
        // You can find this in your Supabase project URL (e.g., https://<YOUR_PROJECT_REF>.supabase.co)
        hostname: '*.supabase.co', // Use a wildcard for subdomains like 'storage.your-project-ref.supabase.co'
        port: '',
        pathname: '**',
      },
      // If you have images from Unsplash or Cloudinary (from previous conversations), add them here:
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      //   port: '',
      //   pathname: '**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'res.cloudinary.com',
      //   port: '',
      //   pathname: '**',
      // },
    ],
  },
};

export default nextConfig;