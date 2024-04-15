// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPeAiXpaNmtMa1cisK4gXqvdlRvEKphzs",
  authDomain: "vortex-plus-b06f7.firebaseapp.com",
  projectId: "vortex-plus-b06f7",
  storageBucket: "vortex-plus-b06f7.appspot.com",
  messagingSenderId: "690193069668",
  appId: "1:690193069668:web:8fb20f9651df91628d1171",
  measurementId: "G-5ENQQLXGXG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase foi inicializado");

export { db };