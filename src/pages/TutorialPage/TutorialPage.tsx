import React, { useState } from 'react';
import './TutorialPage.css'; // Import CSS for styling

// Define the Tutorial interface
interface Tutorial {
  id: number;
  title: string;
  plant: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  growthTime: string;
  image: string;
  description: string;
  requirements: {
    water: string;
    sunlight: string;
    temperature: string;
  };
  videoUrl: string;
}

// Sample data
const tutorials: Tutorial[] = [
    {
        "id": 1,
        "title": "Growing Healthy Tomatoes",
        "plant": "Tomatoes",
        "difficulty": "Beginner",
        "growthTime": "60-80 days",
        "image": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800",
        "description": "Learn how to grow juicy, flavorful tomatoes in your garden with these simple steps.",
        "requirements": {
          "water": "Regular watering",
          "sunlight": "Full sun",
          "temperature": "20-25°C"
        },
        "videoUrl": "https://youtu.be/9seQurhbLPM"
      },
      {
        "id": 2,
        "title": "Crisp and Fresh Lettuce",
        "plant": "Lettuce",
        "difficulty": "Easy",
        "growthTime": "30-50 days",
        "image": "https://sarabackmo.com/wp-content/uploads/2020/05/sarabackmo_sallat_lettuce-1070x713.jpg",
        "description": "Grow fresh, crisp lettuce with minimal effort. Perfect for beginners.",
        "requirements": {
          "water": "Moderate watering",
          "sunlight": "Partial sun",
          "temperature": "15-20°C"
        },
        "videoUrl": "https://youtu.be/wj6hN9oQ4d4"
      },
      {
        "id": 3,
        "title": "Juicy Strawberries at Home",
        "plant": "Strawberries",
        "difficulty": "Intermediate",
        "growthTime": "90-120 days",
        "image": "https://i.ytimg.com/vi/RviIq8Y6neQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD1atuWZ8_aguJbNJ7IT9aDZXq3kQ",
        "description": "Learn how to grow sweet and juicy strawberries in your garden.",
        "requirements": {
          "water": "Frequent watering",
          "sunlight": "Full sun",
          "temperature": "18-24°C"
        },
        "videoUrl": "https://www.youtube.com/embed/3xRA3OpfC-4"
      },
      {
        "id": 4,
        "title": "Perfect Cucumbers for Salads",
        "plant": "Cucumbers",
        "difficulty": "Beginner",
        "growthTime": "50-70 days",
        "image": "https://i0.wp.com/forksinthedirt.com/wp-content/uploads/2023/04/cucumbers-after-rain-1-scaled.jpg?fit=2560%2C1436&ssl=1",
        "description": "Discover how to grow fresh cucumbers with ease, great for summer salads.",
        "requirements": {
          "water": "Regular watering",
          "sunlight": "Full sun",
          "temperature": "20-30°C"
        },
        "videoUrl": "https://youtu.be/SQez5Kd-_sY"
      },
      {
        "id": 5,
        "title": "Homegrown Carrots for a Crunch",
        "plant": "Carrots",
        "difficulty": "Intermediate",
        "growthTime": "70-90 days",
        "image": "https://www.homestead-acres.com/wp-content/uploads/2019/05/When-To-Harvest-Carrots.jpg",
        "description": "Learn how to grow crisp and nutritious carrots at home.",
        "requirements": {
          "water": "Consistent moisture",
          "sunlight": "Full sun",
          "temperature": "15-20°C"
        },
        "videoUrl": "https://youtu.be/n_-NQxK2keE"
      }
  // Add more tutorials here...
];

function App() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Function to open the modal with the video
  const handleWatchVideo = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="tutorial-page">
      <h1>Tutorial Page</h1>
      <div className="card-grid">
        {tutorials.map((tutorial) => (
          <div key={tutorial.id} className="card">
            <img src={tutorial.image} alt={tutorial.title} className="card-image" />
            <div className="card-content">
              <h2>{tutorial.title}</h2>
              <p><strong>Plant:</strong> {tutorial.plant}</p>
              <p><strong>Difficulty:</strong> {tutorial.difficulty}</p>
              <p><strong>Growth Time:</strong> {tutorial.growthTime}</p>
              <p>{tutorial.description}</p>
              <div className="requirements">
                <p><strong>Water:</strong> {tutorial.requirements.water}</p>
                <p><strong>Sunlight:</strong> {tutorial.requirements.sunlight}</p>
                <p><strong>Temperature:</strong> {tutorial.requirements.temperature}</p>
              </div>
              <button onClick={() => handleWatchVideo(tutorial.videoUrl)}>Watch Video</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for displaying the video */}
      {selectedVideo && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              width="560"
              height="315"
              src={selectedVideo}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;