import React, { createContext, useContext, useState, useEffect } from 'react';

// Updated User Interface
interface User {
  id: string; // Unique identifier for the user
  name: string;
  email: string;
  fatherName?: string; // Optional fields
  dob?: string;
  gender?: string;
}

// AuthContextType with added updateUser function
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  signup: (userData: User & { password: string }) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = (email: string, password: string) => {
    const storedPassword = localStorage.getItem(`password_${email}`);
    if (!storedPassword || storedPassword !== password) {
      throw new Error('Invalid credentials');
    }
    const userData = {
      id: email, // Use email as a unique ID for simplicity
      email,
      name: localStorage.getItem(`name_${email}`) || '',
      fatherName: localStorage.getItem(`fatherName_${email}`) || '',
      dob: localStorage.getItem(`dob_${email}`) || '',
      gender: localStorage.getItem(`gender_${email}`) || '',
    };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Signup function
  const signup = (userData: User & { password: string }) => {
    const { email, password, ...rest } = userData;
    // Store user data in localStorage
    localStorage.setItem(`password_${email}`, password);
    localStorage.setItem(`name_${email}`, rest.name || '');
    localStorage.setItem(`fatherName_${email}`, rest.fatherName || '');
    localStorage.setItem(`dob_${email}`, rest.dob || '');
    localStorage.setItem(`gender_${email}`, rest.gender || '');
    // Create user object without the password
    const userDataWithoutPassword = {
      id: email, // Use email as a unique ID for simplicity
      email,
      ...rest,
    };
    setUser(userDataWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userDataWithoutPassword));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.clear(); // Clear all localStorage data
  };

  // Update user function
  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) throw new Error('User not logged in');
    // Merge updated data with existing user data
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Provide the context value to the children
  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateUser, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}