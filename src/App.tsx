import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';
import PrivateRoute from './components/PrivateRoute';
import ProductPage from './pages/product/product';
import ContactPage from './pages/ContactPage/ContactPage';
import TutorialPage from './pages/TutorialPage/TutorialPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Settings from './pages/setting/Settings';
import './App.css';

function App() {
  return (
    <Router>
      {/* Wrap the entire app with AuthProvider and CartProvider */}
      <AuthProvider>
        <CartProvider>
          <div className="app">
            {/* Navbar */}
            <Navbar />
            
            {/* Main Content */}
            <main className="main-content">
              <Routes>
                {/* Home Page */}
                <Route path="/" element={<HomePage />} />
                
                {/* Authentication Page */}
                <Route path="/auth" element={<AuthPage />} />
                
                {/* Product Page */}
                <Route path="/products" element={<ProductPage />} />
                
                {/* Contact Page */}
                <Route path="/contact" element={<ContactPage />} />
                
                {/* Tutorial Page */}
                <Route path="/tutorials" element={<TutorialPage />} />
                
                {/* Profile Page (Protected Route) */}
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  } 
                />
                {/* Setting (Protected Route) */}
                <Route 
                  path="/Settings" 
                  element={
                    <PrivateRoute>
                      <Settings/>
                    </PrivateRoute>
                  } 
                />
                
                {/* Checkout Page (Protected Route) */}
                <Route 
                  path="/checkout" 
                  element={
                    <PrivateRoute>
                      <CheckoutPage />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;