import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAaUSHex25r3EE3i-RfLKeJnmOpyCEk1A",
  authDomain: "chatty-firebase-30426.firebaseapp.com",
  projectId: "chatty-firebase-30426",
  storageBucket: "chatty-firebase-30426.appspot.com",
  messagingSenderId: "999053669422",
  appId: "1:999053669422:web:5404a3d2936f7461a9dbbf",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
