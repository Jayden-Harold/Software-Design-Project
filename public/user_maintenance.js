import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
   import { collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

   const firebaseConfig = {
    apiKey: "AIzaSyDSqHKGzYj8bUzKGoFHH93x3Wlq4G463yY",
    authDomain: "greensmoke-ee894.firebaseapp.com",
    projectId: "greensmoke-ee894",
    storageBucket: "greensmoke-ee894.firebasestorage.app",
    messagingSenderId: "140065144019",
    appId: "1:140065144019:web:48e4963e4826a85aca2826"
  };

  const menu = document.querySelector("#mobile-menu");
  const menuLinks = document.querySelector(".nav-menu");
  
  // Toggle Mobile Menu
  menu.addEventListener("click", () => {
      menu.classList.toggle("is-active");
      menuLinks.classList.toggle("active");
  });
  
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const user = auth.currentUser;

    const facilitySelect = document.getElementById("facility_1");

    document.addEventListener("DOMContentLoaded", async function () {
      facilitySelect.innerHTML = '<option value="" disabled selected>Loading...</option>';
    
      try {
        const facilitiesRef = collection(db, "facilities");
        const q = query(facilitiesRef);
        const querySnapshot = await getDocs(q);
    
        facilitySelect.innerHTML = '<option value="" disabled selected>Facility...</option>';
    
        if (querySnapshot.empty) {
          facilitySelect.innerHTML = '<option value="">No facilities found for this sport</option>';
        } else {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const option = document.createElement("option");
            option.value = data.fname;
            option.textContent = data.fname;
            facilitySelect.appendChild(option);
          });
        }
      } catch (error) {
        console.error("Error loading facilities:", error);
        facilitySelect.innerHTML = '<option value="">Error loading facilities</option>';
      }
    });
    
    