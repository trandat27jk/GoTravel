// components/TourReviews.js
"use client";
import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { FaStar } from 'react-icons/fa'; // Import star icon

// Define interface for a single review item
interface Review {
  id: string;
  reviewer_name: string;
  reviewer_title: string | null;
  review_text: string;
  rating: number; // Add rating field
  created_at: string; // Add created_at field (ISO string from DB)
}

export default function TourReviews({ tourId, reviewsVersion }: { tourId: string, reviewsVersion?: number }) {
  const supabase = createClient();
  const [reviews, setReviews] = useState<Review[]>([]); // Use Review interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    console.log(`CLIENT: TourReviews - Attempting to fetch reviews for tourId: "${tourId}" (version: ${reviewsVersion})`);

    if (!tourId) {
      setReviews([]);
      setLoading(false);
      console.warn("CLIENT: TourReviews - fetchReviews skipped because tourId is null or undefined.");
      return;
    }

    setLoading(true);
    setError(null);
    const { data, error: supabaseError } = await supabase
      .from('reviews')
      // --- IMPORTANT: Include 'rating' and 'created_at' in the select query ---
      .select('id, reviewer_name, reviewer_title, review_text, rating, created_at')
      .eq('tour_id', tourId)
      .order('created_at', { ascending: false }); // Order by newest reviews first

    if (supabaseError) {
      console.error('CLIENT: TourReviews - Error fetching tour reviews from Supabase:', supabaseError);
      setError(supabaseError.message);
      setReviews([]);
    } else {
      console.log('CLIENT: TourReviews - Successfully fetched reviews:', data);
      setReviews(data as Review[]); // Cast data to Review[]
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [tourId, reviewsVersion]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString; // Return original if parsing fails
    }
  };

  const getInitials = (name: string) => { // Added type annotation
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-gray-700">Loading tour reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-lg">Error loading tour reviews: {error}</p>
        <p className="text-gray-500 text-sm mt-2">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="text-3xl font-bold mb-8 text-[#1A1A4B]">Customer Reviews ({reviews.length})</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-600 text-lg">No reviews yet for this tour. Be the first to leave one!</p>
      ) : (
        <div className="space-y-8"> {/* Increased space between review cards */}
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100 transform transition-transform hover:-translate-y-1 duration-300"> {/* Changed shadow-lg to shadow-md */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-[#1A1A4B] flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md flex-shrink-0">
                    {getInitials(review.reviewer_name)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A4B] text-lg">{review.reviewer_name}</p>
                    {/* Display formatted date */}
                    <p className="text-sm text-gray-500 mt-0.5">Reviewed on {formatDate(review.created_at)}</p>
                  </div>
                </div>
                {/* Rating Stars */}
                <div className="flex items-center space-x-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>

              {review.reviewer_title && review.reviewer_title.trim() !== '' && (
                <h4 className="text-xl font-bold text-[#1A1A4B] mb-2">{review.reviewer_title}</h4>
              )}
              
              <p className="text-gray-700 leading-relaxed text-base mb-4">{review.review_text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
