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
const auth = getAuth(app); //done by me
const db = getFirestore(app); //done by me

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
    console.log(error);
    // alert(error);
    toast.error(error.code.split('/')[1].split('-').join(" ")); //found something new
  }
};

const login = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    console.log(res.user);
  } catch (error) {
    console.log(error);
    // alert(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

const logout = () => {
  try {
    signOut(auth);
  } catch (error) {
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
};

export { auth, db, login, signup, logout };
