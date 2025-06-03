// components/CustomerReviews.js

export default function CustomerReviews() {
  return (
    <section id="customer-reviews" className="py-20 bg-[#F9FAFB]">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-xl font-semibold text-[#05073C] mb-2">Customer Reviews</h2>

        <i className="fa-solid fa-quote-left text-[#EB662B] text-3xl"></i>

        <p className="text-gray-600 text-lg leading-relaxed font-semibold mt-4">
          The tours in this website are great. I had been really enjoy with my family! The team is very
          professional and taking care of the customers. Will surely recommend to my friend to join this company!
        </p>

        <div className="mt-6">
          <h4 className="text-[#05073C] font-semibold">Ali Tufan</h4>
          <p className="text-sm text-gray-500">Product Manager, Apple Inc.</p>
        </div>
      </div>

      {/* Avatar Selector */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <img
          src="/assets/images/reviewer1.jpg"
          alt="Ali Tufan"
          className="w-14 h-14 rounded-full border-4 border-[#EB662B] ring-2 ring-white shadow-md"
        />
        {[2, 3, 4, 5].map((num) => (
          <img
            key={num}
            src={`/assets/images/reviewer${num}.jpg`}
            alt={`Avatar ${num}`}
            className="w-12 h-12 rounded-full grayscale hover:grayscale-0 cursor-pointer transition"
          />
        ))}
      </div>
    </section>
  );
}
