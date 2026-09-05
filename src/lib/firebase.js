// src/lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAhdnLaR9p2ObTHz9gBilH94qrT2tNDzsk",
  authDomain: "guru-723c2.firebaseapp.com",
  projectId: "guru-723c2",
  storageBucket: "guru-723c2.firebasestorage.app",
  messagingSenderId: "29654072562",
  appId: "1:29654072562:web:4c1ed12c4d022950eaa46b",
  measurementId: "G-LX2N3HL804",
};

// Next.js (SSR) safety check for Firebase initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// SSR-safe Messaging export for Push Notifications
export let messaging = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}