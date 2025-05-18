// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics"; // Import Analytics

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlRhlAhDkNLTdLkdJLuZ2cwDGYUocEvjk",
  authDomain: "medical-app-a7861.firebaseapp.com",
  projectId: "medical-app-a7861",
  storageBucket: "medical-app-a7861.firebasestorage.app",
  messagingSenderId: "1030659391468",
  appId: "1:1030659391468:web:5932701e19726d437f0ac9",
  measurementId: "G-KMBX65FQZR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app); // Khởi tạo Firestore
export const storage = getStorage(app);
// Initialize Firebase Analytics only in the browser
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Export the necessary components
export { app, db, analytics, auth, GoogleAuthProvider, signInWithPopup };
