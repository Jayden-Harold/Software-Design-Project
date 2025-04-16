import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

async function updateUserProfile(user) {
    try {
        // Get user document from Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            
            // Update the profile section with all user data
            document.getElementById("username").textContent = user.displayName || userData.name;
            document.getElementById("userDP").src = user.photoURL || "./images/default-profile.png";
            document.getElementById("userRole").textContent = userData.role || "No role assigned";
            document.getElementById("userStatus").textContent = userData.status || "Unknown status";
        } else {
            console.log("No additional user data found in Firestore");
        }
    } catch (error) {
        console.error("Error updating user profile:", error);
    }
}
updateUserProfile();
