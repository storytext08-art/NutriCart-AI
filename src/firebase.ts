import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0562689723",
  appId: "1:347736643499:web:5e8343653aae88f37264ee",
  apiKey: "AIzaSyCFei1OkL8Fm0KBxLZQ9qgAZAACmC7pEJQ",
  authDomain: "gen-lang-client-0562689723.firebaseapp.com",
  storageBucket: "gen-lang-client-0562689723.firebasestorage.app",
  messagingSenderId: "347736643499",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, "ai-studio-nutricartai-b473500c-970d-46cf-bcd9-aac0bee75072");
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db, googleProvider };
