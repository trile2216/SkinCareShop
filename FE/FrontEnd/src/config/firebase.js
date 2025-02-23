// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAieC7qoGQep11W4-LRyk-8O0W1hzCaPN4",
  authDomain: "swp391-70d9e.firebaseapp.com",
  projectId: "swp391-70d9e",
  storageBucket: "swp391-70d9e.firebasestorage.app",
  messagingSenderId: "858471614862",
  appId: "1:858471614862:web:873bfd5a866653b355bcdf",
  measurementId: "G-3EHL2JWRJR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth();
