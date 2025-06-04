'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white w-full shadow-sm">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/assets/images/logo.png" alt="Logo" width={20} height={20} />
          <span className="text-base font-semibold text-[#EB662B]">GoExplore</span>
        </Link>

        {/* Hamburger button for small screens */}
        <button
          className="md:hidden text-[#1A1A4B] focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#1A1A4B]">
          <Link href="/destinations" className="hover:text-[#EB662B]">Destinations</Link>
          {/* Consider replacing '#' with actual routes or using <a> if purely external/placeholder */}
          <Link href="#" className="hover:text-[#EB662B]">Activities</Link>
          <Link href="#" className="hover:text-[#EB662B]">USD</Link>
          <Link href="#" className="hover:text-[#EB662B]">Sign up</Link>
          <Link
            href="#"
            className="text-white px-4 py-1 rounded-full text-sm shadow-sm"
            style={{ backgroundColor: '#EB662B' }}
          >
            Log in
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 text-sm font-medium text-[#1A1A4B]">
          <Link href="/destinations" onClick={() => setIsOpen(false)} className="block hover:text-[#EB662B]">
            Destinations
          </Link>
          {/* Consider replacing '#' with actual routes or using <a> if purely external/placeholder */}
          <Link href="#" onClick={() => setIsOpen(false)} className="block hover:text-[#EB662B]">
            Activities
          </Link>
          <Link href="#" onClick={() => setIsOpen(false)} className="block hover:text-[#EB662B]">
            USD
          </Link>
          <Link href="#" onClick={() => setIsOpen(false)} className="block hover:text-[#EB662B]">
            Sign up
          </Link>
          <Link
            href="#"
            onClick={() => setIsOpen(false)}
            className="block w-max text-white px-4 py-1 rounded-full text-sm shadow-sm"
            style={{ backgroundColor: '#EB662B' }}
          >
            Log in
          </Link>
        </div>
      )}
    </nav>
  );
}
