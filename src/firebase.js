import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB5EifeKUTCNcd4wxGOJkQAYDQef3tUgrw",
  authDomain: "roommate-finder-180cb.firebaseapp.com",
  databaseURL: "https://roommate-finder-180cb-default-rtdb.firebaseio.com",
  projectId: "roommate-finder-180cb",
  storageBucket: "roommate-finder-180cb.firebasestorage.app",
  messagingSenderId: "441446575594",
  appId: "1:441446575594:web:675fc380d051ebd8dfd693",
  measurementId: "G-LYX9JPYLC6",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
