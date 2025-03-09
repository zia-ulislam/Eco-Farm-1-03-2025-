import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, products }) => {
  const { cart, changeQuantity } = useCart();
  const navigate = useNavigate();

  console.log('Cart state in Cart component:', cart);
  console.log('Products prop in Cart component:', products);

  if (!isOpen) return null;

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.product_id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  return (
    <div className="cart-overlay">
      <div className="cart-container-products">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button onClick={onClose} className="close-cart" aria-label="Close Cart">
            <X />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => {
              const product = products.find(p => p.id === item.product_id);
              if (!product) {
                console.warn(`Product with ID ${item.product_id} not found in products list.`);
                return null;
              }

              return (
                <div key={item.product_id} className="cart-item">
                  <div className="item-image">
                    <img src={product.image} alt={product.name} />
                  </div>

                  <div className="item-details">
                    <h3>{product.name}</h3>
                    <p className="item-price">${(product.price * item.quantity).toFixed(2)}</p>

                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => changeQuantity(item.product_id, 'minus')}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease Quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => changeQuantity(item.product_id, 'plus')}
                        aria-label="Increase Quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
              aria-label="Proceed to Checkout"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;