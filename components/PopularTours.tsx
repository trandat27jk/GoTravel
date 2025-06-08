// components/PopularTours.tsx
// This is a Server Component, so no "use client" directive here.
// Data fetching happens directly on the server.
import Link from "next/link";
import Image from "next/image"; // Import Image component for optimized images
import { createClient } from '@/utils/supabase/server'; // Import the server-side Supabase client
import { FaImage, FaStar } from 'react-icons/fa'; // Import FaImage for fallback, FaStar for rating stars

// Define the type for a Tour item, consistent with your database schema
interface TourItem {
  id: string; // Assuming 'id' is a string/uuid
  slug: string;
  title: string;
  province: string; // Assuming location is split into province and country
  country: string;
  rating?: number; // OPTIMIZED: Assumed to be number for star display
  duration: number; // OPTIMIZED: Assumed to be number for clarity
  price: number;
  cover_image?: string; // Changed from cover_img_gallery to cover_image (singular)
}

export default async function PopularTours() {
  const supabase = createClient(); // Use the server-side Supabase client

  // Fetch exactly 8 tours for the 4 columns, 2 rows grid
  const { data: tours, error } = await supabase
    .from('tours')
    // Changed select to include 'cover_image' instead of 'cover_img_gallery'
    .select('id, slug, title, province, country, rating, duration, price, cover_image') // Ensure duration is fetched correctly
    .limit(8); // Fetch 8 popular tours for the 4-column layout (2 rows of 4)

  if (error) {
    console.error('Error fetching popular tours:', error);
    return (
      <section id="find-popular-tours" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-red-600">Failed to load popular tours. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (!tours || tours.length === 0) {
    return (
      <section id="find-popular-tours" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">No popular tours found at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="find-popular-tours" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-[#1A1A4B]">Find Popular Tours</h2>
          {/* Ensure the Link goes to /destinations */}
          <Link href="/destinations" className="text-sm font-medium text-[#1A1A4B] hover:underline">See all</Link>
        </div>

        {/* Change grid layout to 4 columns for larger screens, 2 for medium, 1 for small */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour: TourItem) => (
            <Link href={`/tour_details/${tour.slug}`} key={tour.id}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition transform duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col h-[350px]"> {/* Added flex flex-col and fixed height */}
                <div className="relative w-full h-48 flex items-center justify-center bg-gray-200 text-gray-400 flex-shrink-0"> {/* flex-shrink-0 to keep image height fixed */}
                  {/* Use tour.cover_image directly, with FaImage fallback */}
                  {tour.cover_image ? (
                    <Image
                      src={tour.cover_image} // Changed to tour.cover_image
                      alt={tour.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" // Adjusted sizes for responsiveness
                    />
                  ) : (
                    <FaImage className="text-6xl" />
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow"> {/* Added flex flex-col and flex-grow for content */}
                  <p className="text-sm text-gray-400">{tour.province}, {tour.country}</p>
                  <h4 className="text-base font-semibold text-[#1A1A4B] mb-2 line-clamp-2"> {/* Added line-clamp-2 for title truncation */}
                    {tour.title}
                  </h4>
                  {/* --- IMPROVED CLARITY FOR RATING --- */}
                  {tour.rating !== undefined && ( // Check if rating exists
                    <p className="text-sm text-gray-500 mb-2 flex items-center">
                      <span className="font-bold text-[#1A1A4B] mr-1">{tour.rating.toFixed(1)}</span> {/* Display one decimal place */}
                      {/* Display stars based on rating value */}
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(tour.rating as number) ? 'text-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-1 text-gray-500 text-xs">Rating</span> {/* Add clear "Rating" label */}
                    </p>
                  )}
                  {/* --- IMPROVED CLARITY FOR DURATION --- */}
                  <div className="flex justify-between text-sm font-medium text-[#1A1A4B] mt-auto"> {/* mt-auto to push to bottom */}
                    <span>
                      {typeof tour.duration === 'number'
                        ? `${tour.duration} day${tour.duration === 1 ? '' : 's'}`
                        : tour.duration}
                    </span>
                    <span>
                      From <span className="font-bold">${tour.price}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
