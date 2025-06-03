// app/search/page.tsx
// This is a Server Component, indicated by the async function and direct Supabase access.
import { createClient } from '@/utils/supabase/server'; // Assuming this is your server-side client
import Link from 'next/link'; // For linking to tour details
import Image from 'next/image'; // For optimized images
import { FaImage } from 'react-icons/fa'; // For image fallback when no cover image

// Define the type for a Tour item for better type safety
interface Tour {
  id: string; // Assuming 'id' is a string/uuid based on your schema
  slug: string;
  title: string;
  description: string;
  price: number;
  duration: string; // CORRECTED: Changed from original_duration to duration
  group_size?: number; // Optional, as some tours might not have it explicitly
  highlights?: string[]; // Array of text
  province: string;
  country: string;
  cover_img_gallery?: string[]; // Array of image URLs (assuming this is how your gallery is structured)
  // Add other fields from your Supabase 'tours' table as needed
}

// Helper function to parse duration from string (e.g., "4 days" -> 4)
// Handles cases where durationStr might be null, undefined, or not a string.
function parseDurationToDays(durationStr: string | null | undefined): number | null {
  // Ensure durationStr is a non-empty string before attempting to match
  if (typeof durationStr !== 'string' || !durationStr.trim()) {
    console.log(`parseDurationToDays: Invalid input '${durationStr}', returning null.`);
    return null; // Return null if it's not a valid string or is empty
  }
  // Matches one or more digits followed by optional space(s) and "day" (case-insensitive)
  const match = durationStr.match(/(\d+)\s*day/i);
  if (match && match[1]) {
    const parsed = parseInt(match[1], 10);
    console.log(`parseDurationToDays: Parsed '${durationStr}' to ${parsed} days.`);
    return parsed; // Parse the matched number
  }
  console.log(`parseDurationToDays: No match found for '${durationStr}', returning null.`);
  return null; // Return null if parsing fails (e.g., "3 nights" or "Full day")
}

