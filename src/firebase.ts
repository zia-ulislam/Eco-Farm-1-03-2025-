import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, logEvent, setAnalyticsCollectionEnabled } from "firebase/analytics";
import { getDatabase } from "firebase/database"; 

const firebaseConfig = {
  apiKey: "AIzaSyCQuqrl3MIiOnv_MOl4lO2HrE-ltt-1-gQ",
  authDomain: "eco-farm-27e50.firebaseapp.com",
  projectId: "eco-farm-27e50",
  storageBucket: "eco-farm-27e50.firebasestorage.app",
  messagingSenderId: "506844050076",
  appId: "1:506844050076:web:b9b1a2ab572a6dbd793359",
  measurementId: "G-RTBXKBK469",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const analytics = getAnalytics(app);
setAnalyticsCollectionEnabled(analytics, true);

const realTimeDb = getDatabase(app); 

export const signUpWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signInWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());

export const logout = () => signOut(auth);

export { auth, db, app, analytics, realTimeDb }; 