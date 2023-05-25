import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore'


const firebaseConfig = {
    apiKey: process.env.REACT_APP_F_KEY,
    authDomain: "ytclone-387616.firebaseapp.com",
    projectId: "ytclone-387616",
    storageBucket: "ytclone-387616.appspot.com",
    messagingSenderId: "792873547540",
    appId: "1:792873547540:web:e7414a3a5761fc72cd3401"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)