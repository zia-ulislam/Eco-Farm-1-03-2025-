import React from 'react';
import { X, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductPopup.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  growthMaterials?: {
    fertilizer?: {
      name: string;
      image: string;
    };
    additionalMaterials?: Array<{
      name: string;
      image: string;
    }>;
  };
}

interface ProductPopupProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductPopup: React.FC<ProductPopupProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [selectedMaterial, setSelectedMaterial] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    addToCart(product.id);
    onClose();
  };

  const handleMaterialSelect = (materialName: string) => {
    setSelectedMaterial(materialName === selectedMaterial ? null : materialName);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-modal">
          <X size={24} />
        </button>
        
        <div className="modal-product-details">
          <div className="modal-product-image">
            <img src={product.image} alt={product.name} />
          </div>
          
          <div className="modal-product-info">
            <h2>{product.name}</h2>
            <p className="modal-price">${product.price.toFixed(2)}</p>
            
            {product.category && (
              <div className="product-category">
                <span className="category-label">Category:</span>
                <span className="category-value">{product.category}</span>
              </div>
            )}
            
            {product.growthMaterials && (
              <div className="modal-materials">
                <h3>Growth Materials</h3>
                
                {product.growthMaterials.fertilizer && (
                  <div className="fertilizer-section">
                    <h4>Recommended Fertilizer:</h4>
                    <div 
                      className={`material-item ${selectedMaterial === product.growthMaterials.fertilizer.name ? 'selected' : ''}`}
                      onClick={() => handleMaterialSelect(product.growthMaterials.fertilizer!.name)}
                    >
                      <img 
                        src={product.growthMaterials.fertilizer.image} 
                        alt={product.growthMaterials.fertilizer.name} 
                      />
                      <span>{product.growthMaterials.fertilizer.name}</span>
                      {selectedMaterial === product.growthMaterials.fertilizer.name && (
                        <Check className="check-icon" size={20} />
                      )}
                    </div>
                  </div>
                )}
                
                {product.growthMaterials.additionalMaterials && 
                 product.growthMaterials.additionalMaterials.length > 0 && (
                  <div className="additional-materials">
                    <h4>Additional Materials:</h4>
                    <div className="materials-list">
                      {product.growthMaterials.additionalMaterials.map((material, index) => (
                        <div 
                          key={index} 
                          className={`material-item ${selectedMaterial === material.name ? 'selected' : ''}`}
                          onClick={() => handleMaterialSelect(material.name)}
                        >
                          <img src={material.image} alt={material.name} />
                          <span>{material.name}</span>
                          {selectedMaterial === material.name && (
                            <Check className="check-icon" size={20} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <button onClick={handleAddToCart} className="modal-add-to-cart">
              <ShoppingCart size={20} style={{ marginRight: '8px' }} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPopup;