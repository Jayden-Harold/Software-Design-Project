export const initializeApp = jest.fn();
export const getAuth = jest.fn(() => ({
  setPersistence: jest.fn(),
  signOut: jest.fn(),
}));
export const getStorage = jest.fn(() => ({}));
export const getFirestore = jest.fn(() => ({})); // Ensure this function is properly mocked
export const doc = jest.fn();
export const getDoc = jest.fn();
export const getDocs = jest.fn();
export const collection = jest.fn();
export const query = jest.fn();
export const where = jest.fn();
export const updateDoc = jest.fn();
export const setDoc = jest.fn();
export const addDoc = jest.fn();
export const serverTimestamp = jest.fn().mockReturnValue('mock-timestamp');

// this file is used for testing because jest cannot 
/*import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

//The web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDSqHKGzYj8bUzKGoFHH93x3Wlq4G463yY",
    authDomain: "greensmoke-ee894.firebaseapp.com",
    projectId: "greensmoke-ee894",
    storageBucket: "greensmoke-ee894.firebasestorage.app",
    messagingSenderId: "140065144019",
    appId: "1:140065144019:web:48e4963e4826a85aca2826"
  };

//initializing firestore:
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db ,auth}; */
