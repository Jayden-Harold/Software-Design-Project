import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAuth, GoogleAuthProvider, signInWithCredential } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
  import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

let isSignUp = false;
  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyDSqHKGzYj8bUzKGoFHH93x3Wlq4G463yY",
    authDomain: "greensmoke-ee894.firebaseapp.com",
    projectId: "greensmoke-ee894",
    storageBucket: "greensmoke-ee894.firebasestorage.app",
    messagingSenderId: "140065144019",
    appId: "1:140065144019:web:48e4963e4826a85aca2826"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

window.handleCredentialResponse = async (response) => {
  try {
    const credential = GoogleAuthProvider.credential(response.credential);
    const result = await signInWithCredential(auth, credential);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let role;

    if (!userSnap.exists()) {
      // New user
      if (isSignUp) {
        const selectedRole = document.getElementById("roleSelect").value;
        role = selectedRole;

        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          role: role,
          createdAt: new Date()
        });

        console.log("Signed up new user with role:", role);
      } else {
        console.error("User does not exist in Firestore and no role was selected");
        alert("User not found. Please sign up first.");
        return;
      }
    } else {
      // Existing user
      role = userSnap.data().role;
      console.log("Signed in existing user with role:", role);
    }

    // Redirect
    if (role === "admin") {
      window.location.href = "../admin.html";
    } else {
      window.location.href = "../user.html";
    }

  } catch (error) {
    console.error("Sign-in error:", error.code, error.message);
  })
  google.accounts.id.prompt(); // Optional: shows One Tap
};


const modal_signin = document.querySelector(".modal-signin");
const modal_signup = document.querySelector(".modal-signup");

const loginbtn = document.querySelector("#login-btn");
const registerbtn = document.querySelector("#register-btn");
const registerbtn2 = document.querySelector("#btn-1");

const link2signin = document.querySelector("#link2signin");
const link2signup = document.querySelector("#link2signup");

const close_signin = document.querySelector(".close-signin");
const close_signup = document.querySelector(".close-signup");

// Modal triggers
loginbtn.addEventListener("click", (e) => {
    e.preventDefault();
    isSignUp = false;
    modal_signin.showModal();
});
registerbtn.addEventListener("click", (e) => {
    e.preventDefault();
    isSignUp = true;
    modal_signup.showModal();
});
registerbtn2.addEventListener("click", (e) => {
    e.preventDefault();
    isSignUp = true;
    modal_signup.showModal();
});
link2signup.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signin.close();
    modal_signup.showModal();
});
link2signin.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signup.close();
    modal_signin.showModal();
});
close_signin.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signin.close();
});
close_signup.addEventListener("click", (e) => {
    e.preventDefault();
    modal_signup.close();
});

/*window.onload = function () {
    google.accounts.id.initialize({
        client_id: "665358967021-jplj68b577hu07gir38bld3u849hood6.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("googlesignup"),
        { theme: "outline", size: "large", text: "signup_with", shape: "pill", width: 250 }
    );
    google.accounts.id.renderButton(
        document.getElementById("googlesignin"),
        { theme: "outline", size: "large", text: "signin_with", shape: "pill", width: 250 }
    );
};*/

/*function handleCredentialResponse(response) {
    const token = response.credential;

    fetch("https://green-smoke-0f073e403.6.azurestaticapps.net/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Server response:", data);
            if (data.success) {
                localStorage.setItem("jwtToken", data.token);
                    window.location.href = "user.html";
            } else {
                alert("Authentication failed.");
            }
        })
        .catch(err => {
            console.error("Auth error:", err);
            alert("Something went wrong during sign-in.");
        });
}*/

