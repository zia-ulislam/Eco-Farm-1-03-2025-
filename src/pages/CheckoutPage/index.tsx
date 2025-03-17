import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Truck, Minus, Plus, Trash2 } from "lucide-react";
import { db } from "../../firebaseConfig";
import { logEvent } from "firebase/analytics";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { analytics } from "../../firebase";
import "./styles.css";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const CheckoutPage = () => {
  const { cart, removeFromCart, changeQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: "",
    location: "",
    city: "",
    district: "",
    postalCode: "",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch("/products.json")
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((product: Product) => ({
          ...product,
          id: String(product.id),
        }));
        setProducts(updatedData);
      })
      .catch((error) => console.error("Error loading products:", error));
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find((p) => p.id === item.product_id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.location ||
      !formData.city ||
      !formData.district ||
      !formData.postalCode
    ) {
      alert("Please fill out all fields.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        userId: user?.uid || "guest",
        userName: formData.name,
        phone: formData.phone,
        address: {
          location: formData.location,
          city: formData.city,
          district: formData.district,
          postalCode: formData.postalCode,
        },
        items: cart.map((item) => ({
          productId: item.product_id,
          name:
            products.find((p) => p.id === item.product_id)?.name || "Unknown",
          price: products.find((p) => p.id === item.product_id)?.price || 0,
          quantity: item.quantity,
        })),
        totalAmount: calculateTotal(),
        status: "Pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);

      logEvent(analytics, "order_placed", {
        userId: user?.uid || "guest",
        totalAmount: calculateTotal(),
        itemCount: cart.length,
      });

      setShowPopup(true);
    } catch (error) {
      console.error("Error placing order:", error);

      logEvent(analytics, "order_placement_failure", {
        errorMessage: error.message,
      });

      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    clearCart();
    navigate("/");
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
              {["name", "phone", "location", "city", "district", "postalCode"].map((field) => (
                <div className="form-group" key={field}>
                  <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                cart.map((item) => {
                  const product = products.find((p) => p.id === item.product_id);
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
                                changeQuantity(item.product_id, "minus");
                              }}
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="quantity-value">{item.quantity}</span>
                            <button
                              className="quantity-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                changeQuantity(item.product_id, "plus");
                              }}
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

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Processing..." : (
              <>
                <Truck className="truck-icon" /> Complete Order
              </>
            )}
          </button>
        </form>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase. Your order is being processed.</p>
            <Link to="/" className="ok-button" onClick={handlePopupClose}>
              OK
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;