export default async function SearchPage({ searchParams }: {
  searchParams: {
    destination?: string;
    durationRange?: string; // New parameter for duration key (e.g., '4-7')
    groupSize?: string; // Parameter for group size key (e.g., 'medium')
  }
}) {
  const destinationQuery = searchParams.destination;
  const selectedDurationKey = searchParams.durationRange;
  const selectedGroupSizeKey = searchParams.groupSize;

  // --- DEBUGGING LOGS ---
  console.log('--- SearchPage Render ---');
  console.log('Incoming searchParams:', searchParams);
  console.log('Destination Query:', destinationQuery);
  console.log('Selected Duration Key:', selectedDurationKey);
  console.log('Selected Group Size Key:', selectedGroupSizeKey);
  // --- END DEBUGGING LOGS ---

  const durationOptions = [
    { key: '', label: 'Any duration', min: null, max: null },
    { key: '1-3', label: '1-3 days', min: 1, max: 3 },
    { key: '4-7', label: '4-7 days', min: 4, max: 7 },
    { key: '8-14', label: '8-14 days', min: 8, max: 14 },
    { key: '15+', label: '15+ days', min: 15, max: null } // null for no upper limit
  ];

  const groupSizeOptions = [
    { key: '', label: 'All group sizes', min: null, max: null }, // Default/placeholder
    { key: 'personal', label: 'Personal (1 person)', min: 1, max: 1 },
    { key: 'small', label: 'Small Group (2-5 people)', min: 2, max: 5 },
    { key: 'medium', label: 'Medium Group (6-12 people)', min: 6, max: 12 },
    { key: 'large', label: 'Large Group (13+ people)', min: 13, max: null }
  ];

  const supabase = createClient(); // Initialize server-side Supabase client

  let query = supabase.from('tours').select('*'); // Base query to select all columns

  // --- Apply Server-Side Filters ---

  // 1. Destination Filter: Search across multiple relevant text columns
  if (destinationQuery) {
    const searchText = destinationQuery.trim().toLowerCase();
    query = query.or(
      `title.ilike.%${searchText}%,description.ilike.%${searchText}%,province.ilike.%${searchText}%,country.ilike.%${searchText}%,slug.ilike.%${searchText}%`
    );
    console.log('Applying Destination Filter:', `title.ilike.%${searchText}%,...`);
  }

  // 2. Group Size Filter: Apply if a specific group size option is selected
  // This filter is applied server-side using the numeric 'group_size' column.
  if (selectedGroupSizeKey && selectedGroupSizeKey !== '') { // Check if a value was selected
    const option = groupSizeOptions.find(o => o.key === selectedGroupSizeKey);

    if (option && (option.min !== null || option.max !== null)) { // Ensure a valid option with min/max is found
      if (option.max === null) { // For 'large' group, which has no upper limit
        query = query.gte('group_size', option.min);
        console.log(`Applying Group Size Filter: group_size >= ${option.min}`);
      } else { // For 'personal', 'small', 'medium' groups (range filter)
        query = query.gte('group_size', option.min).lte('group_size', option.max);
        console.log(`Applying Group Size Filter: group_size between ${option.min} and ${option.max}`);
      }
    } else {
      console.warn(`Unknown or invalid group size key received: ${selectedGroupSizeKey}`);
    }
  }

  // Execute the Supabase query to get initial data
  const { data, error } = await query;

  if (error) {
    console.error('Error fetching search results from Supabase:', error);
    return <div className="p-6 text-red-600">Error fetching results: {error.message}</div>;
  }

  // --- DEBUGGING LOGS ---
  console.log('Raw data from Supabase (before client-side filtering):', data);
  // --- END DEBUGGING LOGS ---


  // --- Client-Side Duration Filtering ---
  // This is necessary because 'duration' is a text field in your Supabase DB.
  // We fetch all data that matches other server-side filters, then filter by duration in memory.
  let filteredResults: Tour[] = data || []; // Initialize with data from Supabase

  if (selectedDurationKey && selectedDurationKey !== '') { // Apply duration filter if a key is selected
    const durationOption = durationOptions.find(opt => opt.key === selectedDurationKey);

    if (durationOption && (durationOption.min !== null || durationOption.max !== null)) { // Ensure a valid option with min/max
      console.log(`Applying Client-Side Duration Filter for key: ${selectedDurationKey}`);
      filteredResults = filteredResults.filter(tour => {
        // CORRECTED: Use tour.duration instead of tour.original_duration
        const tourDurationDays = parseDurationToDays(tour.duration);
        console.log(`Tour '${tour.title}' duration: '${tour.duration}', parsed to: ${tourDurationDays}`);

        if (tourDurationDays === null) {
          console.log(`  -> Excluded (unparseable duration)`);
          return false; // Exclude tours if their duration cannot be parsed
        }

        // Check if the tour's duration falls within the selected range
        const minMatch = durationOption.min === null || tourDurationDays >= durationOption.min;
        const maxMatch = durationOption.max === null || tourDurationDays <= durationOption.max;

        const matches = minMatch && maxMatch;
        console.log(`  -> Matches duration range (${durationOption.min}-${durationOption.max}): ${matches}`);
        return matches;
      });
    } else {
      console.warn(`Unknown or invalid duration key received: ${selectedDurationKey}`);
    }
  }

  // --- DEBUGGING LOGS ---
  console.log('Final filtered results (after client-side filtering):', filteredResults);
  console.log('Number of final results:', filteredResults.length);
  console.log('--- End SearchPage Render ---');
  // --- END DEBUGGING LOGS ---

  // Prepare a readable search term string for the header display
  const searchTermDisplay: string[] = [];
  if (destinationQuery) {
    searchTermDisplay.push(`Destination: "${destinationQuery}"`);
  }
  if (selectedDurationKey && selectedDurationKey !== '') {
    const selectedLabel = durationOptions.find(o => o.key === selectedDurationKey)?.label;
    if (selectedLabel) {
      searchTermDisplay.push(`Duration: "${selectedLabel}"`);
    }
  }
  if (selectedGroupSizeKey && selectedGroupSizeKey !== '') {
    const selectedLabel = groupSizeOptions.find(o => o.key === selectedGroupSizeKey)?.label;
    if (selectedLabel) {
      searchTermDisplay.push(`Group Size: "${selectedLabel}"`);
    }
  }
  // Construct the final header text
  const headerText = searchTermDisplay.length > 0 ? `for: ${searchTermDisplay.join(' & ')}` : 'for all tours';


  return (
    <main className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 text-[#1A1A4B]">
      <h1 className="text-3xl font-bold mb-8">
        Search Results {headerText}
      </h1>

      {/* Conditional rendering based on filtered results */}
      {filteredResults.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-700">No results found for your search criteria.</p>
          <p className="text-md text-gray-500 mt-2">Try adjusting your search terms.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Map over the filtered results to display each tour item */}
          {filteredResults.map((tourItem: Tour) => (
            // Link to the individual tour details page using the slug
            <Link href={`/tour_details/${tourItem.slug}`} key={tourItem.id}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition transform duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                <div className="relative w-full h-48 flex items-center justify-center bg-gray-200 text-gray-400">
                  {/* Conditional rendering for tour cover image or a fallback icon */}
                  {tourItem.cover_img_gallery?.[0] ? (
                    <Image
                      src={tourItem.cover_img_gallery[0]}
                      alt={tourItem.title}
                      fill // Fills the parent container
                      className="object-cover" // Ensures the image covers the area without distortion
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Responsive image sizes
                    />
                  ) : (
                    <FaImage className="text-6xl" /> // Large icon as fallback
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-400">{tourItem.province}, {tourItem.country}</p>
                  <h4 className="text-base font-semibold text-[#1A1A4B] mb-2">
                    {tourItem.title}
                  </h4>
                  <div className="flex justify-between text-sm font-medium text-[#1A1A4B]">
                    {/* CORRECTED: Use tourItem.duration for display */}
                    <span>{tourItem.duration}</span>
                    <span>
                      From <span className="font-bold">${tourItem.price}</span>
                    </span>
                  </div>
                  {/* Display group size if available in the tour data */}
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
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
