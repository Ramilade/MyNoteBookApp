// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAUzoOR0K41syv9CERE6UsYWx7Y2IW8T0",
  authDomain: "myproject-5e7a3.firebaseapp.com",
  projectId: "myproject-5e7a3",
  storageBucket: "myproject-5e7a3.appspot.com",
  messagingSenderId: "1039571082402",
  appId: "1:1039571082402:web:df666b9ae8088654f14bfb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
export { app, database }