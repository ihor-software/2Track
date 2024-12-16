import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsc_nLUXx6W9TKuWKLJqhxDY9LtQInCoY",
  authDomain: "taskmanager-d1564.firebaseapp.com",
  projectId: "taskmanager-d1564",
  storageBucket: "taskmanager-d1564.appspot.com",
  messagingSenderId: "689378736254",
  appId: "1:689378736254:web:db7b06470cc44161fd002f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };

