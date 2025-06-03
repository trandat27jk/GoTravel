// app/layout.tsx
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-[#1A1A4B]">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
