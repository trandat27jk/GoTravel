// components/SortFilter.tsx
"use client"; // This is a Client Component

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function SortFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sortOpen, setSortOpen] = useState(false);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Get current sort option from URL, default to 'featured'
  const currentSortKey = searchParams.get('sortBy') || 'featured';

  // Sort options mapping keys to display text and DB column/direction
  const sortOptions = [
    { key: 'featured', label: 'Featured', column: null, ascending: null },
    { key: 'price_asc', label: 'Price (Low to High)', column: 'price', ascending: true },
    { key: 'price_desc', label: 'Price (High to Low)', column: 'price', ascending: false },
    { key: 'duration_asc', label: 'Duration (Shortest)', column: 'duration_in_days', ascending: true }, // Assumes duration_in_days exists
    { key: 'duration_desc', label: 'Duration (Longest)', column: 'duration_in_days', ascending: false }, // Assumes duration_in_days exists
    { key: 'rating_desc', label: 'Rating (High to Low)', column: 'rating', ascending: false }, // Assumes numeric rating exists
  ];

  const currentSortLabel = sortOptions.find(opt => opt.key === currentSortKey)?.label || 'Featured';

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node) &&
          sortButtonRef.current && !sortButtonRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortSelect = (sortKey: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());

    if (sortKey && sortKey !== 'featured') {
      currentParams.set('sortBy', sortKey);
    } else {
      currentParams.delete('sortBy'); // Remove if "Featured" is selected
    }
    currentParams.set('page', '1'); // Reset to page 1 when sort changes

    router.push(`/destinations?${currentParams.toString()}`);
    setSortOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative text-sm text-gray-600">
      <button
        ref={sortButtonRef}
        onClick={() => setSortOpen(!sortOpen)}
        className="flex items-center border border-gray-300 rounded px-3 py-1 bg-white text-[#1A1A4B] hover:border-[#EB662B]"
      >
        Sort by: <span className="ml-1 font-medium">{currentSortLabel}</span>
        <svg className="ml-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {sortOpen && (
        <div ref={sortDropdownRef} className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg text-[#1A1A4B]">
          <ul className="divide-y divide-gray-100">
            {sortOptions.map(option => (
              <li key={option.key}>
                <button
                  onClick={() => handleSortSelect(option.key)}
                  className="w-full text-left px-4 py-2 hover:bg-[#EB662B] hover:text-white"
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
