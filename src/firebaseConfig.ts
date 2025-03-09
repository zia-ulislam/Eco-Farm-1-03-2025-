import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCQuqrl3MIiOnv_MOl4lO2HrE-ltt-1-gQ",
    authDomain: "eco-farm-27e50.firebaseapp.com",
    projectId: "eco-farm-27e50",
    storageBucket: "eco-farm-27e50.firebasestorage.app",
    messagingSenderId: "506844050076",
    appId: "1:506844050076:web:b9b1a2ab572a6dbd793359",
    measurementId: "G-RTBXKBK469"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
