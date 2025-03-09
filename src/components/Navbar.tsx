import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  MessageCircle,
  Video,
  Search,
  ShoppingCart,
  User,
  Menu,
  LogIn,
  LogOut,
  Settings,
  UserCircle,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Cart from './Cart';
import ProductPopup from './ProductPopup';
import './Navbar.css';

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

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductPopupOpen, setIsProductPopupOpen] = useState(false);
  const { totalQuantity } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    fetch('public/products.json')
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((product: Product) => ({
          ...product,
          id: String(product.id),
        }));
        setProducts(updatedData);
      })
      .catch((error) => {
        console.error('Error loading products:', error);
      });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const handleCartItems = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemIds = cartItems.map(item => item.product_id);
    const cartProducts = products.filter(product =>
      cartItemIds.includes(`${product.id}`)
    );
    setFilteredProducts(cartProducts);
    setIsCartOpen(true);
  };


  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductPopupOpen(true);
    setSearchQuery(''); 
  };

  return (
    <>
      <nav className="desktop-nav">
        <div className="brand">
          <img src="/images/logo.png" alt="Eco Farm" />
          <h1>Eco Farm</h1>
        </div>

        <div className="nav-links">
          <Link to="/">HOME</Link>
          <Link to="/products">PRODUCTS</Link>
          <Link to="/contact">CONTACT</Link>
          <Link to="/tutorials">TUTORIALS</Link>
        </div>

        <div className="nav-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search className="search-icon" />
            {searchQuery && (
              <div className="search-results">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="search-result-item"
                      onClick={() => handleProductClick(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="search-result-image"
                      />
                      <div className="search-result-info">
                        <p>{product.name}</p>
                        <p>${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No results found</p>
                )}
              </div>
            )}
          </div>

          <div className="cart-container" onClick={handleCartItems}>
            <ShoppingCart />
            {totalQuantity > 0 && (
              <span className="cart-badge">{totalQuantity}</span>
            )}
          </div>

          {isAuthenticated ? (
            <div className="profile-container">
              <button
                className="profile-button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <UserCircle className="user-icon" />
              </button>

              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <UserCircle className="profile-avatar" />
                    <div className="profile-info">
                      <p className="profile-name">{user?.name || 'User'}</p>
                      <p className="profile-email">{user?.email}</p>
                    </div>
                  </div>
                  <div className="profile-menu">
                    <Link
                      to="/profile"
                      className="profile-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="profile-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    <button onClick={handleLogout} className="profile-item logout">
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="auth-button">
              <LogIn className="login-icon" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        {/* Top Bar */}
        <div className="mobile-header">
          <div className="brand">
            <img src="/images/logo.png" alt="Eco Farm" />
            <h1>Eco Farm</h1>
          </div>

          <div className="header-actions">
            <div className="cart-container" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart />
              {totalQuantity > 0 && (
                <span className="cart-badge">{totalQuantity}</span>
              )}
            </div>
            <Menu
              className="menu-icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="mobile-search">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search className="search-icon" />
            {searchQuery && (
              <div className="search-results">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="search-result-item"
                      onClick={() => handleProductClick(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="search-result-image"
                      />
                      <div className="search-result-info">
                        <p>{product.name}</p>
                        <p>${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No results found</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <Link to="/" className="nav-item">
            <Home />
            <span>Home</span>
          </Link>
          <Link to="/products" className="nav-item">
            <ShoppingBag />
            <span>Products</span>
          </Link>
          <Link to="/tutorials" className="nav-item">
            <Video />
            <span>Tutorials</span>
          </Link>
          <Link to="/contact" className="nav-item">
            <MessageCircle />
            <span>Contact</span>
          </Link>
          {isAuthenticated ? (
            <button
              className="nav-item"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <UserCircle />
              <span>Profile</span>
            </button>
          ) : (
            <Link to="/auth" className="nav-item">
              <LogIn />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
                <div className="menu-overlay">
                  <div className="menu-content">
                    <div className="menu-header">
                      <h2>Menu</h2>
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="close-button"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="menu-items">
                      {isAuthenticated ? (
                        <>
            {/* Profile Header */}
                    <div className="mobile-profile-header">
                      <UserCircle className="mobile-profile-avatar" />
                      <div className="mobile-profile-info">
                        <p className="mobile-profile-name">{user?.name || 'User'}</p>
                        <p className="mobile-profile-email">{user?.email}</p>
                      </div>
                    </div>

                    {/* Profile Menu Items */}
                    <Link
                      to="/profile"
                      className="mobile-menu-item"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="mobile-menu-item"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>

                  
                    <button
                      onClick={handleLogout}
                      className="mobile-logout-button"
                              >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                  
                    <Link
                      to="/login"
                      className="mobile-menu-item"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn size={16} />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        products={filteredProducts.length > 0 ? filteredProducts : []}
      />

      {/* Product Popup */}
      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          isOpen={isProductPopupOpen}
          onClose={() => setIsProductPopupOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;