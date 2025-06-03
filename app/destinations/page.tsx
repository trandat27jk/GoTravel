// app/destinations/page.tsx
// This is a Server Component. It now performs all filtering, sorting, and pagination server-side.
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { FaImage } from 'react-icons/fa';

import DurationFilter from '@/components/DurationFilter';
import TourTypeFilter from '@/components/TourTypeFilter';
import SortFilter from '@/components/SortFilter';

interface DestinationItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  duration: number; // Numeric duration
  group_size?: number;
  highlights?: string[];
  province: string;
  country: string;
  gallery?: string[]; // CHANGED: Added 'gallery' as string array
  cover_image?: string; // CHANGED: Added 'cover_image' as string
  rating?: number; // Numeric rating
  discount?: string;
  original_price?: number;
  tour_type?: string;
}

// Helper functions for parsing duration/rating are NO LONGER NEEDED for filtering/sorting
// as these columns are now numeric in the DB.

const ITEMS_PER_PAGE = 6;

const durationOptions = [
  { key: '', label: 'Any duration', min: null, max: null },
  { key: '1-3', label: '1-3 days', min: 1, max: 3 },
  { key: '4-7', label: '4-7 days', min: 4, max: 7 },
  { key: '8-14', label: '8-14 days', min: 8, max: 14 },
  { key: '15+', label: '15+ days', min: 15, max: null }
];

const sortOptions = [
  { key: 'featured', label: 'Featured', column: null, ascending: null },
  { key: 'price_asc', label: 'Price (Low to High)', column: 'price', ascending: true },
  { key: 'price_desc', label: 'Price (High to Low)', column: 'price', ascending: false },
  { key: 'duration_asc', label: 'Duration (Shortest)', column: 'duration', ascending: true },
  { key: 'duration_desc', label: 'Duration (Longest)', column: 'duration', ascending: false },
  { key: 'rating_desc', label: 'Rating (High to Low)', column: 'rating', ascending: false },
];


export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const currentPage = parseInt(searchParams.page as string || '1', 10);
  const selectedDurationKey = searchParams.duration as string || '';
  const tourTypeParam = searchParams.tourType;
  const selectedTourTypes = Array.isArray(tourTypeParam) ? tourTypeParam : (tourTypeParam ? [tourTypeParam] : []);
  const selectedSortKey = searchParams.sortBy as string || 'featured';

  const supabase = createClient();

  // --- Server-side Filtering, Sorting, and Pagination ---
  // Ensure we select 'gallery' and 'cover_image' if they exist in your DB
  let query = supabase.from('tours').select('*, gallery, cover_image', { count: 'exact' }); // Select all columns and get exact count

  // 1. Tour Type Filter
  if (selectedTourTypes.length > 0) {
    query = query.in('tour_type', selectedTourTypes);
  }

  // 2. Duration Filter (NOW SERVER-SIDE)
  if (selectedDurationKey && selectedDurationKey !== '') {
    const durationOption = durationOptions.find(opt => opt.key === selectedDurationKey);

    if (durationOption && (durationOption.min !== null || durationOption.max !== null)) {
      if (durationOption.max === null) { // For '15+ days'
        query = query.gte('duration', durationOption.min);
      } else { // For ranges like '1-3 days'
        query = query.gte('duration', durationOption.min).lte('duration', durationOption.max);
      }
    }
  }

  // 3. Sorting (NOW FULLY SERVER-SIDE)
  const sortOption = sortOptions.find(opt => opt.key === selectedSortKey);
  if (sortOption && sortOption.column) {
    query = query.order(sortOption.column, { ascending: sortOption.ascending });
  } else {
    query = query.order('id', { ascending: true }); // Default sort if no specific sort or 'featured'
  }

  // 4. Pagination (NOW FULLY SERVER-SIDE)
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  query = query.range(offset, offset + ITEMS_PER_PAGE - 1);

  const { data: destinationsData, error, count } = await query;

  if (error) {
    console.error('Error fetching destinations:', error);
    return <div className="p-6 text-red-600">Error loading destinations: {error.message}</div>;
  }

  const destinationsToDisplay: DestinationItem[] = destinationsData || [];
  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;


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
        {/* Sort Filter - Client Component */}
        <SortFilter />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Duration Filter - Client Component */}
          <DurationFilter />

          {/* Tour Type filter - Client Component */}
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
            destinationsToDisplay.map((place) => {
              let rawImageUrl: string | undefined;

              // Prioritize tourItem.gallery[0] if it's a valid string
              if (Array.isArray(place.gallery) && place.gallery.length > 0 && typeof place.gallery[0] === 'string') {
                rawImageUrl = place.gallery[0];
              } else if (typeof place.cover_image === 'string') { // Fallback to cover_image if it's a valid string
                rawImageUrl = place.cover_image;
              }

              let finalSrc: string | undefined = undefined; // Initialize as undefined

              if (rawImageUrl && rawImageUrl.trim() !== '') { // Ensure it's a non-empty string after trimming
                if (rawImageUrl.startsWith('http://') || rawImageUrl.startsWith('https://')) {
                  finalSrc = rawImageUrl; // Already an absolute URL
                } else if (rawImageUrl.startsWith('/')) {
                  finalSrc = rawImageUrl; // Already starts with '/', assume public folder
                } else {
                  // If it's a relative path like "images/halongbay.jpg" or "assets/images/halongbay.jpg"
                  // Prepend '/' to make it an absolute path from the public directory root
                  finalSrc = `/${rawImageUrl}`;
                }
              }

              return (
                <div key={place.id} className="bg-white rounded-lg shadow border border-gray-100 flex flex-col md:flex-row overflow-hidden h-[212px] transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative md:w-64 w-full h-52 md:h-52 flex-shrink-0">
                    {finalSrc ? ( // Only render Image if finalSrc is valid (not undefined)
                      <Image
                        src={finalSrc}
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
                      <p className="text-xs text-gray-400 mb-1">{place.duration} days</p> {/* Display as "X days" */}
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
              );
            })
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
