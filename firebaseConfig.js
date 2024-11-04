// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; // Importa Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFANRELw7hgwqsYa7TRUgJnfyWx7WT4Ac",
  authDomain: "myotterapp-d073e.firebaseapp.com",
  projectId: "myotterapp-d073e",
  storageBucket: "myotterapp-d073e.firebasestorage.app",
  messagingSenderId: "1079067025448",
  appId: "1:1079067025448:web:ddf798f15aa1b338f8d51d",
  measurementId: "G-PX346ZKGFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializa y exporta auth
const db = getFirestore(app); // Inicializa y exporta Firestore

export { auth, db }; // Exporta auth y db
