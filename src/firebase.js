import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChRGvBrRh-pacAeGLPdvekEwz3_iBdqZk",
  authDomain: "fir-331f3.firebaseapp.com",
  projectId: "fir-331f3",
  storageBucket: "fir-331f3.appspot.com",
  messagingSenderId: "1048091696117",
  appId: "1:1048091696117:web:e3379e85ae00d593851ebc",
  measurementId: "G-Z1VCZPWYCP",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
//console.log(auth);
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
