// components/TourTypeFilter.tsx
"use client"; // This is a Client Component

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

// Define the tour types (must match values in your database)
const tourTypes = ['Nature Tours', 'Adventure Tours', 'Cultural Tours', 'Food Tours', 'City Tours', 'Cruises Tours'];

export default function TourTypeFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get currently selected tour types from URL (can be multiple)
  const selectedTourTypes = searchParams.getAll('tourType');

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const currentParams = new URLSearchParams(searchParams.toString());

    if (checked) {
      currentParams.append('tourType', value); // Add new type
    } else {
      // Remove the specific type from the URL
      const allTypes = currentParams.getAll('tourType');
      currentParams.delete('tourType'); // Delete all first
      allTypes.filter(type => type !== value).forEach(type => {
        currentParams.append('tourType', type); // Append back only unselected types
      });
    }
    currentParams.set('page', '1'); // Reset to page 1 when filter changes

    router.push(`/destinations?${currentParams.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h4 className="font-semibold text-sm mb-2">Tour Type</h4>
      <ul className="space-y-2 text-sm text-gray-600">
        {tourTypes.map(type => (
          <li key={type}>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                value={type}
                checked={selectedTourTypes.includes(type)}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              {type}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
