// Firebase core এবং Realtime Database এর প্রয়োজনীয় ফাংশনগুলো ইমপোর্ট করা হচ্ছে
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, onValue, update } from "firebase/database";

// আপনার দেওয়া কনফিগুরেশন
const firebaseConfig = {
  apiKey: "AIzaSyC43nC6qItCpRoGoUKmKzWSYUg9V-7cLbo",
  authDomain: "gamers-haven-ce22b.firebaseapp.com",
  databaseURL: "https://gamers-haven-ce22b-default-rtdb.firebaseio.com",
  projectId: "gamers-haven-ce22b",
  storageBucket: "gamers-haven-ce22b.firebasestorage.app",
  messagingSenderId: "515309551939",
  appId: "1:515309551939:web:986d865c1e3aaaac0b6ff6",
  measurementId: "G-XF2BMPEMP6"
};

// Firebase ইনিশিয়ালাইজ করা
const app = initializeApp(firebaseConfig);

// Realtime Database কানেকশন তৈরি করা
const db = getDatabase(app);

// অন্য ফাইলে ব্যবহারের জন্য এগুলো এক্সপোর্ট করা হচ্ছে
export { 
  db, 
  ref, 
  set, 
  get, 
  child, 
  onValue, 
  update 
};
