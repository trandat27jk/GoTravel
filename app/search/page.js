// app/search/page.js
"use client"; // This is a client component because it uses hooks like useState, useEffect, useSearchParams

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import supabase from '../../utils/supabase/client'; // Import your Supabase client

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  // Extract search parameters from the URL
  const destinationQuery = searchParams.get('destination')?.toLowerCase() || '';
  const startDateQuery = searchParams.get('startDate'); // Will be an ISO string like "2025-06-03T..."
  const endDateQuery = searchParams.get('endDate');     // Will be an ISO string
  const tourTypeQuery = searchParams.get('tour')?.toLowerCase() || '';

  useEffect(() => {
    async function fetchSearchResults() {
      setLoading(true);
      setNoResults(false);
      setResults([]); // Clear previous results

      let query = supabase.from('tours').select('*'); // Base query: select all columns from the 'tours' table

      // --- Apply Filters ---

      // 1. Destination Filter: Search across multiple text columns (title, description, province, country, slug)
      if (destinationQuery) {
        query = query.or(
          `title.ilike.%${destinationQuery}%,` +
          `description.ilike.%${destinationQuery}%,` +
          `province.ilike.%${destinationQuery}%,` +
          `country.ilike.%${destinationQuery}%,` +
          `slug.ilike.%${destinationQuery}%`
        );
      }

      // 2. Tour Type Filter: Search within the 'highlights' text array column
      // The 'tourTypeQuery' from HeroBanner's 'tour' input will be used here.
      // For example, if a user types "cruise", it will look for "cruise" in the highlights array.
      if (tourTypeQuery && tourTypeQuery !== 'all tours') {
        // 'cs' stands for 'contains' and is used for array containment check.
        // Wrap the query in curly braces for array matching.
        query = query.filter('highlights', 'cs', `{${tourTypeQuery}}`);
      }

      // 3. Date Range Filter: This requires 'start_date' and 'end_date' columns in your Supabase 'tours' table.
      // *IMPORTANT*: Your current table schema (from image) doesn't have explicit date columns.
      // You would need to add `start_date` and `end_date` (type `date` or `timestamp with time zone`)
      // to your `tours` table in Supabase for this to work effectively.
      if (startDateQuery && endDateQuery) {
        // Example: Filter for tours that have an availability range that overlaps
        // with the user's selected date range.
        // This assumes your 'tours' table has 'tour_start_date' and 'tour_end_date' columns.
        // query = query.filter('tour_start_date', 'lte', endDateQuery); // Tour starts before or on selected end date
        // query = query.filter('tour_end_date', 'gte', startDateQuery);   // Tour ends after or on selected start date
        console.warn("Date range filtering is currently conceptual. Add 'start_date' and 'end_date' columns to your Supabase 'tours' table for this to work.");
      }


      const { data, error } = await query; // Execute the Supabase query

      if (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
        setNoResults(true);
      } else {
        setResults(data);
        if (data.length === 0) {
          setNoResults(true);
        }
      }
      setLoading(false);
    }

    fetchSearchResults();
  }, [destinationQuery, startDateQuery, endDateQuery, tourTypeQuery]); // Re-run effect when these parameters change

  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 text-[#1A1A4B]">
        <h1 className="text-3xl font-bold mb-8">
          Search Results {destinationQuery || tourTypeQuery ? `for: "${(destinationQuery || tourTypeQuery).trim()}"` : 'for all tours'}
        </h1>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700">Loading results...</p>
          </div>
        ) : noResults ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700">No results found for your search criteria.</p>
            <p className="text-md text-gray-500 mt-2">Try adjusting your search terms.</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((tour) => (
              <Link href={`/tour_details/${tour.slug}`} key={tour.slug}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition transform duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                  <img
                    src={tour.cover_img_gallery?.[0] || '/assets/images/placeholder.jpg'} // Use first image from gallery or a placeholder
                    alt={tour.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-400">{tour.province}, {tour.country}</p>
                    <h4 className="text-base font-semibold text-[#1A1A4B] mb-2">
                      {tour.title}
                    </h4>
                    {/* If you add rating to your Supabase table: */}
                    {/* <p className="text-sm text-gray-500 mb-2">{tour.rating}</p> */}
                    <div className="flex justify-between text-sm font-medium text-[#1A1A4B]">
                      <span>{tour.original_duration}</span>
                      <span>
                        From <span className="font-bold">${tour.price}</span>
                      </span>
                    </div>
                    {tour.highlights && tour.highlights.length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        Highlights: {tour.highlights.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>
    </>
  );
}