import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logout,
  db,
} from "../firebase"; 
import {
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// Define User Interface
interface User {
  id: string;
  name: string;
  email: string;
  fatherName?: string;
  dob?: string;
  gender?: string;
}

// Define AuthContextType Interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: User & { password: string }) => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser({ id: currentUser.uid, ...userDoc.data() } as User);
        } else {
          setUser({
            id: currentUser.uid,
            name: currentUser.displayName || "",
            email: currentUser.email || "",
          });
        }
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login Function
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  // Signup Function
  const signup = async (userData: User & { password: string }) => {
    const { email, password, ...rest } = userData;
    try {
      const userCredential = await signUpWithEmail(email, password);
      const user = userCredential.user;

      // Store additional user details in Firestore
      await setDoc(doc(db, "users", user.uid), { name: userData.name, email, ...rest });

      // Update user state
      setUser({ id: user.uid, email, ...rest });
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error("Failed to create an account");
    }
  };

  // Google Sign-In Function
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Create user in Firestore if not already present
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "",
          email: user.email || "",
        });
      }

      // Update user state
      setUser({
        id: user.uid,
        name: user.displayName || "",
        email: user.email || "",
      });
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error("Failed to sign in with Google");
    }
  };

  // Logout Function
  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Update User Function
  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) throw new Error("User not logged in");

    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, updatedData);

      // Update user state
      setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedData } : null));
    } catch (error) {
      throw new Error("Failed to update user");
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    signInWithGoogle,
    logout: logoutUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};