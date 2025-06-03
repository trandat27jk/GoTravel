// app/destinations/page.tsx
// This is a Server Component, so no "use client" directive here.
// Data fetching happens directly on the server.
import { createClient } from '@/utils/supabase/server'; // Import the server-side Supabase client
import Link from 'next/link';
import Image from 'next/image';
import { FaImage } from 'react-icons/fa'; // FaClock moved to DurationFilter component

// Import the new Client Component for duration filter
import DurationFilter from '@/components/DurationFilter';
// Import the new Client Component for tour type filter
import TourTypeFilter from '@/components/TourTypeFilter';
// Import the new Client Component for sorting
import SortFilter from '@/components/SortFilter'; // <--- NEW IMPORT

// Define the type for a Tour/Destination item for better type safety
interface DestinationItem {
  id: string; // Assuming 'id' is a string/uuid based on your schema
  slug: string; // For linking to tour details
  title: string;
  description: string;
  price: number;
  duration: string; // The original text duration column (e.g., "4 days")
  duration_in_days?: number; // IMPORTANT: Add this to interface if you have it in DB and use for sorting
  group_size?: number; // Optional, as some tours might not have it explicitly
  highlights?: string[]; // Array of text
  province: string;
  country: string;
  cover_img_gallery?: string[]; // Array of image URLs
  rating?: string; // e.g., "4.8 (269)" - IMPORTANT: If sorting by rating, this should be numeric in DB
  discount?: string; // e.g., "20 % OFF"
  original_price?: number; // if you have this column
  tour_type?: string; // Add tour_type column to interface
}

// Helper function to parse duration from string (e.g., "4 days" -> 4)
function parseDurationToDays(durationStr: string): number | null {
  // Ensure durationStr is a string before calling .match()
  if (typeof durationStr !== 'string' || !durationStr) {
    return null;
  }
  const match = durationStr.match(/(\d+)\s*day/i); // Matches digits followed by "day" (case-insensitive)
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null; // Return null if parsing fails
}

// Constants for pagination
const ITEMS_PER_PAGE = 6; // Display 6 locations per page

// Duration options for the filter (kept here for server-side logic and passing to client component)
const durationOptions = [
  { key: '', label: 'Any duration', min: null, max: null },
  { key: '1-3', label: '1-3 days', min: 1, max: 3 },
  { key: '4-7', label: '4-7 days', min: 4, max: 7 },
  { key: '8-14', label: '8-14 days', min: 8, max: 14 },
  { key: '15+', label: '15+ days', min: 15, max: null }
];

// Sort options (must match components/SortFilter.tsx)
// This array is used in both the Server Component (for query building)
// and the Client Component (for rendering options).
const sortOptions = [
  { key: 'featured', label: 'Featured', column: null, ascending: null },
  { key: 'price_asc', label: 'Price (Low to High)', column: 'price', ascending: true },
  { key: 'price_desc', label: 'Price (High to Low)', column: 'price', ascending: false },
  { key: 'duration_asc', label: 'Duration (Shortest)', column: 'duration', ascending: true }, // Assumes duration_in_days exists
  { key: 'duration_desc', label: 'Duration (Longest)', column: 'duration', ascending: false }, // Assumes duration_in_days exists
];


