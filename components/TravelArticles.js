// components/TravelArticles.js
import Image from 'next/image'; // Import Image component

export default function TravelArticles() {
  return (
    <section id="travel-articles" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-orange-400 text-sm uppercase mb-2">Travel Insights</h3>
          <h2 className="text-3xl font-semibold">Latest Travel Articles</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Article 1 */}
          <article className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative w-full h-48"> {/* Wrapper for Image */}
              <Image
                src="/assets/images/travelling.jpg"
                alt="Article 1"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h4 className="font-medium text-lg mb-2">10 Tips for Traveling on a Budget</h4>
              <p className="text-gray-500 text-sm">
                Discover how to save money while enjoying your travels.
              </p>
              <a href="#" className="text-orange-500 hover:underline">
                Read More
              </a>
            </div>
          </article>

          {/* Article 2 */}
          <article className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative w-full h-48"> {/* Wrapper for Image */}
              <Image
                src="/assets/images/adventure.jpg"
                alt="Article 2"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h4 className="font-medium text-lg mb-2">
                Top 5 Destinations for Adventure Seekers
              </h4>
              <p className="text-gray-500 text-sm">
                Explore thrilling locations that offer unforgettable experiences.
              </p>
              <a href="#" className="text-orange-500 hover:underline">
                Read More
              </a>
            </div>
          </article>

          {/* Article 3 */}
          <article className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative w-full h-48"> {/* Wrapper for Image */}
              <Image
                src="/assets/images/cultural.jpg"
                alt="Article 3"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h4 className="font-medium text-lg mb-2">Cultural Etiquette Around the World</h4>
              <p className="text-gray-500 text-sm">
                Learn about the dos and don&apos;ts when visiting different countries. {/* Fixed unescaped apostrophe */}
              </p>
              <a href="#" className="text-orange-500 hover:underline">
                Read More
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
