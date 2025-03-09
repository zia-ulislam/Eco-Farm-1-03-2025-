import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import { UserCircle, Settings, LogOut } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();

  // State for form inputs
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  // State for error messages
  const [error, setError] = useState<string | null>(null);

  // Update formData when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
  }, [user]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(formData); // Call the updateUser function from AuthContext
      setError(null); // Clear any previous errors
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <UserCircle className="profile-avatar" />
        <h1>{user?.name || 'User'}</h1>
        <p>{user?.email}</p>
      </div>

      {/* Profile Actions */}
      <div className="profile-actions">
        <button onClick={() => alert('Settings not implemented yet')} aria-label="Open settings">
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <button onClick={logout} className="logout-button" aria-label="Logout">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      {/* Profile Update Form */}
      <form onSubmit={handleSubmit} className="profile-form" aria-labelledby="update-profile-heading">
        <h2 id="update-profile-heading">Update Profile</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            aria-label="Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            aria-label="Email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password (optional)"
            aria-label="Password"
          />
        </div>
        <button type="submit" className="update-button" aria-label="Update profile">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;