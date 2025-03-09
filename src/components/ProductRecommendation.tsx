import React, { useState, useEffect } from 'react';
import ProductPopup from './ProductPopup'; 
import { useCart } from '../context/CartContext';
import './ProductRecommendation.css';

// Districts data for dropdowns
const districtsData = {
  Punjab: [
    "Attock", "Bahawalnagar", "Bahawalpur", "Bhakkar", "Chakwal", "Chiniot",
    "Dera Ghazi Khan", "Faisalabad", "Gujranwala", "Gujrat", "Hafizabad",
    "Jhang", "Jhelum", "Kasur", "Khanewal", "Khushab", "Lahore", "Layyah",
    "Lodhran", "Mandi Bahauddin", "Mianwali", "Multan", "Muzaffargarh",
    "Nankana Sahib", "Narowal", "Okara", "Pakpattan", "Rahim Yar Khan",
    "Rajanpur", "Rawalpindi", "Sahiwal", "Sargodha", "Sheikhupura", "Sialkot",
    "Toba Tek Singh", "Vehari"
  ],
  Sindh: [
    "Badin", "Dadu", "Ghotki", "Hyderabad", "Jacobabad", "Jamshoro",
    "Karachi Central", "Karachi East", "Karachi South", "Karachi West",
    "Karachi Malir", "Kashmore", "Khairpur", "Larkana", "Matiari",
    "Mirpur Khas", "Naushahro Feroze", "Qambar Shahdadkot", "Sanghar",
    "Shaheed Benazirabad", "Shikarpur", "Sukkur", "Tando Allahyar",
    "Tando Muhammad Khan", "Tharparkar", "Thatta", "Umerkot"
  ],
  KPK: [
    "Abbottabad", "Bajaur", "Bannu", "Battagram", "Buner", "Charsadda",
    "Dera Ismail Khan", "Hangu", "Haripur", "Karak", "Khyber", "Kohat",
    "Kohistan Lower", "Kohistan Upper", "Kolai Pallas", "Lakki Marwat",
    "Malakand", "Mansehra", "Mardan", "Mohmand", "Nowshera", "Orakzai",
    "Peshawar", "Shangla", "South Waziristan", "Swabi", "Swat", "Tank",
    "Torghar", "Upper Chitral", "Lower Chitral", "Upper Dir", "Lower Dir"
  ],
  Balochistan: [
    "Awaran", "Barkhan", "Chagai", "Dera Bugti", "Gwadar", "Harnai",
    "Jafarabad", "Jhal Magsi", "Kalat", "Kech (Turbat)", "Kharan", "Khuzdar",
    "Kohlu", "Lasbela", "Loralai", "Mastung", "Musakhel", "Naseerabad",
    "Nushki", "Panjgur", "Pishin", "Qila Abdullah", "Qila Saifullah",
    "Quetta", "Sherani", "Sibi", "Sohbatpur", "Washuk", "Zhob", "Ziarat"
  ],
  "Gilgit-Baltistan": [
    "Astore", "Diamer", "Ghanche", "Ghizer", "Gilgit", "Hunza",
    "Nagar", "Skardu", "Shigar", "Kharmang"
  ],
  AJK: [
    "Bagh", "Bhimber", "Hattian Bala", "Haveli", "Kotli", "Mirpur",
    "Muzaffarabad", "Neelum", "Poonch", "Sudhnoti"
  ],
  ICT: ["Islamabad"]
};

const customFields = [
  "N", "P", "K", "Temperature Range(°C)", "Humidity(%)", "pH Range", "Rainfall(mm)"
];

export default function ProductRecommendation() {
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [customData, setCustomData] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const { addToCart } = useCart();


  useEffect(() => {
    fetch('/products.json')
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched products:', data); 
      const updatedData = data.map((product: Product) => ({
        ...product,
        id: product.id ? String(product.id) : 'undefined-id',
      }));
      console.log('Updated products with IDs:', updatedData);
      setProducts(updatedData);
    })
    .catch((error) => {
      console.error('Error loading products:', error);
    });
  }, []);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomData({ ...customData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRecommendations([]);
    setLoading(true);

    try {
      
      const requiredFields = ["N", "P", "K", "Temperature Range(°C)", "Humidity(%)", "pH Range", "Rainfall(mm)"];
      const missingFields = requiredFields.filter(field => !customData[field] || isNaN(parseFloat(customData[field])));
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all fields: ${missingFields.join(", ")}`);
      }

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          N: parseFloat(customData["N"]),
          P: parseFloat(customData["P"]),
          K: parseFloat(customData["K"]),
          temperature: parseFloat(customData["Temperature Range(°C)"]),
          humidity: parseFloat(customData["Humidity(%)"]),
          ph: parseFloat(customData["pH Range"]),
          rainfall: parseFloat(customData["Rainfall(mm)"])
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred while fetching recommendations.");
      }

      const data = await response.json();
      setRecommendations(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on recommended crops
  const getMatchingProducts = () => {
    const recommendedCropNames = recommendations.map(crop => crop.crop.toLowerCase());
    return products.filter(product =>
      recommendedCropNames.includes(product.name.toLowerCase())
    );
  };

  return (
    <div className="recommendation-container">
      <h1>Product Recommendation</h1>
      <form onSubmit={handleSubmit} className="recommendation-form">
        {/* Province Dropdown */}
        <div className="dropdown-container">
          <label htmlFor="province">Select Province:</label>
          <select
            id="province"
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            <option value="">Select Province:</option>
            {Object.keys(districtsData).map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>

          {/* District Dropdown */}
          {selectedProvince && (
            <>
              <label htmlFor="district">Select District:</label>
              <select id="district" disabled>
                <option value="">Select District:</option>
                {districtsData[selectedProvince].map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </>
          )}
        </div>

        <div className="divider">OR</div>

        {/* Custom Input Fields */}
        <div className="input-grid">
          {customFields.map((label) => (
            <div key={label} className="input-group">
              <label htmlFor={label}>{label}</label>
              <input
                type="text"
                id={label}
                name={label}
                placeholder={`Enter ${label}`}
                onChange={handleInputChange}
                value={customData[label] || ""}
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="results">
          <h3>Top Crop Recommendations:</h3>
          <ul>
            {recommendations.map((crop, index) => (
              <li key={index}>
                {crop.crop}: {crop.probability}%
              </li>
            ))}
          </ul>

          {/* Display Matching Products */}
          <div className="matching-products">
            <h3>Available Products:</h3>
            {getMatchingProducts().length > 0 ? (
              <div className="products-grid">
                {getMatchingProducts().map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="price">${product.price}</p>
                      <button
                        className="view-details"
                        onClick={() => setSelectedProduct(product)} 
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No matching products found.</p>
            )}
          </div>
        </div>
      )}

      {/* Product Popup */}
      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)} // Close the popup
        />
      )}
    </div>
  );
}