// This is an Async Server Component
export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get current page from URL, default to 1
  const currentPage = parseInt(searchParams.page as string || '1', 10);
  // Get selected duration key from URL
  const selectedDurationKey = searchParams.duration as string || '';
  // Get selected tour types from URL (can be multiple)
  const tourTypeParam = searchParams.tourType;
  const selectedTourTypes = Array.isArray(tourTypeParam) ? tourTypeParam : (tourTypeParam ? [tourTypeParam] : []);
  // Get selected sort key from URL
  const selectedSortKey = searchParams.sortBy as string || 'featured'; // <--- NEW: Get sortBy param

  const supabase = createClient(); // Use the server-side Supabase client

  // Calculate offset for pagination
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Build the Supabase query for fetching data
  let query = supabase.from('tours').select('*', { count: 'exact' }); // Select all columns and get exact count

  // --- Server-side Filtering ---

  // 1. Tour Type Filter (Server-side)
  if (selectedTourTypes.length > 0) {
    query = query.in('tour_type', selectedTourTypes);
  }

  // --- Server-side Sorting ---
  const sortOption = sortOptions.find(opt => opt.key === selectedSortKey);
  if (sortOption && sortOption.column) {
    // Only apply sorting if a valid column is specified
    // Supabase's order method
    query = query.order(sortOption.column, { ascending: sortOption.ascending }); // <--- Apply sorting
  }


  // Apply pagination limits
  query = query.range(offset, offset + ITEMS_PER_PAGE - 1);

  // Execute the query
  const { data: destinationsData, error, count } = await query;

  if (error) {
    console.error('Error fetching destinations:', error);
    return <div className="p-6 text-red-600">Error loading destinations: {error.message}</div>;
  }

  let filteredDestinations: DestinationItem[] = destinationsData || [];
  let totalCountForPagination = count; // Initial count from Supabase (before client-side duration filtering)

  // --- Client-side Duration Filtering ---
  // This is performed after fetching data from Supabase, as 'duration' is a text field.
  // IMPORTANT: For perfectly accurate pagination with client-side filters, you'd
  // need to fetch *all* data, filter it, then calculate totalPages and paginate.
  // This approach is a trade-off for simplicity with text duration column.
  if (selectedDurationKey && selectedDurationKey !== '') {
    const durationOption = durationOptions.find(opt => opt.key === selectedDurationKey);

    if (durationOption && (durationOption.min !== null || durationOption.max !== null)) {
      filteredDestinations = filteredDestinations.filter(place => {
        const placeDurationDays = parseDurationToDays(place.duration);

        if (placeDurationDays === null) {
          return false;
        }

        const minMatch = durationOption.min === null || placeDurationDays >= durationOption.min;
        const maxMatch = durationOption.max === null || placeDurationDays <= durationOption.max;

        return minMatch && maxMatch;
      });
    }
  }

  const totalPages = totalCountForPagination ? Math.ceil(totalCountForPagination / ITEMS_PER_PAGE) : 0;
  const destinationsToDisplay: DestinationItem[] = filteredDestinations;

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 text-[#1A1A4B]">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">Home</Link> &gt;{' '}
        <span>Destinations</span>
      </nav>

      {/* Title and Sort */}
      <div className="flex justify-between items-start mb-8 flex-col sm:flex-row">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Explore new destinations</h1>
        {/* Sort Filter - Now using the extracted Client Component */}
        <SortFilter /> {/* <--- NEW COMPONENT USAGE */}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Duration Filter */}
          <DurationFilter />

          {/* Tour Type filter */}
          <TourTypeFilter />
        </aside>

        {/* Destination Cards */}
        <section className="lg:col-span-3 space-y-6">
          {destinationsToDisplay.length === 0 ? (
            <div className="text-center py-10 col-span-full">
              <p className="text-xl text-gray-700">No destinations found for your criteria.</p>
              <p className="text-md text-gray-500 mt-2">Try adjusting your filters.</p>
            </div>
          ) : (
            destinationsToDisplay.map((place) => (
              <div key={place.id} className="bg-white rounded-lg shadow border border-gray-100 flex flex-col md:flex-row overflow-hidden h-[212px] transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative md:w-64 w-full h-52 md:h-52 flex-shrink-0">
                  {place.cover_img_gallery?.[0] ? (
                    <Image
                      src={place.cover_img_gallery[0]}
                      alt={place.title}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 rounded-md">
                      <FaImage className="text-6xl" />
                    </div>
                  )}
                  {place.discount && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      {place.discount}
                    </span>
                  )}
                </div>
                <div className="flex-1 px-4 py-2 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{place.province}, {place.country}</p>
                    <h2 className="text-base font-semibold text-[#1A1A4B] leading-snug mt-1 mb-2">
                      {place.title}
                    </h2>
                    <p className="text-sm text-[#1A1A4B] font-medium mb-1">{place.rating}</p>
                    <p className="text-sm text-gray-500 mb-2">{place.description}</p>
                  </div>
                  <div className="text-sm text-orange-500 space-x-4">
                    <span>Best Price Guarantee</span>
                    <span>Free Cancellation</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between px-4 py-2 text-sm min-w-[140px] border-l border-gray-100">
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">{place.duration}</p>
                    {place.original_price && (
                      <p className="text-xs text-gray-400 line-through">${place.original_price}</p>
                    )}
                    <p className="text-[#1A1A4B] font-semibold">From ${place.price}</p>
                  </div>
                  <Link
                    href={`/tour_details/${place.slug}`}
                    className="mt-4 px-4 py-2 rounded-lg border border-[#EB662B] text-[#EB662B] hover:bg-[#EB662B] hover:text-white transition duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <Link
              key={pageNumber}
              href={{
                pathname: '/destinations',
                query: {
                  ...searchParams, // Keep existing search params
                  page: pageNumber.toString(),
                  duration: selectedDurationKey // Keep duration filter
                },
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                pageNumber === currentPage
                  ? 'bg-[#05073C] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pageNumber}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
