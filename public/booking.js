import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

document.getElementById("book-btn").addEventListener("click", function () {
  const selectedFac = document.getElementById("facility").value;
  const selectedTime = document.getElementById("timeslot").value;
  const selectedDate = document.getElementById("booking-date").value;

  const facility = document.getElementById("selected-fac");
  const date = document.getElementById("selected-date");
  const time = document.getElementById("selected-time");

  facility.textContent = selectedFac;
  date.textContent = selectedDate;
  time.textContent = selectedTime;

  // Optionally open the dialog
  document.querySelector(".modal-booking").showModal();
});

const close_booking = document.querySelector(".close-booking");

close_booking.addEventListener("click", (e) => {
    modal_booking.close();
})

const select = document.getElementById("timeslot");

for (let hour = 8; hour < 20; hour++) {
  const start = `${hour.toString().padStart(2, '0')}:00`;
  const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
  const option = document.createElement("option");
  option.value = `${start}-${end}`;
  option.textContent = `${start}–${end}`;
  select.appendChild(option);
}

async function getCapacityBySport(sport) {
  const sportsRef = collection(db, "facilities"); // Replace "sports" with your collection name
  const q = query(sportsRef, where("fname", "==", fname)); // Query where "sport" field matches

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const capacity = querySnapshot.docs[0].data().capacity; // Get capacity from the first match
      console.log(`Capacity for ${sport}:`, capacity);
      return capacity;
    } else {
      console.log("No matching sport found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching capacity:", error);
    return null;
  }
}

const checkbox = document.getElementById("confirm");

document.querySelector("#confirm-btn").addEventListener("click", function (){
  if (!checkbox.checked) {
    alert("Please agree to the terms and conditions before booking.");
    return; // stop the rest of the booking logic
  }
})
 
