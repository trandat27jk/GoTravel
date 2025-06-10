// app/tours/[slug]/book/confirmation/page.tsx
'use client'; // Client component to read query params

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId'); // Get the booking ID from the URL

  return (
    <main className="max-w-xl mx-auto px-4 py-20 bg-white shadow-lg rounded-lg my-20 text-center">
      <div className="text-green-500 text-6xl mb-6">✅</div>
      <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A4B] mb-4">Booking Confirmed!</h1>
      <p className="text-xl text-gray-700 mb-6">Thank you for your order.</p>

      {bookingId && (
        <p className="text-lg text-gray-600 mb-8">
          Your booking ID is: <strong className="text-blue-600">{bookingId}</strong>
        </p>
      )}

      <div className="mt-8">
        <a
          href="/" // Link back to home or a "My Bookings" page if you had one
          className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
        >
          Go to Homepage
        </a>
      </div>
    </main>
  );
}