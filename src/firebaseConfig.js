import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

 const firebaseConfig = {
  apiKey: "AIzaSyAA1vHKb0MfmQFcdSyoRQELgcT-tqSDItA",
  authDomain: "movesync-ai.firebaseapp.com",
  projectId: "movesync-ai",
  storageBucket: "movesync-ai.firebasestorage.app",
  messagingSenderId: "215825315602",
  appId: "1:215825315602:web:b0d0455b5426cad87225cb",
  measurementId: "G-B7817GMHTH"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();