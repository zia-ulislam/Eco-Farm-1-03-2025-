import React from 'react';
import HeroSlider from './HeroSlider';
import Reviews from './Reviews';
import Newsletter from './Newsletter';
import ComparisonTable from '../../components/ComparisonTable';
import FeaturesGrid from '../../components/FeaturesGrid';
import { ReviewBox } from '../../components/ReviewBox'; // Import the ReviewBox component
import './styles.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSlider />
      <FeaturesGrid />
      <ComparisonTable />
      {/* <Reviews /> */}
      <div className="reviews-header-box">
        <h2>What Our Customers Say</h2>
        <p>Trusted by farmers and agricultural professionals worldwide</p>
        <ReviewBox />
      </div>
      <Newsletter />
      
   </div>
  );
};

export default HomePage;