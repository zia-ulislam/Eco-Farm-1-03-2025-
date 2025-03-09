import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Check } from 'lucide-react';
import Cart from './Cart';
import './Tabs.css';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  growthMaterials: {
    fertilizer: {
      name: string;
      image: string;
      price: number;
    };
    additionalMaterials: {
      name: string;
      image: string;
      price: number;
    }[];
  };
}

interface SelectedMaterials {
  [key: string]: boolean;
}

const tabsData = [
  "Cereals",
  "Pulses",
  "Vegetables",
  "Fruits",
  "Nuts",
  "Oilseeds",
  "Spices and Herbs",
  "Other Cash Crops",
  "Forage Crops",
  "Ornamental Plants",
  "Medicinal Plants",
  "Other"
];

function Tabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterials>({});
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('public/products.json')
      .then(response => response.json())
      .then(data => {
        // Ensure IDs are strings
        const updatedData = data.map((product: Product) => ({
          ...product,
          id: String(product.id),
        }));
        setProducts(updatedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading products:', error);
        setLoading(false);
      });
  }, []);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const handleAddToCart = (productId: string) => {
    console.log(`Adding product with ID: ${productId}`);
    console.log("__________________ start ____________________")
    addToCart(productId); // Ensure productId is a string
    console.log("__________________ end ____________________")
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setSelectedMaterials({});
  };

  const toggleMaterial = (materialName: string) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [materialName]: !prev[materialName],
    }));
  };

  return (
    <section className="tabs-section">
      <div className="tabs-block">
        <div className="tabs-buttons">
          {tabsData.map((tab, index) => (
            <button
              key={index}
              className={`tab-btn ${activeTab === index ? "active" : ""}`}
              onClick={() => handleTabClick(index)}
            >
              {tab}
            </button>
          ))}
          <div
            className="tabs-line"
            style={{
              left: `${activeTab * (100 / tabsData.length)}%`,
              width: `${100 / tabsData.length}%`,
            }}
          />
        </div>
        <div className="tabs-content">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            tabsData.map((tab, index) => (
              <div
                key={index}
                className={`text-content ${activeTab === index ? "active" : ""}`}
              >
                <div className="products-grid">
                  {getProductsByCategory(tab).length > 0 ? (
                    getProductsByCategory(tab).map(product => (
                      <div key={product.id} className="product-card">
                        <div className="product-image">
                          <img src={product.image} alt={product.name} />
                        </div>
                        <div className="product-info">
                          <h3>{product.name}</h3>
                          <p className="price">${product.price}</p>
                          <div className="growth-materials">
                            <p className="materials-title">Growth Materials:</p>
                            <p className="fertilizer">
                              <span>Fertilizer:</span> {product.growthMaterials.fertilizer.name}
                            </p>
                            <p className="additional">
                              <span>Additional:</span>{" "}
                              {product.growthMaterials.additionalMaterials
                                .map(m => m.name)
                                .join(", ")}
                            </p>
                          </div>
                          <div className="button-group">
                            <button
                              className="view-product"
                              onClick={() => handleViewProduct(product)}
                            >
                              View Product
                            </button>
                            <button
                              className="add-to-cart"
                              onClick={() => handleAddToCart(product.id)}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No products available in this category.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedProduct && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={handleCloseModal}>
              &times;
            </button>
            <div className="modal-product-details">
              <div className="modal-product-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="modal-product-info">
                <h2>{selectedProduct.name}</h2>
                <p className="modal-price">${selectedProduct.price}</p>
                <div className="modal-materials">
                  <h3>Growth Materials</h3>
                  <div className="fertilizer-section">
                    <h4>Fertilizer</h4>
                    <div
                      className={`material-item ${
                        selectedMaterials[selectedProduct.growthMaterials.fertilizer.name]
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        toggleMaterial(selectedProduct.growthMaterials.fertilizer.name)
                      }
                    >
                      <img
                        src={selectedProduct.growthMaterials.fertilizer.image}
                        alt={selectedProduct.growthMaterials.fertilizer.name}
                      />
                      <span>{selectedProduct.growthMaterials.fertilizer.name}</span>
                      <span className="material-price">
                        ${selectedProduct.growthMaterials.fertilizer.price}
                      </span>
                      {selectedMaterials[selectedProduct.growthMaterials.fertilizer.name] && (
                        <Check className="check-icon" size={20} />
                      )}
                    </div>
                  </div>
                  <div className="additional-materials">
                    <h4>Additional Materials</h4>
                    {selectedProduct.growthMaterials.additionalMaterials.map(
                      (material, index) => (
                        <div
                          key={index}
                          className={`material-item ${
                            selectedMaterials[material.name] ? "selected" : ""
                          }`}
                          onClick={() => toggleMaterial(material.name)}
                        >
                          <img src={material.image} alt={material.name} />
                          <span>{material.name}</span>
                          <span className="material-price">${material.price}</span>
                          {selectedMaterials[material.name] && (
                            <Check className="check-icon" size={20} />
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <button
                  className="modal-add-to-cart"
                  onClick={() => {
                    handleAddToCart(selectedProduct.id);
                    handleCloseModal();
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


export default Tabs;