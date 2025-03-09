import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import './styles.css';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const toggleForm = (form: 'sign_up' | 'sign_in') => {
    setIsSignUp(form === 'sign_up');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <h1>Welcome to Eco Farm</h1>
            <p>Get personalized crop recommendations for a greener, sustainable future.</p>
          </div>
          {isSignUp ? (
            <SignUpForm toggleForm={toggleForm} />
          ) : (
            <SignInForm toggleForm={toggleForm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;