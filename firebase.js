// Firebase Imports

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import { initializeFirestore } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import { getAuth } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



// Firebase Config

const firebaseConfig = {

  apiKey: "AIzaSyBJ2hF5xw9QF7KEmNi6Vseu_t_TEzoZz8M",

  authDomain: "khlonetorder.firebaseapp.com",

  projectId: "khlonetorder",

  storageBucket: "khlonetorder.firebasestorage.app",

  messagingSenderId: "334428875974",

  appId: "1:334428875974:web:b6acfc7782c541b6e3bbc7",

  measurementId: "G-PXYS88ZM5T"

};



// Initialize Firebase

const app = initializeApp(firebaseConfig);



// Firestore

const db = initializeFirestore(app, {

    experimentalForceLongPolling: true

});



// Authentication

const auth = getAuth(app);



// Export

export {

    db,

    auth

};
