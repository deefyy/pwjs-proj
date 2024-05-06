import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyB_6ZA8zj3b5vexDoA_fnjGmHwXvFzptIg",
    authDomain: "fire-test-27e08.firebaseapp.com",
    projectId: "fire-test-27e08",
    storageBucket: "fire-test-27e08.appspot.com",
    messagingSenderId: "12448095073",
    appId: "1:12448095073:web:f59564b88a2c010424c320"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)

export const db = getFirestore(app);