import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAr1McjCwnvRuaq8hu_j_-_WLPzM3Y9skM",
  authDomain: "modern-baton-388411.firebaseapp.com",
databaseURL: "https://modern-baton-388411-default-rtdb.firebaseio.com",
  projectId: "modern-baton-388411",
  storageBucket: "modern-baton-388411.appspot.com",
  messagingSenderId: "267615371377",
  appId: "1:267615371377:web:0798e060e8fc00f9409bd0",
  measurementId: "G-P67SFHP0KH"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
