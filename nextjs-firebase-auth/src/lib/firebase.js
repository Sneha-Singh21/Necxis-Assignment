import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-M4Zh1e1BTFCjn0fKF4LEzKEUb5ZGds0",
  authDomain: "nextexpoapp-87965.firebaseapp.com",
  projectId: "nextexpoapp-87965",
  storageBucket: "nextexpoapp-87965.firebasestorage.app",
  messagingSenderId: "514785020505",
  appId: "1:514785020505:web:fc0e409a7503399c7c7f48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
