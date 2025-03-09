// ProductPage.js
import React from 'react';
import Navbar from '../../components/Navbar';
import ProductRecommendation from '../../components/ProductRecommendation';
import Tabs from '../../components/Tabs';
import Slider from '../../components/Slider';
import './product.css';

const ProductPage = () => {
  return (
    <div className="product-page">
      {/* Navbar */}
      <Navbar />

    {/* Slider Section */}
    <section className="slider-section">
        <Slider />
      </section>
      {/* Product Recommendation Section */}
      <section className="recommendation-section">
        <ProductRecommendation />
      </section>

      {/* Tabs Section */}
      <section className="tabs-section">
        <Tabs />
      </section>

      
    </div>
  );
};

export default ProductPage;