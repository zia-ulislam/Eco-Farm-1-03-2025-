import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Truck, Minus, Plus, Trash2 } from 'lucide-react';
import './styles.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const CheckoutPage = () => {
  const { cart, removeFromCart, changeQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    location: '',
    city: '',
    district: '',
    postalCode: '',
  });

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/products.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const updatedData = data.map((product: Product) => ({
          ...product,
          id: String(product.id),
        }));
        setProducts(updatedData);
      })
      .catch(error => {
        console.error('Error loading products:', error);
      });
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.product_id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.location ||
      !formData.city ||
      !formData.district ||
      !formData.postalCode
    ) {
      alert('Please fill out all fields.');
      return;
    }

    console.log('Order submitted:', { formData, cart });
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order</p>
        </div>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Shipping Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Address</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="district">District</label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                cart.map(item => {
                  const product = products.find(p => p.id === item.product_id);
                  if (!product) return null;

                  return (
                    <div key={item.product_id} className="order-item">
                      <img src={product.image} alt={product.name} />
                      <div className="item-details">
                        <h3>{product.name}</h3>
                        <p className="price">${(product.price * item.quantity).toFixed(2)}</p>
                        <div className="controls-container">
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                changeQuantity(item.product_id, 'minus');
                              }}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease Quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="quantity-value">{item.quantity}</span>
                            <button
                              className="quantity-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                changeQuantity(item.product_id, 'plus');
                              }}
                              aria-label="Increase Quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            className="delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.product_id);
                            }}
                            aria-label="Remove Item"
                          >
                            <Trash2 size={16} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="order-total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" className="submit-button">
            <Truck className="truck-icon" />
            Complete Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;