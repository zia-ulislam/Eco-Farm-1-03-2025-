import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { logEvent } from 'firebase/analytics';
import './styles.css';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const toggleForm = (form: 'sign_up' | 'sign_in') => {
    setIsSignUp(form === 'sign_up');
    setError(null);
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      logEvent(auth, 'google_sign_in_success');
      navigate('/');
    } catch (err: any) {
      console.error('Google sign-in error:', err.message);

      logEvent(auth, 'google_sign_in_failure', {
        errorMessage: err.message,
      });

      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <h1>Welcome to Eco Farm</h1>
            <p>Get personalized crop recommendations for a greener, sustainable future.</p>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="button" className="google-signin-button" onClick={handleGoogleSignIn}>
            Sign in with Google
          </button>

          <div className="divider">
            <span>Or</span>
          </div>

          {isSignUp ? <SignUpForm toggleForm={toggleForm} /> : <SignInForm toggleForm={toggleForm} />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;