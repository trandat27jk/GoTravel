// components/TrendingDestinations.js
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

const supabase = createClient();
const DESTINATIONS_PER_PAGE = 8;

export default function TrendingDestinations() {
  const [allTrendingDestinations, setAllTrendingDestinations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all trending destinations once on mount
  useEffect(() => {
    async function fetchTrendingDestinations() {
      setLoading(true);
      setError(null);

      try {
        const { data: tours, error: fetchError } = await supabase
          .from("tours")
          .select("id, province, country, slug, cover_image, gallery");

        if (fetchError) throw fetchError;

        // Aggregate by province+country
        const destinationData = {};
        tours.forEach((tour) => {
          const key = `${tour.province}, ${tour.country}`;
          if (!destinationData[key]) {
            let representativeImage = "/assets/images/placeholder.jpg"; // A default placeholder
            if (tour.cover_image && typeof tour.cover_image === "string" && tour.cover_image.trim() !== "") {
              representativeImage = tour.cover_image;
            } else if (
              Array.isArray(tour.gallery) &&
              tour.gallery.length > 0 &&
              typeof tour.gallery[0] === "string" &&
              tour.gallery[0].trim() !== ""
            ) {
              representativeImage = tour.gallery[0];
            }
            destinationData[key] = {
              name: tour.province,
              location: `${tour.province}, ${tour.country}`,
              tourCount: 0,
              // Use the slug from the first tour found for that destination
              slug: tour.slug || "#", 
              image: representativeImage,
            };
          }
          destinationData[key].tourCount++;
        });

        const sortedDestinations = Object.values(destinationData).sort(
          (a, b) => b.tourCount - a.tourCount
        );
        setAllTrendingDestinations(sortedDestinations);
      } catch (err) {
        setError(err.message || "Failed to load destinations");
        setAllTrendingDestinations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingDestinations();
  }, []);

  // Pagination logic
  const startIndex = currentPage * DESTINATIONS_PER_PAGE;
  const endIndex = startIndex + DESTINATIONS_PER_PAGE;
  const destinationsToDisplay = allTrendingDestinations.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allTrendingDestinations.length / DESTINATIONS_PER_PAGE);

  // UI for loading/error/no data
  if (loading) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-xl text-gray-700">Loading trending destinations...</p>
      </section>
    );
  }
  if (error) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-xl text-red-600">Error: {error}</p>
        <p className="text-md text-gray-500 mt-2">Could not load trending destinations.</p>
      </section>
    );
  }
  if (allTrendingDestinations.length === 0) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-xl text-gray-700">No trending destinations found.</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white" id="trending-destinations">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-[#1A1A4B]">Trending destinations</h2>
          <Link href="/destinations" className="text-sm font-medium text-[#1A1A4B] hover:underline">
            See all
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {destinationsToDisplay.map((destination, idx) => (
            <Link
              href={`/tour_details/${destination.slug}`}
              key={idx}
              className="group flex flex-col items-center text-center cursor-pointer"
            >
              <div className="relative w-28 h-28 mb-4">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="rounded-full object-cover shadow transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                  sizes="112px"
                  priority={currentPage === 0 && idx < DESTINATIONS_PER_PAGE}
                />
              </div>
              <div className="transition-transform duration-300 group-hover:-translate-y-1">
                <h4 className="text-md font-semibold text-[#1A1A4B]">{destination.name}</h4>
                <p className="text-sm text-gray-600">{destination.tourCount} Tours</p>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2">
            {[...Array(totalPages)].map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  idx === currentPage ? "w-6 bg-[#05073C]" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentPage(idx)}
              ></span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
