// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";
import { firebaseConfig } from "./config/env";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const getFirebaseErrorMessage = (error) => {
  const code = error?.code?.split('/')[1];

  if (!code) {
    return 'Something went wrong. Please try again.';
  }

  return code.split('-').join(' ');
};

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "user"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (error) {
    toast.error(getFirebaseErrorMessage(error));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    toast.error(getFirebaseErrorMessage(error));
  }
};

const logout = () => {
  try {
    signOut(auth);
  } catch (error) {
    toast.error(getFirebaseErrorMessage(error));
  }
};

export { auth, db, login, signup, logout };
