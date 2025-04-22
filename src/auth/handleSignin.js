
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../test_utils/firebase.js";

export const handleSigninResponse = async (response) => {
  try {
    const credential = GoogleAuthProvider.credential(response.credential);
    const result = await signInWithCredential(auth, credential);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log("Signed in as:", userData.name, userData.role);

      if (userData.role === "Admin") {
        window.location.href = "../admin.html";
      } else if (userData.role === "Staff") {
        window.location.href = "../staff.html";
      } else if (userData.role === "Resident") {
        window.location.href = "../user.html";
      }
    } else {
      alert("No account found. Please sign up first.");
    }
  } catch (error) {
    console.error("Sign-in error:", error.code, error.message);
  }
};
