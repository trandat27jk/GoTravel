'use client';

import Image from 'next/image';
import { useState } from 'react';

const destinations = [
  {
    id: 1,
    title: 'Discover the charm of Hoi An',
    location: 'Quang Nam, Vietnam',
    rating: '4.8 (269)',
    desc: 'Hoi An is a charming town with lantern-lit streets and rich heritage.',
    duration: '2 Days 1 Night',
    originalPrice: '$1200',
    price: '$114',
    image: '/assets/images/hoian_card.jpg',
    discount: '20 % OFF',
    link: '/destinations/hoian',
  },
  {
    id: 2,
    title: 'Explore ancient Roma',
    location: 'Roma, Italy',
    rating: '4.8 (269)',
    desc: 'Discover ancient ruins, art, and timeless Italian culture.',
    duration: '4 Days 3 Nights',
    originalPrice: '$1600',
    price: '$234',
    image: '/assets/images/roma_card.jpg',
    discount: '10 % OFF',
    link: '/destinations/roma',
  },
  {
    id: 3,
    title: 'Northern Lights in Iceland',
    location: 'Reykjavik, Iceland',
    rating: '4.8 (269)',
    desc: 'Explore geysers, waterfalls, and glaciers in Iceland.',
    duration: '2 Days 1 Night',
    originalPrice: '$1200',
    price: '$114',
    image: '/assets/images/iceland_card.jpg',
    discount: '20 % OFF',
    link: '/destinations/iceland',
  },
  {
    id: 4,
    title: 'Ha Long Bay Adventure',
    location: 'Quang Ninh, Vietnam',
    rating: '4.8 (269)',
    desc: 'UNESCO World Heritage site with stunning limestone karsts.',
    duration: '2 Days 1 Night',
    originalPrice: '$1200',
    price: '$114',
    image: '/assets/images/Halong_card.jpg',
    discount: '20 % OFF',
    link: '/destinations/halong',
  },
  {
    id: 5,
    title: 'Discover Romantic Paris',
    location: 'Paris, France',
    rating: '4.8 (269)',
    desc: 'Explore the Eiffel Tower, museums, and French cuisine.',
    duration: '3 Days 2 Nights',
    originalPrice: '$1500',
    price: '$198',
    image: '/assets/images/paris_card.jpg',
    discount: '15 % OFF',
    link: '/destinations/paris',
  },
  {
    id: 6,
    title: 'Vibrant Tokyo Experience',
    location: 'Tokyo, Japan',
    rating: '4.8 (269)',
    desc: 'Experience tradition and modernity in Tokyo’s districts.',
    duration: '4 Days 3 Nights',
    originalPrice: '$1800',
    price: '$250',
    image: '/assets/images/tokyo_card.jpg',
    discount: '20 % OFF',
    link: '/destinations/tokyo',
  },
];

export default function DestinationsPage() {
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 text-[#1A1A4B]">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:underline">Home</a> &gt;{' '}
        <a href="#" className="hover:underline">Tours</a> &gt; Phuket
      </nav>

      {/* Title and Sort */}
      <div className="flex justify-between items-start mb-8 flex-col sm:flex-row">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Explore new destinations</h1>
        <div className="relative text-sm text-gray-600">
          <button onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center border border-gray-300 rounded px-3 py-1 bg-white text-[#1A1A4B] hover:border-[#EB662B]">
            Sort by: <span className="ml-1 font-medium">Featured</span>
            <svg className="ml-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {sortOpen && (
            <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg text-[#1A1A4B]">
              <ul className="divide-y divide-gray-100">
                {['Featured', 'Price', 'Duration', 'Rating'].map(option => (
                  <li key={option}>
                    <button onClick={() => setSortOpen(false)}
                      className="w-full text-left px-4 py-2 hover:bg-[#EB662B] hover:text-white">
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow">
            <p className="text-sm font-semibold text-white bg-[#EB662B] px-4 py-2 rounded-t-md">
              When are you traveling?
            </p>
            <div className="bg-white rounded-b-md p-4 border-t">
              <input type="text" value="February 05 ~ March 14" readOnly className="w-full bg-gray-100 rounded px-3 py-2 text-sm text-gray-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold text-sm mb-2">Tour Type</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {['Nature Tours', 'Adventure Tours', 'Cultural Tours', 'Food Tours', 'City Tours', 'Cruises Tours'].map(type => (
                <li key={type}>
                  <label>
                    <input type="checkbox" className="mr-2" /> {type}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Destination Cards */}
        <section className="lg:col-span-3 space-y-6">
          {destinations.map((place) => (
            <div key={place.id} className="bg-white rounded-lg shadow border border-gray-100 flex flex-col md:flex-row overflow-hidden h-[212px] transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative md:w-64 w-full h-52 md:h-52 flex-shrink-0">
                <Image
                  src={place.image}
                  alt={place.title}
                  fill
                  className="object-cover rounded-md"
                />
                <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  {place.discount}
                </span>
              </div>
              <div className="flex-1 px-4 py-2 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-gray-500">{place.location}</p>
                  <h2 className="text-base font-semibold text-[#1A1A4B] leading-snug mt-1 mb-2">
                    {place.title}
                  </h2>
                  <p className="text-sm text-[#1A1A4B] font-medium mb-1">{place.rating}</p>
                  <p className="text-sm text-gray-500 mb-2">{place.desc}</p>
                </div>
                <div className="text-sm text-orange-500 space-x-4">
                  <span>Best Price Guarantee</span>
                  <span>Free Cancellation</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between px-4 py-2 text-sm min-w-[140px] border-l border-gray-100">
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">{place.duration}</p>
                  <p className="text-xs text-gray-400 line-through">{place.originalPrice}</p>
                  <p className="text-[#1A1A4B] font-semibold">From {place.price}</p>
                </div>
                <a
                  href={place.link}
                  className="mt-4 px-4 py-2 rounded-lg border border-[#EB662B] text-[#EB662B] hover:bg-[#EB662B] hover:text-white transition duration-200"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
