// app/tours/[slug]/page.tsx
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import TourReviewsSection from '@/components/TourReviewsSection'; // Assuming this path is correct
import BookingSidebar from '@/components/BookingSidebar'; // Import the new client component

// Define an interface for your Tour data
interface Tour {
    id: string;
    slug: string;
    title: string;
    location: string;
    languages: string[];
    duration: string;
    group_size: string;
    ages_range?: string;
    price: number;
    description: string;
    highlights: string[];
    included?: string[];
    excluded?: string[]; // Added for items that are not included
    cover_image: string;
    gallery: string[];
    rating_avg?: number;
    reviews_count?: number;
    booked_count?: number;
    activities?: {
        id: string;
        tour_id: string;
        activity_1: string | null;
        activity_2: string | null;
        activity_3: string | null;
        activity_4: string | null;
    }[];
}

// Placeholder for missing images
const PLACEHOLDER_IMAGE = '/images/placeholder-tour.jpg';

export default async function TourDetailPage(props: { params: { slug:string } }) {
    const { slug } = props.params;

    const supabase = await createClient();

    const { data: tour, error: tourError } = await supabase
        .from('tours')
        .select('*, activities(id, tour_id, activity_1, activity_2, activity_3, activity_4)')
        .eq('slug', slug)
        .single();

    if (tourError || !tour) {
        console.error("Tour fetch error:", tourError);
        return <div className="p-10 text-red-600">Tour not found</div>;
    }

    const languagesDisplay = tour.languages?.join(', ') || 'N/A';
    const highlightsDisplay = tour.highlights || [];
    const includedItems = tour.included || [];
    // For demonstration, using hardcoded excluded items as seen in the image.
    // Ideally, this data would come from your 'tour' object, e.g., tour.excluded
    const excludedItems = tour.excluded || ['Towel', 'Tips', 'Alcoholic Beverages'];


    const tourActivitiesData = tour.activities && tour.activities.length > 0 ? tour.activities[0] : null;

    const itineraryList: { day_number: number; title: string; description?: string }[] = [];

    if (tourActivitiesData) {
        if (tourActivitiesData.activity_1) itineraryList.push({ day_number: 1, title: tourActivitiesData.activity_1 });
        if (tourActivitiesData.activity_2) itineraryList.push({ day_number: 2, title: tourActivitiesData.activity_2 });
        if (tourActivitiesData.activity_3) itineraryList.push({
            day_number: 3,
            title: tourActivitiesData.activity_3,
            description: 'Like all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day so you have this freedom to explore the city and get settled in.'
        });
        if (tourActivitiesData.activity_4) itineraryList.push({ day_number: 4, title: tourActivitiesData.activity_4 });
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
        gallery,
        rating_avg,
        reviews_count,
        booked_count
    } = tour;

    const mainImage = cover_image || PLACEHOLDER_IMAGE;
    const galleryImage1 = (gallery && gallery[0]) || PLACEHOLDER_IMAGE;
    const galleryImage2 = (gallery && gallery[1]) || PLACEHOLDER_IMAGE;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 bg-white rounded-2xl shadow-2xl mt-8 mb-8">
            {/* Page Header */}
            <div className="mb-6 pt-10">
                <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A4B] leading-tight">{title}</h1>
                <div className="flex items-center text-lg text-gray-600 mt-2">
                    <span className="font-semibold text-orange-500 mr-2">{rating_avg?.toFixed(1) || '4.8'}</span>
                    <span className="text-sm">({reviews_count || '269'})</span>
                    <span className="mx-3">|</span>
                    <span className="mr-3">📍 {location}</span>
                    <span className="hidden sm:inline">|</span>
                    <span className="font-semibold text-gray-700 ml-3 hidden sm:inline">{booked_count ? `${(booked_count / 1000).toFixed(0)}K+` : '30K+'} booked</span>
                </div>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 mb-8 md:h-[500px]">
                <div className="relative md:row-span-2 md:col-span-2 rounded-xl overflow-hidden shadow-lg h-[300px] md:h-full">
                    <Image src={mainImage} alt={title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 66vw" />
                </div>
                <div className="relative rounded-xl overflow-hidden shadow-md h-[150px] md:h-full">
                    <Image src={galleryImage1} alt={`${title} gallery 1`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="relative rounded-xl overflow-hidden shadow-md h-[150px] md:h-full">
                    <Image src={galleryImage2} alt={`${title} gallery 2`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
            </div>

            {/* Main Content & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                
                    {/* Key Details Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8 mb-10">
                        <div className="flex items-center">
                            <div className="w-12 h-12 flex-shrink-0 mr-4 rounded-lg bg-gray-100 border border-gray-200"></div>
                            <div>
                                <p className="text-sm font-semibold text-indigo-900">Duration</p>
                                <p className="text-base text-gray-600">{duration}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-12 h-12 flex-shrink-0 mr-4 rounded-lg bg-gray-100 border border-gray-200"></div>
                            <div>
                                <p className="text-sm font-semibold text-indigo-900">Group Size</p>
                                <p className="text-base text-gray-600">{group_size}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-12 h-12 flex-shrink-0 mr-4 rounded-lg bg-gray-100 border border-gray-200"></div>
                            <div>
                                <p className="text-sm font-semibold text-indigo-900">Ages</p>
                                <p className="text-base text-gray-600">{ages_range || 'All ages'}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-12 h-12 flex-shrink-0 mr-4 rounded-lg bg-gray-100 border border-gray-200"></div>
                            <div>
                                <p className="text-sm font-semibold text-indigo-900">Languages</p>
                                <p className="text-base text-gray-600">{languagesDisplay}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tour Overview and Highlights Section */}
                    <section className="mb-10">
                        <h2 className="text-3xl font-bold text-[#1A1A4B] mb-4">Tour Overview</h2>
                        <p className="text-gray-700 leading-relaxed">{description}</p>
                        
                        {highlightsDisplay.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-xl font-medium text-[#1A1A4B] mb-4">Tour Highlights</h2>
                                <ul className="list-disc pl-5 space-y-3 text-gray-700">
                                    {highlightsDisplay.map((highlight: string, index: number) => (
                                        <li key={index}>{highlight}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                    
                    {/* What's Included Section */}
                    {(includedItems.length > 0 || excludedItems.length > 0) && (
                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#1A1A4B] mb-6">What's included</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                                {/* Included Items Column */}
                                <div className="space-y-4">
                                    {includedItems.map((item: string, index: number) => (
                                        <div key={`included-${index}`} className="flex items-center">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 mr-4"></span>
                                            <span className="text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Excluded Items Column */}
                                <div className="space-y-4">
                                    {excludedItems.map((item: string, index: number) => (
                                        <div key={`excluded-${index}`} className="flex items-center">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-100 mr-4"></span>
                                            <span className="text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Itinerary Section */}
                    {itineraryList.length > 0 && (
                        <section className="mb-10">
                             <h2 className="text-3xl font-bold text-[#1A1A4B] mb-6">Itinerary</h2>
                             <div className="relative pl-6">
                                 <div className="absolute left-[8px] top-0 h-full w-[2px] bg-orange-300 opacity-60"></div>
                                 {itineraryList.map((item, index) => (
                                     <div key={index} className="mb-8 relative">
                                         <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full flex items-center justify-center bg-orange-500 border-4 border-white">
                                             {item.description && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                         </div>
                                         <div className="ml-6">
                                             <h3 className="text-lg font-semibold text-gray-800 mb-1">Day {item.day_number}: {item.title}</h3>
                                             {item.description && <p className="text-gray-700 leading-relaxed pl-2">{item.description}</p>}
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        </section>
                    )}

                    {/* Tour Reviews Section */}
                    <TourReviewsSection tourId={id} />
                </div>

                {/* Booking Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-6">
                        <BookingSidebar basePrice={price} duration={duration} tourId={id} tourTitle={title} />
                    </div>
                </aside>
            </div>
        </main>
    );
}