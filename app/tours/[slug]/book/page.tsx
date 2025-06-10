// app/tours/[slug]/book/page.tsx
'use client'; // This must be a client component to use localStorage and useState

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../../utils/supabase/client'; // Supabase client for client-side inserts

interface BookingDetails {
  tourId: string;
  tourTitle: string;
  basePrice: number;
  adultTickets: number;
  youthTickets: number;
  childrenTickets: number;
  addService: boolean;
  selectedTime: string;
  travelDate: string;
  totalPrice: number;
  serviceFee: number;
}

export default function PersonalInfoPage(props: { params: { slug: string } }) {
  const { slug } = props.params; // The tour slug
  const router = useRouter();
  const supabase = createClient();

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [fullName, setFullName] = useState('');
  const [guestEmail, setGuestEmail] = useState(''); // Email was collected, but re-confirm or allow edit
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to load booking details from localStorage
    const storedDetails = localStorage.getItem('currentBookingDetails');
    if (storedDetails) {
      const parsedDetails: BookingDetails = JSON.parse(storedDetails);
      // Basic validation: ensure the tourId matches the current slug
      if (parsedDetails.tourId === slug) {
        setBookingDetails(parsedDetails);
        // Pre-fill email if it was part of initial data (though not collected in step 1 yet)
        // If you collected email in step 1, pass it in localStorage too.
        // For now, let's assume email is a new input here.
      } else {
        // Mismatch or invalid slug, redirect back to tour page
        alert('Booking details mismatch or invalid. Please start again.');
        router.push(`/tours/${slug}`);
      }
    } else {
      // No booking details found, redirect back to the main tour page
      alert('No booking details found. Please select your tour options first.');
      router.push(`/tours/${slug}`);
    }
  }, [slug, router]);

  const handleSubmitBooking = async () => {
    if (isSubmitting) return;

    setError(null);

    // Basic validation
    if (!fullName || !guestEmail || !phoneNumber) {
      setError('Please fill in all required personal information.');
      return;
    }
    if (!guestEmail.includes('@') || !guestEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!bookingDetails) {
      setError('Missing booking details. Please go back and select tour options.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: supabaseError } = await supabase
        .from('bookings')
        .insert([
          {
            tour_id: bookingDetails.tourId,
            travel_date: bookingDetails.travelDate,
            selected_time: bookingDetails.selectedTime,
            adult_tickets: bookingDetails.adultTickets,
            youth_tickets: bookingDetails.youthTickets,
            children_tickets: bookingDetails.childrenTickets,
            has_service_extra: bookingDetails.addService,
            total_amount: bookingDetails.totalPrice,
            guest_name: fullName,
            guest_email: guestEmail,
            guest_phone: phoneNumber,
            status: 'confirmed', // Assuming immediate confirmation without payment
          },
        ])
        .select(); // Select the inserted data to get the new booking ID

      if (supabaseError) {
        throw supabaseError;
      }

      // Clear the temporary booking data from localStorage
      localStorage.removeItem('currentBookingDetails');

      const bookingId = data ? data[0].id : 'N/A';
      // Redirect to success page, passing booking ID as a query parameter
      router.push(`/tours/${slug}/book/confirmation?bookingId=${bookingId}`);

    } catch (err: any) {
      console.error('Error confirming booking:', err);
      setError(`Failed to confirm booking: ${err.message || 'An unknown error occurred.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookingDetails && !error) {
    // Show a loading or redirecting message while useEffect runs
    return <div className="max-w-7xl mx-auto px-4 py-10 bg-white min-h-[50vh] flex items-center justify-center text-xl text-gray-600">Loading booking details...</div>;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 bg-white min-h-[50vh]">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Booking Error</h1>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={() => router.push(`/tours/${slug}`)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Go back to Tour Details
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10 bg-white shadow-md rounded-lg my-10">
      <h1 className="text-3xl font-bold text-[#1A1A4B] mb-6 text-center">Confirm Your Booking for {bookingDetails?.tourTitle}</h1>

      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Booking Summary</h2>
        <p className="text-gray-700"><strong>Travel Date:</strong> {bookingDetails?.travelDate}</p>
        <p className="text-gray-700"><strong>Time Slot:</strong> {bookingDetails?.selectedTime}</p>
        <p className="text-gray-700"><strong>Adult Tickets:</strong> {bookingDetails?.adultTickets}</p>
        <p className="text-gray-700"><strong>Youth Tickets:</strong> {bookingDetails?.youthTickets}</p>
        <p className="text-gray-700"><strong>Children Tickets:</strong> {bookingDetails?.childrenTickets}</p>
        <p className="text-gray-700"><strong>Service Extra:</strong> {bookingDetails?.addService ? 'Yes' : 'No'}</p>
        <p className="text-2xl font-bold text-gray-900 mt-4">Total: ${bookingDetails?.totalPrice.toFixed(2)}</p>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Your Full Name"
          />
        </div>
        <div>
          <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="guestEmail"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel" // Use type="tel" for phone numbers
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="e.g., +1234567890"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-4">{error}</p>
      )}

      <div className="mt-8 flex justify-between gap-4">
        <button
          onClick={() => router.back()} // Go back to the previous page (tour details)
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200"
          disabled={isSubmitting}
        >
          Back to Tour Details
        </button>
        <button
          onClick={handleSubmitBooking}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
        </button>
      </div>
    </main>
  );
}