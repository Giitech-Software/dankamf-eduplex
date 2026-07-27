// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyClkuK14XE6_uC6PEzLyngq-CxTHDjsJfw",
  authDomain: "dankamf-eduplex.firebaseapp.com",
  projectId: "dankamf-eduplex",
  storageBucket: "dankamf-eduplex.firebasestorage.app",
  messagingSenderId: "665022847750",
  appId: "1:665022847750:web:84a197b57576a6e756dc87",
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


export { app, db, storage, auth };
