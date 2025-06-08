// components/CustomerReviews.js
"use client"; // This component uses useState, so it needs to be a client component
import Image from 'next/image'; // Import Image component
import { useState, useEffect } from 'react'; // Import useState and useEffect for other purposes (though useEffect is removed for initial state here)
// import Link from 'next/link'; // Removed: Link is not used in this component

export default function CustomerReviews() {
  const reviewers = [
    { id: 1, name: 'Ali Tufan', title: 'Product Manager, Apple Inc.', review: 'The tours in this website are great. I had been really enjoy with my family! The team is very professional and taking care of the customers. Will surely recommend to my friend to join this company!', image: 'https://i.pinimg.com/736x/8d/95/03/8d9503a77e4c21ebf0ced6c252819a0e.jpg' },
    { id: 2, name: 'Jane Doe', title: 'Software Engineer, Google', review: 'Absolutely fantastic experiences! The booking process was smooth, and the tours exceeded our expectations. Highly recommend GoExplore for unforgettable adventures.', image: 'https://i.pinimg.com/736x/22/8b/cf/228bcf5a0800f813cd1744d4ccbf01ea.jpg' },
    { id: 3, name: 'John Smith', title: 'Marketing Lead, Microsoft', review: 'GoExplore made planning our family vacation so easy. Their personalized recommendations were spot on, and the support team was incredibly helpful throughout our trip.', image: 'https://i.pinimg.com/736x/fe/1c/1a/fe1c1a924bcf4ac675472441e899df9f.jpg' },
    { id: 4, name: 'Emily White', title: 'UX Designer, Adobe', review: 'The cultural tours were truly immersive. I learned so much and met wonderful people. GoExplore is my go-to for authentic travel experiences.', image: 'https://i.pinimg.com/736x/7d/8f/d2/7d8fd2d44ebe802b0462bd79aa3abcc9.jpg' },
    { id: 5, name: 'Michael Brown', title: 'Data Scientist, Amazon', review: 'Efficient, reliable, and great value. I\'m already planning my next trip with them!', image: 'https://i.pinimg.com/736x/0b/77/77/0b7777ae8de596d4095567f23d0a8b33.jpg' },
  ];

  // OPTIMIZED: Initialize currentReviewer directly with the first reviewer from the array.
  // This avoids an unnecessary re-render cycle on mount.
  // If 'reviewers' could be empty, use 'reviewers.length > 0 ? reviewers[0] : null'
  // and handle 'null' in rendering, but for a static non-empty array, this is fine.
  const [currentReviewer, setCurrentReviewer] = useState(reviewers[0]);


  // REMOVED the useEffect that was originally here, as currentReviewer is now initialized directly.
  // useEffect(() => {
  //   if (reviewers.length > 0 && currentReviewer.id === undefined) {
  //     setCurrentReviewer(reviewers[0]);
  //   }
  // }, [reviewers, currentReviewer]);

  const handleReviewerClick = (reviewerId) => {
    const selected = reviewers.find(r => r.id === reviewerId);
    if (selected) {
      setCurrentReviewer(selected);
    }
  };

  return (
    <section id="customer-reviews" className="py-20 bg-[#F9FAFB]">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-xl font-semibold text-[#05073C] mb-2">Customer Reviews</h2>

        <div className="text-[#EB662B] text-3xl">&quot;</div> {/* Corrected: Escaped double quote */}

        {currentReviewer && ( // Only render if currentReviewer is set (always true now with direct init)
          <>
            <p className="text-gray-600 text-lg leading-relaxed font-semibold mt-4">
              {currentReviewer.review}
            </p>

            <div className="mt-6">
              <h4 className="text-[#05073C] font-semibold">{currentReviewer.name}</h4>
              <p className="text-sm text-gray-500">{currentReviewer.title}</p>
            </div>
          </>
        )}
      </div>

      {/* Avatar Selector */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        {reviewers.map((reviewer) => (
          <div key={reviewer.id} className="relative w-14 h-14 rounded-full flex-shrink-0">
            <Image
              src={reviewer.image}
              alt={reviewer.name}
              fill
              className={`rounded-full object-cover border-4 ring-2 ring-white shadow-md cursor-pointer transition-all duration-300 ease-in-out transform
                ${reviewer.id === currentReviewer.id
                  ? 'border-[#EB662B] scale-110' // Active reviewer is slightly scaled up and has accent border
                  : 'border-transparent hover:scale-105' // Inactive reviewers scale up on hover
                }`}
              sizes="56px"
              onClick={() => handleReviewerClick(reviewer.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
