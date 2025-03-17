import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SignUpFormProps {
  toggleForm: (form: 'sign_up' | 'sign_in') => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    dob: '',
    gender: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for submit button
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Enable loading state

    try {
      // Pass the full formData object to the signup function
      await signup(formData);
      navigate('/'); // Redirect to home page on success
    } catch (err: any) {
      console.error('Signup error:', err);

      // Handle specific Firebase error codes
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters long.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setIsLoading(false); // Disable loading state
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {/* Display error message */}
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="fatherName"
          placeholder="Father's Name"
          value={formData.fatherName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group radio-group">
        <label>
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={formData.gender === 'Male'}
            onChange={handleChange}
            required
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={formData.gender === 'Female'}
            onChange={handleChange}
          />
          Female
        </label>
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {/* Submit button with loading state */}
      <button type="submit" className="auth-button" disabled={isLoading}>
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </button>

      <p className="auth-switch">
        Already have an account?{' '}
        <button type="button" onClick={() => toggleForm('sign_in')}>
          Sign In
        </button>
      </p>
    </form>
  );
};

export default SignUpForm;