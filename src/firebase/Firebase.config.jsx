// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,doc,getDoc} from "firebase/firestore"
import { getAuth} from "firebase/auth"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAno7AgwqKQZ4jPohG3Bw2YzD0e9-fh5E4",
  authDomain: "reactapp-d823c.firebaseapp.com",
  projectId: "reactapp-d823c",
  storageBucket: "reactapp-d823c.appspot.com",
  messagingSenderId: "481696009002",
  appId: "1:481696009002:web:a8e29d18fd1571a5e42c53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app)
const auth = getAuth(app)


export {fireDB,auth}