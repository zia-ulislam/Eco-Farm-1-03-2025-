import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "John Smith",
    role: "Farmer",
    rating: 5,
    comment: "The crop recommendations have significantly improved my yield. Highly recommended!",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Agricultural Consultant",
    rating: 5,
    comment: "An excellent platform for modern farming. The AI recommendations are spot-on.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Farm Owner",
    rating: 4,
    comment: "Great products and excellent customer service. Very satisfied with the results.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
  }
];

const Reviews = () => {
  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <h2>What Our Customers Say</h2>
        <p>Trusted by farmers and agricultural professionals worldwide</p>
      </div>

      <div className="reviews-grid">
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <img src={review.image} alt={review.name} className="reviewer-image" />
              <div className="reviewer-info">
                <h3>{review.name}</h3>
                <p>{review.role}</p>
              </div>
            </div>
            <div className="rating">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="star-icon" fill="#FFD700" color="#FFD700" />
              ))}
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;