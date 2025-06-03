'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function PopularActivities() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-[#1A1A4B]">Popular things to do</h2>
          <Link href="#" className="text-sm font-medium text-[#1A1A4B] hover:underline">
            See all
          </Link>
        </div>

        <div
          className="grid gap-4"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridAutoRows: '200px',
            gridTemplateAreas: `
              'cruise beach city'
              'museum beach food'
            `,
          }}
        >
          {[
            { area: 'cruise', src: '/assets/images/cruise.jpg', label: 'Cruises' },
            { area: 'beach', src: '/assets/images/beach.jpg', label: 'Beach Tours' },
            { area: 'city', src: '/assets/images/city.jpg', label: 'City Tours' },
            { area: 'museum', src: '/assets/images/museum_tour.jpg', label: 'Museum Tour' },
            { area: 'food', src: '/assets/images/food.jpg', label: 'Food' },
          ].map(({ area, src, label }) => (
            <div
              key={area}
              style={{ gridArea: area }}
              className="relative rounded-xl overflow-hidden group"
            >
              <Image
                src={src}
                alt={label}
                fill
                className="object-cover transition-transform duration-300 transform group-hover:scale-105 group-hover:brightness-110"
              />
              <div className="absolute bottom-3 left-3 text-white text-sm font-semibold group-hover:text-white">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
