// components/TourInteraction.js
"use client"; // This component is a client component

import { useState } from 'react';
import TourReviews from './TourReviews'; // Import the TourReviews client component
import TourReviewForm from './TourReviewForm'; // Import the TourReviewForm client component

export default function TourInteraction({ tourId, initialReviews }) {
  // Manage reviews state locally in this client component
  const [reviews, setReviews] = useState(initialReviews);

  const handleReviewSubmitted = (newReview) => {
    // Add the newly submitted review to the beginning of the reviews array
    // This immediately updates the UI without requiring a full page refresh
    setReviews((prevReviews) => [newReview, ...prevReviews]);
    console.log("New review submitted and instantly displayed:", newReview);
  };

  return (
    <>
      {/* Pass the managed reviews state down to TourReviews */}
      {/* TourReviews will use this `reviews` prop instead of re-fetching on its own. */}
      {/* If TourReviews has its own `useEffect` for fetching, ensure it's conditional
          or remove it if this parent will fully manage review data.
          For simplicity, I've adjusted TourReviews to use `reviews` prop directly.
      */}
      <TourReviews tourId={tourId} initialReviews={reviews} />

      {/* TourReviewForm remains the same, passing its handler to it */}
      <TourReviewForm tourId={tourId} onReviewSubmitted={handleReviewSubmitted} />
    </>
  );
}