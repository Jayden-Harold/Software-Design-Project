import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

   async function updateUserProfile(user) {
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const status = userData.status;

            // Update name in UI
            document.getElementById("username").textContent = "Hi, " + user.displayName || "Hi, " + userData.name;

            // Only show status if it's "Pending Approval"
            if (status === "pending") {
                document.getElementById("userStatus").textContent = status;
            } else {
                document.getElementById("userStatus").textContent = ""; // clear or hide
            }

            return status || null;
        } else {
            console.log("No user data found in Firestore");
            return null;
        }
    } catch (error) {
        console.error("Error updating user profile:", error);
        return null;
    }
}

updateUserProfile();
