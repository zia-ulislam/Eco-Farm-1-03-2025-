import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
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
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/tutorials" element={<TutorialPage />} />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/Settings" 
                  element={
                    <PrivateRoute>
                      <Settings/>
                    </PrivateRoute>
                  } 
                />
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
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;