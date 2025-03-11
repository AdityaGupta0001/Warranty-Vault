  import dotenv from "dotenv";
  dotenv.config();
  import { initializeApp } from "firebase/app";
  import {
    GoogleAuthProvider,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
  } from "firebase/auth";
  import admin from "firebase-admin";
  import { readFile } from "fs/promises";

  const serviceAccount = JSON.parse(
    await readFile(new URL("../FirebaseService.json", import.meta.url))
  );
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

  initializeApp(firebaseConfig);

  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

  export {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    admin,
  };
