// This file contains the Firebase configuration for the app.
// The configuration object is provided by Firebase and should not be modified.
const firebaseConfig = {
  apiKey: "AIzaSyB3mJyIg4iem1MDEeRvl45J0hzTUDaQpAU",
  authDomain: "rahee-cards-database.firebaseapp.com",
  databaseURL: "https://rahee-cards-database-default-rtdb.firebaseio.com",
  projectId: "rahee-cards-database",
  storageBucket: "rahee-cards-database.appspot.com",
  messagingSenderId: "1024665839933",
  appId: "1:1024665839933:web:26f1c735b49883dffbbd54"
};

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const rtdb = getDatabase(app);
