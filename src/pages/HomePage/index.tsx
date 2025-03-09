import React from 'react';
import HeroSlider from './HeroSlider';
import Reviews from './Reviews';
import Newsletter from './Newsletter';
import ComparisonTable from '../../components/ComparisonTable';
import FeaturesGrid from '../../components/FeaturesGrid';
import './styles.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSlider />
      <FeaturesGrid />
      <ComparisonTable />
      <Reviews />
      <Newsletter />
    </div>
  );
};

export default HomePage;