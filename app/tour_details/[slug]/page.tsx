// app/tours/[slug]/page.tsx
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import TourReviewsSection from '@/components/TourReviewsSection'; // Assuming this path is correct

// Define an interface for your Tour data, including the related activities structure
interface Tour {
  id: string; // UUID from DB
  slug: string;
  title: string;
  location: string;
  languages: string[];
  duration: string; // e.g., "3 days"
  group_size: string; // e.g., "10 people"
  ages_range?: string; // Optional: e.g., "18-99 yrs" - Add this column to your 'tours' table if you want to use it dynamically
  price: number;
  description: string;
  highlights: string[]; // Array of strings (if still used alongside activities)
  included?: string[]; // Array of strings for what's included
  cover_image: string; // URL for the main image (first image in the 1+2 layout)
  gallery: string[]; // Array of URLs for the gallery images (will contain exactly 2 more images for the 1+2 layout)
  rating_avg?: number; // Optional: for average rating display, if calculated (e.g., 4.8)
  reviews_count?: number; // Optional: for review count display, if calculated (e.g., 269)
  booked_count?: number; // Optional: for booked count display (e.g., 30K+)

  // Include activities array here, matching the columns that exist in your DB.
  // Supabase will return an array of related rows under the 'activities' key.
  // We assume one row in 'activities' per tour for these activity fields.
  activities?: {
    id: string;
    tour_id: string; // This is the foreign key to tours.id
    activity_1: string | null;
    activity_2: string | null;
    activity_3: string | null;
    activity_4: string | null;
  }[];
}

