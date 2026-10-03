import React from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedCollection } from '../components/home/FeaturedCollection';
import { CustomOrderBanner } from '../components/home/CustomOrderBanner';
import { CustomOrderSteps } from '../components/home/CustomOrderSteps';
import { ReviewsSection } from '../components/home/ReviewsSection';

export const HomePage = () => {
  return (
    <div className="home-page">
      {/* 1. Cinematic Hero Slider & Live Advertisements (with dismiss & return to normal) */}
      <HeroSlider />

      {/* 2. Categories Grid directly from API */}
      <CategoryGrid />

      {/* 3. Featured Products directly from API */}
      <FeaturedCollection />

      {/* 4. Custom Order & Sheet Metal Fabrication Banner */}
      <CustomOrderBanner />

      {/* 5. Custom Order Steps: How Your Metal Decor Comes to Life */}
      <CustomOrderSteps />

      {/* 6. Client Reviews (only if present in API) */}
      <ReviewsSection />
    </div>
  );
};

export default HomePage;
