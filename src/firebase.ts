// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDokCe_dPGf-evAptOj1FDijNI3z3owOL0",
  authDomain: "famous-stocks.firebaseapp.com",
  projectId: "famous-stocks",
  storageBucket: "famous-stocks.appspot.com",
  messagingSenderId: "106183287113",
  appId: "1:106183287113:web:07b8713b994d3be8cc3a98",
  measurementId: "G-M2H8K546D6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// if (window.location.host.includes("localhost")) {
//   connectAuthEmulator(auth, "http://127.0.0.1:9099");
//   console.log("ASD IN EMULATOR MODE.");
// }

const functions = getFunctions();
const getTransactions = httpsCallable(functions, 'getTransactions');

export { app, auth, db, getTransactions };