export default async function TourDetailPage(props: { params: { slug: string } }) {
  const { slug } = props.params;

  const supabase = await createClient();

  // Fetch tour details AND related activities data using a JOIN (implicitly through Supabase)
  // Select tour fields and SPECIFIC activity columns from the 'activities' table
  const { data: tour, error: tourError } = await supabase
    .from('tours')
    .select('*, activities(id, tour_id, activity_1, activity_2, activity_3, activity_4)')
    .eq('slug', slug)
    .single();

  if (tourError || !tour) {
    console.error("Tour fetch error:", tourError);
    return <div className="p-10 text-red-600">Tour not found</div>;
  }

  // Debugging: Log the tour ID fetched on the server
  console.log(`SERVER: TourDetailPage - Fetched tour ID for slug "${slug}" is: "${tour.id}"`);

  // Fallbacks for potentially missing data
  const languagesDisplay = tour.languages?.join(', ') || 'N/A';
  const highlightsDisplay = tour.highlights || []; // Keep this if 'highlights' is still a separate concept
  const galleryImages = tour.gallery || []; // Default to empty array if null/undefined
  const includedItems = tour.included || []; // Default to empty array if null/undefined

  // Extract the single row of activities data for this tour
  // Assuming 'activities' table has one row per tour for these specific activity fields
  const tourActivitiesData = tour.activities && tour.activities.length > 0 ? tour.activities[0] : null;

  // Prepare the itinerary list from activity_1 to activity_4
  const itineraryList: { day_number: number; title: string; description?: string }[] = [];

  if (tourActivitiesData) {
    // Dynamically add activities to itineraryList if they exist and are not empty
    if (tourActivitiesData.activity_1) {
      itineraryList.push({ day_number: 1, title: tourActivitiesData.activity_1 });
    }
    if (tourActivitiesData.activity_2) {
      itineraryList.push({ day_number: 2, title: tourActivitiesData.activity_2 });
    }
    if (tourActivitiesData.activity_3) {
      itineraryList.push({
        day_number: 3,
        title: tourActivitiesData.activity_3,
        // Static description from the image example, as there's no DB column for it.
        // If you need this dynamic per activity_X, you would need to add activity_X_description columns to your DB.
        description: 'Like all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in.'
      });
    }
    if (tourActivitiesData.activity_4) {
      itineraryList.push({ day_number: 4, title: tourActivitiesData.activity_4 });
    }
    // Add more conditions here if you have activity_5, activity_6, etc., columns in your DB
  }

  const {
    id,
    title,
    location,
    duration,
    group_size,
    ages_range,
    price,
    description,
    cover_image,
    gallery, // Make sure gallery is destructured if used directly in JSX
    rating_avg,
    reviews_count,
    booked_count
  } = tour;

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 bg-white">
      {/* Page Header (Tour Title and Sub-info) */}
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A4B] leading-tight">{title}</h1>
        <div className="flex items-center text-lg text-gray-600 mt-2">
          {/* Mock values for rating and booked count, replace with tour.rating_avg and tour.reviews_count if available */}
          <span className="font-semibold text-orange-500 mr-2">{rating_avg?.toFixed(1) || '4.8'}</span>
          <span className="text-sm">({reviews_count || '269'})</span>
          <span className="mx-3">|</span>
          <span className="mr-3">📍 {location}</span>
          <span className="hidden sm:inline">|</span>
          <span className="font-semibold text-gray-700 ml-3 hidden sm:inline">{booked_count ? `${(booked_count / 1000).toFixed(0)}K+` : '30K+'} booked</span>
          
          {/* Share & Wishlist - These would be interactive client components */}
          <div className="ml-auto flex space-x-4 text-blue-600 font-medium">
            <button className="hover:underline">Share</button>
            <button className="hover:underline">Wishlist</button>
          </div>
        </div>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 mb-8 md:h-[500px]">
      {/* Big image: spans two rows */}
      <div className="relative md:row-span-2 md:col-span-2 rounded-xl overflow-hidden shadow-lg h-[300px] md:h-full">
        <Image
          src={cover_image}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 66vw"
        />
      </div>
      {/* Small image 1 (top right) */}
      <div className="relative rounded-xl overflow-hidden shadow-md h-[150px] md:h-full">
        <Image
          src={gallery[0]}
          alt={`${title} gallery 1`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      {/* Small image 2 (bottom right) */}
      <div className="relative rounded-xl overflow-hidden shadow-md h-[150px] md:h-full">
        <Image
          src={gallery[1]}
          alt={`${title} gallery 2`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
    </div>



      {/* Key Tour Details Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-lg text-gray-700 font-semibold mb-10 p-4 border-y border-gray-200">
        <div className="flex items-center">
          <span>⏱️ {duration}</span>
        </div>
        <div className="flex items-center">
          <span>👥 {group_size}</span>
        </div>
        <div className="flex items-center">
          <span>👶 {ages_range || 'All ages'}</span>
        </div>
        <div className="flex items-center">
          <span>🗣️ {languagesDisplay}</span>
        </div>
      </div>

      {/* Main Content Area (Overview, Itinerary) and Booking Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {/* Tour Overview */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A4B] mb-4">Tour Overview</h2>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </section>

          {/* Itinerary Section - Using fixed activity_1 to activity_4 columns */}
          {itineraryList.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#1A1A4B] mb-6">Itinerary</h2>
              <div className="relative pl-6">
                {/* Dotted line timeline */}
                <div className="absolute left-[8px] top-0 h-full w-[2px] bg-orange-300 opacity-60"></div>
                {itineraryList.map((item, index) => (
                  <div key={index} className="mb-8 relative">
                    {/* Circle for each day */}
                    <div className={`absolute -left-2 top-0 w-5 h-5 rounded-full flex items-center justify-center
                      ${item.description ? 'bg-orange-500' : 'bg-orange-400 border border-orange-500'}`}>
                      {item.description && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="ml-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Day {item.day_number}: {item.title}</h3>
                      {item.description && (
                        <p className="text-gray-700 leading-relaxed pl-2">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Highlights (if still separate from activities) */}
          {highlightsDisplay.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#1A1A4B] mb-4">Tour Highlights</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {highlightsDisplay.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Included (if still separate from activities/highlights) */}
          {includedItems.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#1A1A4B] mb-4">What&apos;s Included</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {includedItems.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* This is where your TourReviewsSection would go */}
          <TourReviewsSection tourId={id} />

        </div>

        {/* Booking Sidebar (This would typically be a Client Component) */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 sticky top-10">
            <h3 className="text-xl font-bold text-gray-800 mb-4">From ${price}</h3>
            
            {/* Date Picker Mock */}
            <div className="mb-4">
              <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="text"
                id="date-range"
                defaultValue="February 05 - March 14"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                readOnly
              />
            </div>

            {/* Time Slot Mock */}
            <div className="mb-6">
              <label htmlFor="time-slot" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <select
                id="time-slot"
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500"
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
                <span>Adult (18+ years) ${ (price * 0.95).toFixed(2) }</span>
                <input type="number" defaultValue="0" min="0" className="w-16 text-center border border-gray-300 rounded-md py-1" />
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span>Youth (13-17 years) ${ (price * 0.85).toFixed(2) }</span>
                <input type="number" defaultValue="0" min="0" className="w-16 text-center border border-gray-300 rounded-md py-1" />
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span>Children (0-12 years) ${ (price * 0.5).toFixed(2) }</span>
                <input type="number" defaultValue="0" min="0" className="w-16 text-center border border-gray-300 rounded-md py-1" />
              </div>
            </div>

            {/* Add Extra Section */}
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Add Extra</h4>
            <div className="flex justify-between items-center mb-6">
              <label htmlFor="service-per-booking" className="text-gray-700">Add Service per booking</label>
              <span className="font-semibold text-gray-800">$40</span>
              <input type="checkbox" id="service-per-booking" className="form-checkbox h-5 w-5 text-blue-600" />
            </div>

            {/* Total Price & Book Now Button */}
            <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-4">
              <span>Total</span>
              <span>$ {price.toFixed(2)}</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md">
              Book Now
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}