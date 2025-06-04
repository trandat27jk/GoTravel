import { createClient } from '@/utils/supabase/server';
import Image from 'next/image'; // Import Image component

export default async function TourDetailPage(props: { params: { slug: string } }) {
  const {slug} = props.params;

  const supabase = await createClient();
  const { data: tour, error } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !tour) {
    return <div className="p-10 text-red-600">Tour not found</div>;
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A4B]">{tour.title}</h1>
        <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-2">
          <span>📍 {tour.location}</span>
          <span>🌐 {tour.languages?.join(', ')}</span>
        </div>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative w-full h-72 md:col-span-2"> {/* Wrapper for Image */}
          <Image
            src={tour.cover_image}
            alt="Cover"
            fill
            className="rounded-lg object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {tour.gallery?.slice(0, 4).map((url: string, i: number) => (
            <div key={i} className="relative w-full h-36"> {/* Wrapper for Image */}
              <Image
                src={url}
                alt={`Gallery ${i}`}
                fill
                className="rounded-lg object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tour Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-[#1A1A4B] mb-6">
        <div><strong>💰 Price:</strong> ${tour.price}</div>
        <div><strong>🕒 Duration:</strong> {tour.duration}</div>
        <div><strong>👥 Group Size:</strong> {tour.group_size}</div>
        <div><strong>💬 Languages:</strong> {tour.languages?.join(', ')}</div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#1A1A4B] mb-2">Tour Overview</h2>
        <p className="text-gray-700 leading-relaxed">{tour.description}</p>
      </div>

      {/* Highlights */}
      {tour.highlights?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#1A1A4B] mb-2">Tour Highlights</h2>
          <ul className="list-disc list-inside text-gray-700">
            {tour.highlights.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Included */}
      {tour.included?.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-[#1A1A4B] mb-2">What&apos;s Included</h2> {/* Fixed unescaped apostrophe */}
          <ul className="list-disc list-inside text-gray-700">
            {tour.included.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
