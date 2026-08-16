import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZUpPGGWTB43QGNQmXXG-jHBZY_IUkiLc",
  authDomain: "orderson-e160d.firebaseapp.com",
  databaseURL: "https://orderson-e160d-default-rtdb.firebaseio.com",
  projectId: "orderson-e160d",
  storageBucket: "orderson-e160d.firebasestorage.app",
  messagingSenderId: "146422434838",
  appId: "1:146422434838:web:03582ebd8312a652c5f937",
  measurementId: "G-QLWMCEY8S3"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
