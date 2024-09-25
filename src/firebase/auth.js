import {
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { auth } from "./config";
// import { useContext } from "react";
// import { AuthContext } from "../auth/AuthProvider";

export const createUser = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  return signOut(auth);
};

export const passwordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const passwordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const updateUsername = (email) => {
  return updateEmail(auth.currentUser, email);
};

export const reAuth = async (user, password) => {
  signInWithEmailAndPassword(auth, user.email, password).then((cred) => {
    return reauthenticateWithCredential(user, cred);
  });
};
