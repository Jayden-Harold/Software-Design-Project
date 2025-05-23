import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
   import { collection, query, where, getDocs, addDoc, orderBy, limit, } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
 
   // Firebase config
   const firebaseConfig = {
     apiKey: "AIzaSyDSqHKGzYj8bUzKGoFHH93x3Wlq4G463yY",
     authDomain: "greensmoke-ee894.firebaseapp.com",
     projectId: "greensmoke-ee894",
     storageBucket: "greensmoke-ee894.firebasestorage.app",
     messagingSenderId: "140065144019",
     appId: "1:140065144019:web:48e4963e4826a85aca2826"
   };

   let isRegistering = true;
   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const auth = getAuth(app);
   const db = getFirestore(app);
 
window.handleCredentialResponse = async (response) => {
   if (isRegistering){
      handleSignupResponse(response);
   }
   else{
      handleSigninResponse(response);
   }
};

window.handleSignupResponse = async (response) => {
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

window.handleSigninResponse = async (response) => {
  try {
    const credential = GoogleAuthProvider.credential(response.credential);
    const result = await signInWithCredential(auth, credential);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log("Signed in as:", userData.name, userData.role);
    
      // Redirect based on role
      if (userData.role === "Admin"){
         window.location.href="../admin.html";
      } else if (userData.role === "Staff"){
        window.location.href = "../staff.html";
      }
     else if (userData.role === "Resident"){
        window.location.href = "../user.html";
    }} else {
      alert("No account found. Please sign up first.");
    }
  } catch (error) {
    console.error("Sign-in error:", error.code, error.message);
  }
};
 
   // Initialize Google Sign-In
   window.onload = () => {
     google.accounts.id.initialize({
       client_id: "665358967021-jplj68b577hu07gir38bld3u849hood6.apps.googleusercontent.com",
       callback: handleCredentialResponse,
     });
 
     google.accounts.id.renderButton(
       document.getElementById("googlesignup"),
       { 
         theme: "filled_blue",
         size: "large",
         shape: "pill",
       }
     );
 
     google.accounts.id.renderButton(
       document.getElementById("googlesignin"),
       { 
         theme: "filled_blue",
         size: "large",
         shape: "pill",
       }
     );
 
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

 const facilities_btn = document.querySelector("#btn-3")
 const events_btn = document.querySelector('#btn-2');
 
 // Modal triggers
 loginbtn.addEventListener("click", (e) => {
     isRegistering = false;
     e.preventDefault();
     modal_signin.showModal();
 });
 registerbtn.addEventListener("click", (e) => {
     e.preventDefault();
     modal_signup.showModal();
 });
 registerbtn2.addEventListener("click", (e) => {
     e.preventDefault();
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
 facilities_btn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href="facilities.html";
 });
events_btn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href="events.html"
});

async function displayMostRecentEvent() {
  try {
    // Construct the query
    const eventsQuery = query(
      collection(db, 'events'),
      orderBy('eventDate', 'desc'),
      limit(1)
    );

    // Execute the query
    const querySnapshot = await getDocs(eventsQuery);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const eventData = doc.data();
      
    const eventDate = new Date(eventData.eventDate);
    const formattedDate = eventDate.toLocaleDateString('en-GB'); // DD/MM/YYYY

      
      document.getElementById('eventDate').textContent = formattedDate;
      document.getElementById('eventDescription').textContent = eventData.eventDescription || 'No description';
      document.getElementById('facilityName').textContent = eventData.facilityName || 'Location not specified';
      
      const startTime = eventData.startTime || '14:15';
      document.getElementById('startTime').textContent = startTime;
    } else {
      document.getElementById('eventDescription').textContent = 'No upcoming events';
    }
  } catch (error) {
    console.error("Error fetching events: ", error);
    document.getElementById('eventDescription').textContent = 'Error loading events';
  }
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', displayMostRecentEvent);
 
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
