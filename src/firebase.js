import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAA1vHKb0MfmQFcdSyoRQELgcT-tqSDItA",
  authDomain: "movesync-ai.firebaseapp.com",
  projectId: "movesync-ai",
  appId: "1:215825315602:web:b0d0455b5426cad87225cb",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
