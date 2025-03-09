import React, { useState, useEffect, useRef } from 'react';
import './Slider.css';
import { useCart } from '../context/CartContext'; // Import the useCart hook

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string[];
  imageUrl: string;
}

const slides: SlideData[] = [
  {
    id: 81,
    title: "Summer Vegetable Seeds",
    subtitle: "Thrive in the Warmth of Summer",
    description: [
      "Tomatoes: Varieties like Cherry, Heirloom, Roma, and Beefsteak. Perfect for fresh salads and sauces.",
      "Cucumbers: Crisp and refreshing. Ideal for pickling or fresh eating.",
      "Bell Peppers: Colorful and sweet. Great for grilling, salads, and cooking.",
      "Zucchini: Easy to grow with abundant yields. Perfect for grilling and baking.",
      "Eggplants: Varieties like Globe, Japanese, and Italian. Excellent for grilling and baking."
    ],
    imageUrl: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 82,
    title: "Winter Vegetable Seeds",
    subtitle: "Grow Fresh Through the Cold Season",
    description: [
      "Kale: Hardy and nutritious. Perfect for salads and smoothies.",
      "Brussels Sprouts: A winter favorite. Great roasted or steamed.",
      "Carrots: Sweet and crunchy. Ideal for soups, stews, and fresh eating.",
      "Spinach: Fast-growing and nutritious. Perfect for salads and cooking.",
      "Leeks: Mild onion flavor. Great for soups and stews."
    ],
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 83,
    title: "Spring Vegetable Seeds",
    subtitle: "Fresh Start with Spring Delights",
    description: [
      "Lettuce: Varieties like Romaine, Butterhead, and Leaf. Perfect for fresh salads.",
      "Peas: Sweet and tender. Great for fresh eating and cooking.",
      "Radishes: Fast-growing and crisp. Perfect for salads and snacking.",
      "Broccoli: Nutritious and versatile. Great for steaming and roasting.",
      "Beets: Sweet and earthy. Excellent for salads and roasting."
    ],
    imageUrl: "https://images.unsplash.com/photo-1557844352-761f2565b576?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 84,
    title: "Monsoon Vegetable Seeds",
    subtitle: "Embrace the Rain with These Hardy Varieties",
    description: [
      "Okra: Thrives in humid conditions. Perfect for frying and stews.",
      "Gourds: Varieties like Bitter Gourd, Bottle Gourd, and Ridge Gourd. Great for diverse culinary uses.",
      "Chili Peppers: Spicy and vibrant. Ideal for adding heat to dishes.",
      "Green Beans: Tender and delicious. Perfect for stir-fries and steaming.",
      "Pumpkins: Hardy and versatile. Great for soups, pies, and roasting."
    ],
    imageUrl: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&q=80&w=1200"
  }
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const { addToCart } = useCart(); // Use the addToCart function from CartContext

  const totalSlides = slides.length;

  useEffect(() => {
    updateSlidePositions();
    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);

  useEffect(() => {
    updateSlidePositions();
  }, [currentSlide]);

  const updateSlidePositions = () => {
    slideRefs.current.forEach((slide, index) => {
      if (slide) {
        slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
      }
    });
  };

  const startAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(() => {
      handleSlideChange(1);
    }, 5000);
  };

  const handleSlideChange = (direction: number) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    let nextSlide = currentSlide + direction;

    if (nextSlide < 0) {
      nextSlide = totalSlides - 1;
    } else if (nextSlide >= totalSlides) {
      nextSlide = 0;
    }

    setCurrentSlide(nextSlide);
    startAutoPlay();

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Handle Add to Cart Click
  const handleAddToCart = (product_id: string) => {
    addToCart(product_id); // Call the addToCart function from CartContext
  };

  return (
    <div className="slider-container">
      <div className="slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={el => slideRefs.current[index] = el}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            data-id={slide.id}
          >
            <div className="slide-image" style={{ backgroundImage: `url(${slide.imageUrl})` }} />
            <div className="eco-farm-content">
              <h1>{slide.title}</h1>
              <h3>{slide.subtitle}</h3>
              <div className="description">
                {slide.description.map((item, i) => (
                  <p key={i}>{item}</p>
                ))}
              </div>
              {/* Add to Cart Button */}
              <button
                className="add-cart-btn"
                onClick={() => handleAddToCart(slide.id.toString())} // Pass product ID as string
              >
                Add To Cart
              </button>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button 
          className="slider-btn btn-left" 
          onClick={() => handleSlideChange(-1)}
          aria-label="Previous slide"
        >
          ←
        </button>
        <button 
          className="slider-btn btn-right" 
          onClick={() => handleSlideChange(1)}
          aria-label="Next slide"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Slider;