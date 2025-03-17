import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { db } from '../firebase'; 
import { logEvent } from 'firebase/analytics';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore'; 
import './ReviewBox.css';

interface Review {
  name: string;
  title: string;
  rating: number;
  comment: string;
  timestamp: string; 
}

export const ReviewBox = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<Partial<Review>>({
    name: '',
    title: '',
    rating: 0,
    comment: '',
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false); // State to toggle dropdown

  // Fetch reviews from Firestore
  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reviewsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Review[];
      setReviews(reviewsData);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.name || !newReview.title || !newReview.rating || !newReview.comment) {
      setPopupMessage('Please fill in all fields.');
      setIsSuccess(false);
      setShowPopup(true);
      return;
    }

    try {
      // Generate a meaningful document ID
      const customDocId = `${newReview.name?.replace(/\s+/g, '_')}_${Date.now()}`;

      // Add the review to Firestore
      await addDoc(collection(db, 'reviews'), {
        name: newReview.name,
        title: newReview.title,
        rating: newReview.rating,
        comment: newReview.comment,
        timestamp: new Date().toISOString(),
      });

      // Show success popup
      setPopupMessage('Thank you for your review!');
      setIsSuccess(true);
      setNewReview({ name: '', title: '', rating: 0, comment: '' }); // Reset form
    } catch (error) {
      console.error('Error submitting review:', error);
      setPopupMessage('Failed to submit review. Please try again.');
      setIsSuccess(false);
    }

    // Show the popup
    setShowPopup(true);

    // Hide the popup after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  // Render stars
  const renderStars = (rating: number, interactive = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const filled = interactive
        ? (hoverRating || newReview.rating) >= starValue
        : rating >= starValue;

      return (
        <Star
          key={`star-${index}`}
          className={`star ${filled ? 'filled' : ''}`}
          onClick={() => interactive && setNewReview({ ...newReview, rating: starValue })}
          onMouseEnter={() => interactive && setHoverRating(starValue)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      );
    });
  };

  return (
    <div className="review-container">
      {/* Popup Message */}
      {showPopup && (
        <div className={`popup ${isSuccess ? 'success' : 'error'}`}>
          <p>{popupMessage}</p>
        </div>
      )}

      {/* Display Reviews */}
      <div className="reviews-list">
        {reviews.length > 0 ? (
          <>
            {/* Show only the first review in a single row */}
            <div className="single-review-row">
              {reviews.slice(0, 1).map((review) => (
                <div key={review.timestamp} className="review-card">
                  <div className="review-header">
                    <h3>{review.name}</h3>
                    <p className="title">{review.title}</p>
                    <div className="stars">{renderStars(review.rating)}</div>
                  </div>
                  <p className="comment">{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Dropdown for additional reviews */}
            {reviews.length > 1 && (
              <div className="additional-reviews">
                <button onClick={() => setShowAllReviews(!showAllReviews)}>
                  {showAllReviews ? 'Hide Reviews' : 'Show More Reviews'}
                </button>
                {showAllReviews && (
                  <div className="review-cards">
                    {reviews.slice(1).map((review) => (
                      <div key={review.timestamp} className="review-card">
                        <div className="review-header">
                          <h3>{review.name}</h3>
                          <p className="title">{review.title}</p>
                          <div className="stars">{renderStars(review.rating)}</div>
                        </div>
                        <p className="comment">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <p>No reviews yet. Be the first to leave one!</p>
        )}
      </div>

      {/* Review Form */}
      <form className="review-form" onSubmit={handleSubmit}>
        <h2>Share Your Experience</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Your Name"
            value={newReview.name || ''}
            onChange={(e) =>
              setNewReview({ ...newReview, name: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Your Role or Title"
            value={newReview.title || ''}
            onChange={(e) =>
              setNewReview({ ...newReview, title: e.target.value })
            }
            required
          />
        </div>
        <div className="star-rating">
          {renderStars(newReview.rating || 0, true)}
        </div>
        <div className="form-group">
          <textarea
            placeholder="Share your thoughts about our agricultural services..."
            value={newReview.comment || ''}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            required
          />
        </div>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};