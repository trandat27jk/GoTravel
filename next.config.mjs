// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Replaced 'domains' with 'remotePatterns'
    remotePatterns: [
      {
        protocol: 'https', // Specify the protocol (http or https)
        hostname: 'i.pinimg.com', // Your image domain
        port: '', // Leave empty unless a specific port is used
        pathname: '**', // Matches any path on this hostname
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
