// components/TrendingDestinations.js
import Image from 'next/image'; // Import Image component
import Link from 'next/link'; // Assuming Link is used for navigation

export default function TrendingDestinations() {
  const destinations = [
    { name: "Paris", image: "/assets/images/paris.jpg", tours: "100+ Tours" },
    { name: "Singapore", image: "/assets/images/singapore.jpg", tours: "300+ Tours" },
    { name: "Roma", image: "/assets/images/roma.jpg", tours: "400+ Tours" },
    { name: "Bangkok", image: "/assets/images/bangkok.jpg", tours: "100+ Tours" },
    { name: "Hanoi", image: "/assets/images/hanoi.jpg", tours: "600+ Tours" },
    { name: "Phuket", image: "/assets/images/phuket.jpg", tours: "200+ Tours" },
    { name: "Tokyo", image: "/assets/images/tokyo.jpg", tours: "700+ Tours" },
    { name: "Hoian", image: "/assets/images/hoian.jpg", tours: "900+ Tours" },
  ];

  return (
    <section id="trending-destinations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-[#1A1A4B]">Trending destinations</h2>
          <a href="#" className="text-sm font-medium text-[#1A1A4B] hover:underline">
            See all
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center transition duration-300 transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative w-28 h-28 mb-4"> {/* Wrapper for Image with fill */}
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill // Use fill to make image cover parent div
                  className="rounded-full object-cover shadow transition-transform duration-300 hover:scale-105"
                  sizes="100px" // Provide a size for optimization
                />
              </div>
              <h4 className="text-md font-semibold text-[#1A1A4B]">{destination.name}</h4>
              <p className="text-sm text-gray-600">{destination.tours}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10 space-x-2">
          <span className="h-2 w-6 rounded-full" style={{ backgroundColor: "#05073C" }}></span>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "rgba(5, 7, 60, 0.5)" }}></span>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "rgba(5, 7, 60, 0.5)" }}></span>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "rgba(5, 7, 60, 0.5)" }}></span>
        </div>
      </div>
    </section>
  );
}
