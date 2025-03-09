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
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signup(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError('Failed to create an account');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="fatherName"
          placeholder="Father's Name"
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="date"
          name="dob"
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
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="auth-button">Sign Up</button>
      
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
