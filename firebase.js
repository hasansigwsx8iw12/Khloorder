// ==========================================
// KHLLO NET
// firebase.js
// ==========================================

// Firebase App
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


// Realtime Database
import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// Firestore
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Authentication
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// Storage
import {
    getStorage
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


// ==========================================
// Firebase Config
// ==========================================

const firebaseConfig = {

    apiKey:
        "AIzaSyBJ2hF5xw9QF7KEmNi6Vseu_t_TEzoZz8M",

    authDomain:
        "khlonetorder.firebaseapp.com",

    projectId:
        "khlonetorder",

    storageBucket:
        "khlonetorder.firebasestorage.app",

    messagingSenderId:
        "334428875974",

    appId:
        "1:334428875974:web:b6acfc7782c541b6e3bbc7",

    measurementId:
        "G-PXYS88ZM5T"

};


// ==========================================
// Initialize Firebase
// ==========================================

const app =
    initializeApp(firebaseConfig);


// ==========================================
// Realtime Database
// ==========================================

const db =
    getDatabase(
        app,
        "https://khlonetorder-default-rtdb.firebaseio.com"
    );


// ==========================================
// Firestore
// ==========================================

const firestore =
    getFirestore(app);


// ==========================================
// Authentication
// ==========================================

const auth =
    getAuth(app);


// ==========================================
// Storage
// ==========================================

const storage =
    getStorage(app);


// ==========================================
// Export
// ==========================================

export {

    db,

    firestore,

    auth,

    storage

};
