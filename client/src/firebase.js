// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA8qMrHZyJVActzD0qhPme5mGGyxHFIT6w",
    authDomain: "ctrl-your-finances.firebaseapp.com",
    projectId: "ctrl-your-finances",
    storageBucket: "ctrl-your-finances.appspot.com",
    messagingSenderId: "337469216172",
    appId: "1:337469216172:web:9709a4e1505702475f5609",
    measurementId: "G-M1XFB73BP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);