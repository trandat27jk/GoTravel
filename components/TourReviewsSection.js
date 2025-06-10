// components/TourReviewsSection.js
"use client";
import { useState } from 'react';
import TourReviews from './TourReviews.tsx'; // Adjust path as needed
import TourReviewForm from './TourReviewForm'; // Adjust path as needed

export default function TourReviewsSection({ tourId }) { // Changed back to tourId
  // State to trigger a re-fetch of reviews in TourReviews
  const [reviewsVersion, setReviewsVersion] = useState(0);

  // Debugging: Log the tourId received by this client component
  console.log("CLIENT: TourReviewsSection - Received tourId:", tourId);
  if (!tourId) {
    console.warn("CLIENT: TourReviewsSection - tourId is null or undefined! Reviews may not load.");
  }

  // Callback function passed to TourReviewForm
  const handleReviewSubmitted = () => {
    // Increment reviewsVersion to trigger a re-fetch in TourReviews
    setReviewsVersion(prev => prev + 1);
  };

  return (
    <>
      {/* Pass tourId to TourReviews */}
      <TourReviews tourId={tourId} reviewsVersion={reviewsVersion} />
      {/* Pass tourId to TourReviewForm */}
      <TourReviewForm tourId={tourId} onReviewSubmitted={handleReviewSubmitted} />
    </>
  );
}