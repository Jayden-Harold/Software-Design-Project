
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../test_utils/firebase.js";

export const handleSignupResponse = async (response) => {
  try {
    const credential = GoogleAuthProvider.credential(response.credential);
    const result = await signInWithCredential(auth, credential);
    const user = result.user;

    const selectedRole = document.getElementById("signup").value;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        role: selectedRole,
        createdAt: new Date(),
        status: "pending",
      });
      console.log("New user signed up with role:", selectedRole);
      if (selectedRole === "Staff"){
        window.location.href = "../staff.html";
      }
     else if ( selectedRole === "Resident"){
        window.location.href = "../user.html";
     }
    } else {
      alert("User already exists. Try signing in.");
    }
  } catch (error) {
    console.error("Sign-up error:", error.code, error.message);
  }
};