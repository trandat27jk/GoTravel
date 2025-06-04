// components/Footer.js
import Image from 'next/image'; // Import Image component
import Link from 'next/link'; // Import Link component for navigation
export default function Footer() {
  return (
    <footer className="bg-white w-full shadow-inner mt-8">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
        {/* Left: Logo and Name */}
        <Link href="/" className="flex items-center space-x-2 mb-4 md:mb-0"> {/* Changed <div> to Link */}
          <div className="relative w-5 h-5 flex-shrink-0"> {/* Wrapper for Image */}
            <Image src="/assets/images/logo.png" alt="Logo" fill sizes="20px" /> {/* Use Image component */}
          </div>
          <span className="text-base font-semibold text-[#EB662B]">GoExplore</span>
        </Link>

        {/* Middle: Links */}
        <div className="flex space-x-6 text-sm font-medium text-[#1A1A4B] mb-4 md:mb-0">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
        </div>

        {/* Right: Copyright */}
        <div className="text-xs text-gray-400">
          &copy; 2024 GoExplore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
