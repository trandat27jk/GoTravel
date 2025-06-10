// components/BookingSidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter and useSearchParams

interface BookingSidebarProps {
  basePrice: number;
  duration: string;
  tourId: string;
  tourTitle: string;
}

export default function BookingSidebar({ basePrice, duration, tourId, tourTitle }: BookingSidebarProps) {
  const router = useRouter(); // Initialize router
  const searchParams = useSearchParams(); // To read potential pre-selected time/date from URL
  
  const [adultTickets, setAdultTickets] = useState(0);
  const [youthTickets, setYouthTickets] = useState(0);
  const [childrenTickets, setChildrenTickets] = useState(0);
  const [addService, setAddService] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(basePrice);

  const serviceFee = 40;

  useEffect(() => {
    // Optionally, read initial values from URL if you want to allow pre-selection
    const initialDate = searchParams.get('date');
    const initialTime = searchParams.get('time');
    if (initialDate) setTravelDate(initialDate);
    if (initialTime) setSelectedTime(initialTime);

    const calculatedPrice =
      (adultTickets * (basePrice * 0.95)) +
      (youthTickets * (basePrice * 0.85)) +
      (childrenTickets * (basePrice * 0.5)) +
      (addService ? serviceFee : 0);

    setTotalPrice(Math.max(basePrice, calculatedPrice));
  }, [adultTickets, youthTickets, childrenTickets, addService, basePrice, serviceFee, searchParams]);


  const handleContinue = () => {
    if (adultTickets === 0 && youthTickets === 0 && childrenTickets === 0) {
      alert('Please select at least one ticket!');
      return;
    }
    if (!selectedTime) {
      alert('Please select a time slot!');
      return;
    }
    if (!travelDate) {
      alert('Please select a travel date!');
      return;
    }

    // Prepare data to pass to the next step
    const bookingDetails = {
      tourId,
      tourTitle,
      basePrice, // Keep basePrice for reference
      adultTickets,
      youthTickets,
      childrenTickets,
      addService,
      selectedTime,
      travelDate,
      totalPrice,
      serviceFee // Pass service fee for confirmation
    };

    // Store data in localStorage (for simplicity in this demo)
    // In a real app, you might create a "draft booking" in the DB here
    localStorage.setItem('currentBookingDetails', JSON.stringify(bookingDetails));

    // Redirect to the personal info page
    router.push(`/tours/${tourId}/book`); // Assuming tourId is unique slug
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 sticky top-10">
      <h3 className="text-xl font-bold text-gray-800 mb-4">From ${basePrice.toFixed(2)}</h3>

      {/* Travel Date Picker */}
      <div className="mb-4">
        <label htmlFor="travel-date" className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
        <input
          type="date"
          id="travel-date"
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700"
          required
        />
      </div>

      {/* Time Slot */}
      <div className="mb-6">
        <label htmlFor="time-slot" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
        <select
          id="time-slot"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Choose time</option>
          <option value="9am">9:00 AM</option>
          <option value="1pm">1:00 PM</option>
        </select>
      </div>

      {/* Tickets Section */}
      <h4 className="text-lg font-semibold text-gray-800 mb-3">Tickets</h4>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-gray-700">
          <span>Adult (18+ years) ${ (basePrice * 0.95).toFixed(2) }</span>
          <input
            type="number"
            value={adultTickets}
            onChange={(e) => setAdultTickets(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            className="w-16 text-center border border-gray-300 rounded-md py-1"
          />
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span>Youth (13-17 years) ${ (basePrice * 0.85).toFixed(2) }</span>
          <input
            type="number"
            value={youthTickets}
            onChange={(e) => setYouthTickets(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            className="w-16 text-center border border-gray-300 rounded-md py-1"
          />
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span>Children (0-12 years) ${ (basePrice * 0.5).toFixed(2) }</span>
          <input
            type="number"
            value={childrenTickets}
            onChange={(e) => setChildrenTickets(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            className="w-16 text-center border border-gray-300 rounded-md py-1"
          />
        </div>
      </div>

      {/* Add Extra Section */}
      <h4 className="text-lg font-semibold text-gray-800 mb-3">Add Extra</h4>
      <div className="flex justify-between items-center mb-6">
        <label htmlFor="service-per-booking" className="text-gray-700">Add Service per booking</label>
        <span className="font-semibold text-gray-800">${serviceFee.toFixed(2)}</span>
        <input
          type="checkbox"
          id="service-per-booking"
          checked={addService}
          onChange={(e) => setAddService(e.target.checked)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
      </div>

      {/* Total Price & Continue Button */}
      <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-4">
        <span>Total</span>
        <span>$ {totalPrice.toFixed(2)}</span>
      </div>
      <button
        onClick={handleContinue}
        className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
      >
        Continue
      </button>
    </div>
  );
}