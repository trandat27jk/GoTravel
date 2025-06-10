// components/TourReviewForm.js
"use client";
import { useState } from 'react';
import {createClient} from '../utils/supabase/client';
import { FaStar } from 'react-icons/fa';

const supabase = createClient();
export default function TourReviewForm({ tourId, onReviewSubmitted }) { // Changed prop name to tourId
  const [reviewerName, setReviewerName] = useState('');
  const [reviewTitle, setReviewTitle] = useState(''); // This maps to reviewer_title in DB
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    if (!tourId) { // Check for tourId (UUID)
      setMessage('Error: Tour ID is missing for review submission.');
      setMessageType('error');
      setLoading(false);
      return;
    }
    if (rating === 0) {
      setMessage('Please select a star rating.');
      setMessageType('error');
      setLoading(false);
      return;
    }
    if (!reviewerName.trim()) {
      setMessage('Please enter your name.');
      setMessageType('error');
      setLoading(false);
      return;
    }
    if (!reviewTitle.trim()) {
      setMessage('Please provide a title for your review.');
      setMessageType('error');
      setLoading(false);
      return;
    }
    if (!reviewText.trim()) {
      setMessage('Please write your review.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            tour_id: tourId, // <--- CRITICAL CHANGE: Inserting tourId (UUID) into tour_id column
            reviewer_name: reviewerName.trim(),
            reviewer_title: reviewTitle.trim(),
            review_text: reviewText.trim(),
            rating: rating,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      setMessage('Review submitted successfully!');
      setMessageType('success');
      setReviewerName('');
      setReviewTitle('');
      setReviewText('');
      setRating(0);
      setHoverRating(0);
      if (onReviewSubmitted) {
        onReviewSubmitted(data[0]);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setMessage(`Failed to submit review: ${err.message || 'Unknown error'}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl mt-10 border border-gray-100">
      <h3 className="text-2xl font-bold mb-6 text-[#1A1A4B]">Submit Your Review</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="reviewerName" className="block text-sm font-medium text-gray-700 mb-1">Your Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="reviewerName"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#EB662B] focus:border-[#EB662B] sm:text-base transition-colors duration-200 placeholder-gray-400"
            placeholder="e.g., Ali Tufan"
          />
        </div>
        <div>
          <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-1">Review Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="reviewTitle"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#EB662B] focus:border-[#EB662B] sm:text-base transition-colors duration-200 placeholder-gray-400"
            placeholder="e.g., Take this tour! Its fantastic!"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating <span className="text-red-500">*</span></label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`w-7 h-7 cursor-pointer transition-colors duration-200 
                  ${star <= (hoverRating || rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
          {rating === 0 && messageType === 'error' && (
            <p className="text-red-500 text-xs mt-1">Please select a rating.</p>
          )}
        </div>
        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-1">Your Review <span className="text-red-500">*</span></label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="5"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#EB662B] focus:border-[#EB662B] sm:text-base transition-colors duration-200 placeholder-gray-400"
            placeholder="Share your experience..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading || rating === 0 || !reviewerName.trim() || !reviewTitle.trim() || !reviewText.trim()}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-[#EB662B] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB662B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>

        {message && (
          <p className={`mt-3 text-center text-sm font-medium ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}