// components/TourReviews.js
"use client";
import { useState, useEffect } from 'react';
import supabase from '../utils/supabase/client';

// Accept tourId as a prop
export default function TourReviews({ tourId, reviewsVersion }) { // Changed prop name to tourId
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true); // Start as loading
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    // Debugging: Log the tourId and version before fetching
    console.log(`CLIENT: TourReviews - Attempting to fetch reviews for tourId: "${tourId}" (version: ${reviewsVersion})`);

    if (!tourId) { // Ensure tourId is provided
      setReviews([]);
      setLoading(false);
      console.warn("CLIENT: TourReviews - fetchReviews skipped because tourId is null or undefined.");
      return;
    }

    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('reviews')
      // Query based on 'tour_id' column, matching it with tourId (the UUID)
      .select('id, reviewer_name, reviewer_title, review_text')
      .eq('tour_id', tourId); // <--- CRITICAL CHANGE: Querying by 'tour_id' with tourId (UUID)

    if (error) {
      console.error('CLIENT: TourReviews - Error fetching tour reviews from Supabase:', error);
      setError(error.message);
      setReviews([]);
    } else {
      console.log('CLIENT: TourReviews - Successfully fetched reviews:', data);
      setReviews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Trigger fetch whenever tourId or reviewsVersion changes
    fetchReviews();
  }, [tourId, reviewsVersion]); // Depend on tourId and reviewsVersion

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-700">
        <p>Loading tour reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600">Error loading tour reviews: {error}</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-[#1A1A4B]">Tour Reviews ({reviews.length})</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet for this tour. Be the first to leave one!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#1A1A4B] flex items-center justify-center text-white font-bold text-lg mr-3 shadow-sm flex-shrink-0">
                    {getInitials(review.reviewer_name)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A4B] text-lg">{review.reviewer_name}</p>
                  </div>
                </div>
                {/* No date display, as 'created_at' column does not exist */}
              </div>

              {review.reviewer_title && review.reviewer_title.trim() !== '' && (
                <h4 className="text-xl font-bold text-[#1A1A4B] mb-2">{review.reviewer_title}</h4>
              )}
              
              <p className="text-gray-700 leading-relaxed text-base">{review.review_text}</p>

              <div className="flex mt-4 space-x-4 text-sm text-gray-600">
                <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Helpful</button>
                <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Not helpful</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}