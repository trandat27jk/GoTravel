// components/DurationFilter.tsx
"use client"; // This is a Client Component

import { FaClock } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation'; // Use this hook in client components
import { useRouter } from 'next/navigation'; // Use useRouter for navigation

// Duration options (must match the ones in app/destinations/page.tsx)
const durationOptions = [
  { key: '', label: 'Any duration', min: null, max: null },
  { key: '1-3', label: '1-3 days', min: 1, max: 3 },
  { key: '4-7', label: '4-7 days', min: 4, max: 7 },
  { key: '8-14', label: '8-14 days', min: 8, max: 14 },
  { key: '15+', label: '15+ days', min: 15, max: null }
];

export default function DurationFilter() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize useRouter
  const selectedDurationKey = searchParams.get('duration') || ''; // Get current duration from URL

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDuration = e.target.value;
    const currentParams = new URLSearchParams(searchParams.toString());

    if (newDuration) {
      currentParams.set('duration', newDuration);
    } else {
      currentParams.delete('duration'); // Remove if "Any duration" is selected
    }
    currentParams.set('page', '1'); // Always reset to page 1 when filter changes

    // Navigate to the new URL, triggering a server-side re-render of DestinationsPage
    router.push(`/destinations?${currentParams.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <p className="text-sm font-semibold text-white bg-[#EB662B] px-4 py-2 rounded-t-md">
        Filter by Duration
      </p>
      <div className="bg-white rounded-b-md p-4 border-t">
        <div className="relative flex items-center gap-3">
          <FaClock className="text-gray-400" />
          <select
            name="duration"
            className="w-full bg-transparent border-none text-sm placeholder-gray-500 focus:outline-none"
            value={selectedDurationKey}
            onChange={handleDurationChange} // Event handler is now in a Client Component
          >
            {durationOptions.map(option => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
