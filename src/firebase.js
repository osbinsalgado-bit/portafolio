// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAciW0V3a9L5hBorTUHJqTbIqz_97Tlfck",
  authDomain: "mi-portafolio-web-c9655.firebaseapp.com",
  projectId: "mi-portafolio-web-c9655",
  storageBucket: "mi-portafolio-web-c9655.firebasestorage.app",
  messagingSenderId: "714577092821",
  appId: "1:714577092821:web:5e88f3368bf47b21acc25c",
  measurementId: "G-5YDH8YD2BN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);