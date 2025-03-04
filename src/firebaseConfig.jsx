// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAN4pgUSycF0NK0oQGBnbKIblcD2ne25cE",
    authDomain: "integral-859fb.firebaseapp.com",
    projectId: "integral-859fb",
    storageBucket: "integral-859fb.firebasestorage.app",
    messagingSenderId: "837408312914",
    appId: "1:837408312914:web:62528c74bb449ed12c998b",
    measurementId: "G-94T5R8YQZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider(); // Google🔥

export default app;
