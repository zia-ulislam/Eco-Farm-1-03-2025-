import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase';
import { logEvent } from 'firebase/analytics';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface SignInFormProps {
  toggleForm: (form: 'sign_up' | 'sign_in') => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ toggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      logEvent(auth, 'sign_in_success', {
        method: 'email_password',
        email,
      });
      navigate('/');
    } catch (err: any) {
      console.error('Sign-in error:', err);

      if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to sign in. Please try again.');
      }

      logEvent(auth, 'sign_in_failure', {
        method: 'email_password',
        errorMessage: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      logEvent(auth, 'sign_in_success', {
        method: 'google',
      });
      navigate('/');
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError('Failed to sign in with Google. Please try again.');

      logEvent(auth, 'sign_in_failure', {
        method: 'google',
        errorMessage: err.message,
      });
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="auth-button" disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>

      <button
        type="button"
        className="google-signin-button"
        onClick={handleGoogleSignIn}
      >
        Sign in with Google
      </button>

      <p className="auth-switch">
        Don't have an account?{' '}
        <button type="button" onClick={() => toggleForm('sign_up')}>
          Sign Up
        </button>
      </p>
    </form>
  );
};

export default SignInForm;