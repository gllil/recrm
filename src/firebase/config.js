// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCICci0OdrGkj58XJ4azVO_rXM_ioh8UIg",
  authDomain: "real-estate-crm-2a2c2.firebaseapp.com",
  projectId: "real-estate-crm-2a2c2",
  storageBucket: "real-estate-crm-2a2c2.appspot.com",
  messagingSenderId: "711148534772",
  appId: "1:711148534772:web:729b34f5b42988661797a1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
