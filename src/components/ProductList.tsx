import React from 'react';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  growthMaterials: {
    fertilizer: { name: string };
    additionalMaterials: { name: string }[];
  };
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (productId: string) => {
    console.log(productId)
    addToCart(productId);
    alert('Item added to cart!');
  };

  return (
    <div className="products-grid">
      {products.map((product) => (
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
                <span>Additional:</span>{' '}
                {product.growthMaterials.additionalMaterials.map((m) => m.name).join(', ')}
              </p>
            </div>
            <button
              className="add-to-cart"
              onClick={() => handleAddToCart(product.id)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;