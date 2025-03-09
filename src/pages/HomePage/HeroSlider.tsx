import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slides = [
  {
    title: "Organic Farming Solutions",
    subtitle: "Sustainable Agriculture for a Better Tomorrow",
    image: "https://i.pinimg.com/736x/2a/64/e7/2a64e71703334e324dfbdb45663ec5d5.jpg",
    description: "Discover our range of organic farming products and solutions."
  },
  {
    title: "Smart Farming Technology",
    subtitle: "Precision Agriculture at Your Fingertips",
    image: "https://i.pinimg.com/736x/55/42/2d/55422d7b44523d841b524d225d2cdd2d.jpg",
    description: "Leverage technology for better crop yields and farm management."
  },
  {
    title: "Sustainable Seeds",
    subtitle: "Quality Seeds for Better Yields",
    image: "https://i.pinimg.com/736x/87/31/73/873173c003c199a33b22d30f729730ab.jpg",
    description: "Premium quality seeds for various crops and conditions."
  }
];

const HeroSlider = () => {
  const navigate = useNavigate();

  return (
    <div className="hero-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="slide-content" style={{ backgroundImage: `url(${slide.image})` }}>
              <div className="slide-overlay">
                <div className="slide-text">
                  <h1>{slide.title}</h1>
                  <h2>{slide.subtitle}</h2>
                  <p>{slide.description}</p>
                  <button onClick={() => navigate('/products')}>
                    View Products
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;