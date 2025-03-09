import React, { useState } from 'react';
import { Bell, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 
import './Settings.css';

interface SettingsState {
  username: string;
  email: string;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: string;
}

const Settings = () => {
  const { user, updateUser } = useAuth(); // Access the user and updateUser function
  const [settings, setSettings] = useState<SettingsState>({
    username: user?.name || '',
    email: user?.email || '',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    theme: 'light',
  });

  // Handle input changes for both text/checkbox fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings((prev) => ({ ...prev, [name]: checked }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Update the user data in AuthContext
      await updateUser({
        name: settings.username,
        email: settings.email,
      });
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings. Please try again.');
    }
  };

  return (
    <div className="settings-page">
      {/* Header Section */}
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit} className="settings-form" aria-labelledby="settings-heading">
        {/* Profile Settings Section */}
        <div className="settings-section">
          <h2 id="profile-settings-heading">
            <User size={20} style={{ display: 'inline', marginRight: '10px' }} />
            Profile Settings
          </h2>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={settings.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              aria-label="Username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              aria-label="Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={settings.language}
              onChange={handleChange}
              aria-label="Language"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="settings-section">
          <h2 id="notifications-settings-heading">
            <Bell size={20} style={{ display: 'inline', marginRight: '10px' }} />
            Notifications
          </h2>
          <div className="notification-option">
            <input
              type="checkbox"
              id="emailNotifications"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
              aria-label="Email Notifications"
            />
            <label htmlFor="emailNotifications">Email Notifications</label>
          </div>
          <div className="notification-option">
            <input
              type="checkbox"
              id="pushNotifications"
              name="pushNotifications"
              checked={settings.pushNotifications}
              onChange={handleChange}
              aria-label="Push Notifications"
            />
            <label htmlFor="pushNotifications">Push Notifications</label>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="settings-section">
          <h2 id="preferences-settings-heading">
            <Shield size={20} style={{ display: 'inline', marginRight: '10px' }} />
            Preferences
          </h2>
          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              aria-label="Theme"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <button type="submit" className="save-button" aria-label="Save changes">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;