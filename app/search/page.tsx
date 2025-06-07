// app/search/page.tsx
"use client"; // This is a client component to handle interactivity

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react'; // Added Suspense import
import Link from 'next/link';
import Image from 'next/image';
import { FaImage, FaMagic } from 'react-icons/fa';

// Define the type for a Tour item, consistent with your database schema
interface Tour {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  duration: number; // Numeric duration (integer)
  group_size?: number;
  highlights?: string[];
  province: string;
  country: string;
  gallery?: string[]; // Array of string URLs
  cover_image?: string; // Single string URL
  rating?: number; // Numeric rating
  discount?: string;
  original_price?: number;
  tour_type?: string;
}

// Helper function to parse duration from string (e.g., "4 days" -> 4)
function parseDurationToDays(durationStr: string | null | undefined): number | null {
  if (typeof durationStr !== 'string' || !durationStr.trim()) {
    console.log(`parseDurationToDays: Invalid input '${durationStr}', returning null.`);
    return null;
  }
  const match = durationStr.match(/(\d+)\s*day/i);
  if (match && match[1]) {
    const parsed = parseInt(match[1], 10);
    console.log(`parseDurationToDays: Parsed '${durationStr}' to ${parsed} days.`);
    return parsed;
  }
  console.log(`parseDurationToDays: No match found for '${durationStr}', returning null.`);
  return null;
}

