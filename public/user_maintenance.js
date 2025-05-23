import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
   import { collection, query, where, getDocs, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

   // firebase configurator
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

    const facilitySelect = document.getElementById("facility_1"); //facilities drop down menu

    //event listener to fetch all facilities available for the sport the user has selected
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

    /*event listener that handles submission of a new maintenance 
    issue when the submit button is clicked*/
    document.querySelector("#submit-btn").addEventListener("click", async function () {
    
      const user = auth.currentUser; // NOW it's likely to be set if the user is logged in
    
      if (!user) {
        alert("Please sign in.");
        return;
      }
    
      const selectedFac = document.getElementById("facility_1").value;
      const selectedCat = document.getElementById("category").value;
      const GivenDesc = document.getElementById("description").value;
    
      //adding the facility with the maintenance issue to the maintenance table
      try{
        await addDoc(collection(db , "Maintenance"),{
          facility: selectedFac,
          category:selectedCat,
          description: GivenDesc,
          assignedTo: "TBD",
          Status: "Reported",
          ReportedDate: new Date(),
          ResolvedDate: "N/A",
          resolutionTime:"N/A",
        });
    
          // Then add a notification
        const notificationsRef = collection(db, "notifications");
            await addDoc(notificationsRef, {
                userID: "all", 
                category: "Maintenance",
                date: new Date().toISOString().split('T')[0], // current date
                description: `Please note ${selectedFac} is currently under maintenance.`,
                createdAt: new Date(), // timestamp for sorting
                seenBy:[]
          });
      const facilitiesRef = collection(db, "facilities");
      const q = query(facilitiesRef, where("fname", "==", selectedFac));
      const querySnapshot = await getDocs(q);

      /*changing the status of the facility to "under Maintenance" in
       the facilities table so users cannot book it*/
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (facilityDoc) => {
          await updateDoc(facilityDoc.ref, {
            status: "Under Maintenance"
          });
        });
      } else {
        console.error("No facility found with the given Facility name:", selectedFac);
      }

        alert("Issue reported succesfully.");
        
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Try again.");
    }

    });


  

    
    
