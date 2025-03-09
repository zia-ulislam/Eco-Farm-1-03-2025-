import React from 'react';
import { Shield, Truck, Leaf, BookOpen, HeadphonesIcon, Package } from 'lucide-react';
import './FeaturesGrid.css';

const features = [
  {
    icon: <Shield className="text-green-600" />,
    title: "Secure Payment",
    description: "Safe and encrypted transactions for worry-free shopping",
    // image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&h=300&fit=crop"
  },
  {
    icon: <Truck className="text-green-600" />,
    title: "Fast Delivery",
    description: "Quick and reliable shipping to your doorstep",
    // image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&h=300&fit=crop"
  },
  {
    icon: <Leaf className="text-green-600" />,
    title: "Sustainability Focus",
    description: "Eco-friendly practices for a better tomorrow",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop"
  },
  // {
  //   icon: <BookOpen className="text-green-600" />,
  //   title: "Educational Content",
  //   description: "Learn best practices and farming techniques",
  //   // image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=300&fit=crop"
  // },
  // {
  //   icon: <HeadphonesIcon className="text-green-600" />,
  //   title: "Customer Support",
  //   description: "24/7 assistance for all your farming needs",
  //   // image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=500&h=300&fit=crop"
  // },
  {
    icon: <Package className="text-green-600" />,
    title: "Product Range",
    description: "Wide selection of vegetable seeds and eco products",
    // image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500&h=300&fit=crop"
  }
];

const FeaturesGrid = () => {
  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2>What We Offer</h2>
          <p>Discover the benefits of choosing Eco Farm</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              {/* <div className="feature-image">
                <img src={feature.image} alt={feature.title} />
              </div> */}
              <div className="feature-title">
                {feature.icon}
                {feature.title}
              </div>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;