export default function WhyChooseUs() {
  const features = [
    {
      title: 'Ultimate flexibility',
      description: "You're in control, with free cancellation and payment options to satisfy any plan or budget.",
      icon: 'https://img.icons8.com/fluency-systems-regular/48/EB662B/ticket.png',
      alt: 'Flexibility',
    },
    {
      title: 'Memorable experiences',
      description: "Browse and book tours and activities so incredible, you'll want to tell your friends.",
      icon: 'https://img.icons8.com/fluency-systems-regular/48/EB662B/hot-air-balloon.png',
      alt: 'Experiences',
    },
    {
      title: 'Quality at our core',
      description: 'High-quality standards. Millions of reviews. A tourz company.',
      icon: 'https://img.icons8.com/fluency-systems-regular/48/EB662B/diamond.png',
      alt: 'Quality',
    },
    {
      title: 'Award-winning support',
      description: "New price? New plan? No problem. We're here to help, 24/7.",
      icon: 'https://img.icons8.com/fluency-systems-regular/48/EB662B/prize.png',
      alt: 'Support',
    },
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A4B] mb-4">Why choose Us</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-12 text-left">
          {features.map((feature, index) => (
            <div key={index}>
              <img src={feature.icon} alt={feature.alt} className="mb-4 h-10 w-10" />
              <h4 className="text-base font-semibold text-[#1A1A4B] mb-2">{feature.title}</h4>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
