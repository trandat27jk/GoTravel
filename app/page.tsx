import HeroBanner from '../components/HeroBanner';
import WhyChooseUs from '../components/WhyChooseUs';
import TrendingDestinations from '../components/TrendingDestinations';
import PopularTours from '../components/PopularTours';
import TravelArticles from '../components/TravelArticles';
import CustomerReviews from '../components/CustomerReviews';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <WhyChooseUs />
      <TrendingDestinations />
      <PopularTours />
      <TravelArticles />
      <CustomerReviews />
    </>
  );
}
