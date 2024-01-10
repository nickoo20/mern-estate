// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-46535.firebaseapp.com",
  projectId: "mern-estate-46535",
  storageBucket: "mern-estate-46535.appspot.com",
  messagingSenderId: "818369686242",
  appId: "1:818369686242:web:8aae9a2b3270b20c360cbb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);