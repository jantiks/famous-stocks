// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
const authDomain = process.env.REACT_APP_AUTH_DOMAIN;
const projectId = process.env.REACT_APP_PROJECT_ID;
const storageBucket = process.env.REACT_APP_STORAGE_BUCKET;
const messagingSenderId = process.env.REACT_APP_MESSAGING_SENDER_ID;
const appId = process.env.REACT_APP_APP_ID;
const measurementId = process.env.REACT_APP_MEASUREMENT_ID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
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
const subscribeForNotifications = httpsCallable(functions, 'subscribeForNotifications');
const getNotifications = httpsCallable(functions, 'getNotifications');
const deleteNotification = httpsCallable(functions, "deleteNotification")

export { app, auth, db, GoogleAuthProvider, getTransactions, subscribeForNotifications, signInWithPopup, getNotifications, deleteNotification };