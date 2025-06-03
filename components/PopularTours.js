// components/PopularTours.js
"use client";
import Link from "next/link";

const tours = [
  {
    image: "/assets/images/ancient.jpg",
    slug: "hoi-an-ancient-town",
    location: "Hoian, Vietnam",
    title: "Discover the charm of Hoi An’s ancient streets",
    rating: "4.8 (243)",
    duration: "4 days",
    price: "189.25",
  },
  {
    image: "/assets/images/ancient.jpg",
    slug: "hoi-an-ancient-town-3",
    location: "Hoian, Vietnam",
    title: "Discover the charm of Hoi An’s ancient streets (Version 3)",
    rating: "4.8 (243)",
    duration: "4 days",
    price: "189.25",
  },
  {
    image: "/assets/images/halongbay.jpg",
    slug: "ha-long-bay-adventure",
    location: "Quang Ninh, Vietnam",
    title: "Explore the stunning beauty of Ha Long Bay by boat",
    rating: "4.8 (243)",
    duration: "4 days",
    price: "225",
  },
  {
    image: "/assets/images/halongbay.jpg",
    slug: "ha-long-bay-adventure-2",
    location: "Quang Ninh, Vietnam",
    title: "Ha Long Bay Adventure 2",
    rating: "4.8 (243)",
    duration: "4 days",
    price: "214",
  },
  {
    image: "/assets/images/rome.jpg",
    slug: "explore-ancient-rome",
    location: "Rome, Italy",
    title: "Explore Ancient Rome",
    rating: "4.8 (243)",
    duration: "3 days",
    price: "249",
  },
  {
    image: "/assets/images/rome.jpg",
    slug: "explore-ancient-rome-4",
    location: "Rome, Italy",
    title: "Explore Ancient Rome 4",
    rating: "4.8 (243)",
    duration: "3 days",
    price: "239",
  },
  {
    image: "/assets/images/paris.jpg",
    slug: "paris-highlights-tour",
    location: "Paris, France",
    title: "Paris Highlights Tour",
    rating: "4.8 (243)",
    duration: "3 days",
    price: "289",
  },
  {
    image: "/assets/images/paris.jpg",
    slug: "paris-highlights-tour-5",
    location: "Paris, France",
    title: "Paris Highlights Tour 5",
    rating: "4.8 (243)",
    duration: "3 days",
    price: "289",
  },
  {
    image: "/assets/images/tokyo.jpg",
    slug: "tokyo-city-discovery",
    location: "Tokyo, Japan",
    title: "Tokyo City Discovery",
    rating: "4.8 (243)",
    duration: "4 days",
    price: "310",
  },
  {
    image: "/assets/images/tokyo.jpg",
    slug: "tokyo-city-discovery-6",
    location: "Tokyo, Japan",
    title: "Tokyo City Discovery 6",
    rating: "4.8 (243)",
    duration: "4 days",
    price: "290",
  },
];


export default function PopularTours() {
  return (
    <section id="find-popular-tours" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-[#1A1A4B]">Find Popular Tours</h2>
          <a href="#" className="text-sm font-medium text-[#1A1A4B] hover:underline">See all</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour, index) => (
            <Link href={`/tour_details/${tour.slug}`} key={index}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition transform duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-sm text-gray-400">{tour.location}</p>
                  <h4 className="text-base font-semibold text-[#1A1A4B] mb-2">
                    {tour.title}
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">{tour.rating}</p>
                  <div className="flex justify-between text-sm font-medium text-[#1A1A4B]">
                    <span>{tour.duration}</span>
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
