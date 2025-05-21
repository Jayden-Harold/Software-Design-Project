import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

   // firebase configurator
   const firebaseConfig = {
    apiKey: "AIzaSyDSqHKGzYj8bUzKGoFHH93x3Wlq4G463yY",
    authDomain: "greensmoke-ee894.firebaseapp.com",
    projectId: "greensmoke-ee894",
    storageBucket: "greensmoke-ee894.firebasestorage.app",
    messagingSenderId: "140065144019",
    appId: "1:140065144019:web:48e4963e4826a85aca2826"
  };
  
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const user = auth.currentUser;

  /* checks user status(pending/approved) and
   displays relevant message on user profile when user logins*/
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
                document.getElementById("userStatus").textContent = "Account Pending Approval";
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

/* Checks if the user is signed in and if not, alerts the user to 
 create an account and redirects to the homepage*/

onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUserProfile(user);
        const uid = user.uid;
        return uid;
    }
    else {
        alert("Create an Account");
        window.location.href = "index.html";
    }
});