// Separate component for search results logic and display, wrapped in Suspense
function SearchResultsContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  const destinationQuery = searchParams.get('destination')?.toLowerCase() || '';
  const selectedDurationKey = searchParams.get('durationRange');
  const selectedGroupSizeKey = searchParams.get('groupSize');
  const tourTypeQuery = searchParams.get('tour')?.toLowerCase() || ''; // Added tourTypeQuery back as per your page.tsx

  // These option arrays are defined inside the component to correctly handle the
  // `react-hooks/exhaustive-deps` ESLint warning. They are constant within this component.
  const durationOptions = [
    { key: '', label: 'Any duration', min: null, max: null },
    { key: '1-3', label: '1-3 days', min: 1, max: 3 },
    { key: '4-7', label: '4-7 days', min: 4, max: 7 },
    { key: '8-14', label: '8-14 days', min: 8, max: 14 },
    { key: '15+', label: '15+ days', min: 15, max: null }
  ];

  const groupSizeOptions = [
    { key: '', label: 'All group sizes', min: null, max: null },
    { key: 'personal', label: 'Personal (1 person)', min: 1, max: 1 },
    { key: 'small', label: 'Small Group (2-5 people)', min: 2, max: 5 },
    { key: 'medium', label: 'Medium Group (6-12 people)', min: 6, max: 12 },
    { key: 'large', label: 'Large Group (13+ people)', min: 13, max: null }
  ];

  useEffect(() => {
    // Dynamic import for Supabase client is necessary inside a Client Component's useEffect
    // to avoid bundling server-only code (like createClient) into the client bundle,
    // which can happen even with "use client" if not careful.
    // Assuming '../../utils/supabase/client' exports a client-side Supabase instance.
    import('../../utils/supabase/client').then(({ default: supabaseClient }) => {
      async function fetchSearchResults() {
        setLoading(true);
        setNoResults(false);
        setResults([]);

        let query = supabaseClient.from('tours').select('*'); // Use the dynamically imported client

        // --- Apply Filters ---

        // 1. Destination Filter
        if (destinationQuery) {
          const searchText = destinationQuery.trim().toLowerCase();
          query = query.or(
            `title.ilike.%${searchText}%,description.ilike.%${searchText}%,province.ilike.%${searchText}%,country.ilike.%${searchText}%,slug.ilike.%${searchText}%`
          );
          console.log('Applying Destination Filter:', `title.ilike.%${searchText}%,...`);
        }

        // 2. Duration Filter (assumes 'duration' is numeric in DB based on your Tour interface)
        if (selectedDurationKey && selectedDurationKey !== '') {
          const durationOption = durationOptions.find(opt => opt.key === selectedDurationKey);

          if (durationOption && (durationOption.min !== null || durationOption.max !== null)) {
            if (durationOption.max === null) {
              query = query.gte('duration', durationOption.min);
              console.log(`Applying Duration Filter: duration >= ${durationOption.min}`);
            } else {
              query = query.gte('duration', durationOption.min).lte('duration', durationOption.max);
              console.log(`Applying Duration Filter: duration between ${durationOption.min} and ${durationOption.max}`);
            }
          } else {
            console.warn(`Unknown or invalid duration key received: ${selectedDurationKey}`);
          }
        }

        // 3. Group Size Filter
        if (selectedGroupSizeKey && selectedGroupSizeKey !== '') {
          const option = groupSizeOptions.find(o => o.key === selectedGroupSizeKey);

          if (option && (option.min !== null || option.max !== null)) {
            if (option.max === null) {
              query = query.gte('group_size', option.min);
              console.log(`Applying Group Size Filter: group_size >= ${option.min}`);
            } else {
              query = query.gte('group_size', option.min).lte('group_size', option.max);
              console.log(`Applying Group Size Filter: group_size between ${option.min} and ${option.max}`);
            }
          } else {
            console.warn(`Unknown or invalid group size key received: ${selectedGroupSizeKey}`);
          }
        }

        // 4. Tour Type Filter (using highlights array)
        if (tourTypeQuery && tourTypeQuery !== 'all tours') {
          query = query.filter('highlights', 'cs', `{${tourTypeQuery}}`);
          console.log(`Applying Tour Type Filter (highlights): highlights contains '${tourTypeQuery}'`);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching search results from Supabase:', error);
          setResults([]);
          setNoResults(true);
        } else {
          setResults(data as Tour[]);
          if (data.length === 0) {
            setNoResults(true);
          }
        }
        setLoading(false);
      }
      fetchSearchResults();
    });
  }, [destinationQuery, selectedDurationKey, selectedGroupSizeKey, tourTypeQuery]); // REMOVED: durationOptions and groupSizeOptions from dependencies

  const headerText = [
    destinationQuery && `Destination: "${destinationQuery}"`,
    selectedDurationKey && durationOptions.find(o => o.key === selectedDurationKey)?.label && `Duration: "${durationOptions.find(o => o.key === selectedDurationKey)?.label}"`,
    selectedGroupSizeKey && groupSizeOptions.find(o => o.key === selectedGroupSizeKey)?.label && `Group Size: "${groupSizeOptions.find(o => o.key === selectedGroupSizeKey)?.label}"`,
    tourTypeQuery && tourTypeQuery !== 'all tours' && `Tour Type: "${tourTypeQuery}"`
  ].filter(Boolean).join(' & ');


  return (
    <main className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 text-[#1A1A4B]">
      <h1 className="text-3xl font-bold mb-8">
        Search Results {headerText ? `for: ${headerText}` : 'for all tours'}
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
          {results.map((tourItem: Tour) => {
            let rawImageUrl: string | undefined;

            if (Array.isArray(tourItem.gallery) && tourItem.gallery.length > 0 && typeof tourItem.gallery[0] === 'string') {
              rawImageUrl = tourItem.gallery[0];
            } else if (typeof tourItem.cover_image === 'string') {
              rawImageUrl = tourItem.cover_image;
            }

            let finalSrc: string | undefined = undefined;

            if (rawImageUrl && rawImageUrl.trim() !== '') {
              if (rawImageUrl.startsWith('http://') || rawImageUrl.startsWith('https://')) {
                finalSrc = rawImageUrl;
              } else if (rawImageUrl.startsWith('/')) {
                finalSrc = rawImageUrl;
              } else {
                finalSrc = `/${rawImageUrl}`;
              }
            }

            console.log(`Image Debug - Tour: ${tourItem.title}`);
            console.log(`  Raw imageUrl: ${rawImageUrl}`);
            console.log(`  Final src for Image component: ${finalSrc}`);


            return (
              <Link href={`/tour_details/${tourItem.slug}`} key={tourItem.id}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition transform duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                  <div className="relative w-full h-48 flex items-center justify-center bg-gray-200 text-gray-400">
                    {finalSrc ? (
                      <Image
                        src={finalSrc}
                        alt={tourItem.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <FaImage className="text-6xl" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-400">{tourItem.province}, {tourItem.country}</p>
                    <h4 className="text-base font-semibold text-[#1A1A4B] mb-2">
                      {tourItem.title}
                    </h4>
                    <div className="flex justify-between text-sm font-medium text-[#1A1A4B]">
                      <span>{tourItem.duration} days</span>
                      <span>
                        From <span className="font-bold">${tourItem.price}</span>
                      </span>
                    </div>
                    {tourItem.group_size !== undefined && (
                      <div className="mt-1 text-xs text-gray-500">
                        Group Size: {tourItem.group_size}
                      </div>
                    )}
                    {tourItem.highlights && tourItem.highlights.length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        Highlights: {tourItem.highlights.join(', ')}
                      </div>
                    )}
                    {tourItem.tour_type && (
                      <div className="mt-2 text-xs text-gray-600">
                        Type: {tourItem.tour_type}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}

// The main default export for the page, which wraps the content in Suspense
export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div>Loading search page...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
