// components/CustomerReviews.js
"use client"; // This component uses useState, so it needs to be a client component
import Image from 'next/image'; // Import Image component
import { useState } from 'react'; // Import useState for interactivity
import Link from 'next/link'; // Import Link component (though not directly used in this snippet, good practice if it might be)

export default function CustomerReviews() {
  const [currentReviewer, setCurrentReviewer] = useState({
    name: 'Ali Tufan',
    title: 'Product Manager, Apple Inc.',
    review: 'The tours in this website are great. I had been really enjoy with my family! The team is very professional and taking care of the customers. Will surely recommend to my friend to join this company!',
    image: '/assets/images/reviewer1.jpg',
  });

  const reviewers = [
    { id: 1, name: 'Ali Tufan', title: 'Product Manager, Apple Inc.', review: 'The tours in this website are great. I had been really enjoy with my family! The team is very professional and taking care of the customers. Will surely recommend to my friend to join this company!', image: '/assets/images/reviewer1.jpg' },
    { id: 2, name: 'Jane Doe', title: 'Software Engineer, Google', review: 'Absolutely fantastic experiences! The booking process was smooth, and the tours exceeded our expectations. Highly recommend GoExplore for unforgettable adventures.', image: '/assets/images/reviewer2.jpg' },
    { id: 3, name: 'John Smith', title: 'Marketing Lead, Microsoft', review: 'GoExplore made planning our family vacation so easy. Their personalized recommendations were spot on, and the support team was incredibly helpful throughout our trip.', image: '/assets/images/reviewer3.jpg' },
    { id: 4, name: 'Emily White', title: 'UX Designer, Adobe', review: 'The cultural tours were truly immersive. I learned so much and met wonderful people. GoExplore is my go-to for authentic travel experiences.', image: '/assets/images/reviewer4.jpg' },
    { id: 5, name: 'Michael Brown', title: 'Data Scientist, Amazon', review: 'Efficient, reliable, and great value. The adventure tours were thrilling and well-organized. I\'m already planning my next trip with them!', image: '/assets/images/reviewer5.jpg' },
  ];

  // Removed type annotation 'reviewerId: number'
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

        {/* Font Awesome icon - ensure Font Awesome is loaded globally or use react-icons */}
        <i className="fa-solid fa-quote-left text-[#EB662B] text-3xl"></i>

        <p className="text-gray-600 text-lg leading-relaxed font-semibold mt-4">
          {currentReviewer.review}
        </p>

        <div className="mt-6">
          <h4 className="text-[#05073C] font-semibold">{currentReviewer.name}</h4>
          <p className="text-sm text-gray-500">{currentReviewer.title}</p>
        </div>
      </div>

      {/* Avatar Selector */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        {reviewers.map((reviewer) => (
          <div key={reviewer.id} className="relative w-14 h-14 rounded-full flex-shrink-0">
            <Image
              src={reviewer.image}
              alt={reviewer.name}
              fill
              className={`rounded-full object-cover border-4 ring-2 ring-white shadow-md cursor-pointer transition ${
                reviewer.id === currentReviewer.id ? 'border-[#EB662B] grayscale-0' : 'border-transparent grayscale hover:grayscale-0'
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
