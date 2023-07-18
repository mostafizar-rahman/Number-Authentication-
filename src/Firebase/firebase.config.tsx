import { initializeApp } from "firebase/app";
const firebaseConfig: any  = {
  apiKey: import.meta.env.VITE_TEST_APIKEY,
  authDomain: import.meta.env.VITE_TEST_AUTHDOMAIN ,
  projectId: import.meta.env.VITE_TEST_PROJECTID,
  storageBucket: import.meta.env.VITE_TEST_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_TEST_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_TEST_APPID,
  measurementId: import.meta.env.VITE_TEST_MEASUREMENTID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const localAuth = getAuth(app);
