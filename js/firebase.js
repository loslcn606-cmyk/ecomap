// CONFIG FIREBASE

const firebaseConfig = {

  apiKey: "AIzaSyBniFvITldPtLAaGD47xXPsqOoUS2onx3s",

  authDomain: "ecomap-b8482.firebaseapp.com",

  projectId: "ecomap-b8482",

  storageBucket: "ecomap-b8482.firebasestorage.app",

  messagingSenderId: "86229033828",

  appId: "1:86229033828:web:17ef2e4564a2279c3cd071"
};


// INICIALIZAR FIREBASE

firebase.initializeApp(firebaseConfig);


// FIRESTORE

const db = firebase.firestore();