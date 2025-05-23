import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
   import { collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
//firebase configurator
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

    document.addEventListener("DOMContentLoaded", async function () {
      const today = new Date().toISOString().split('T')[0];
      document.getElementById("booking-date").setAttribute("min", today)
    });

//book button
document.getElementById("book-btn").addEventListener("click", async function () {
    const user = auth.currentUser;

  if (!user) {
    alert("Please sign in to make a booking.");
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    alert("User profile not found. Please register first.");
    return;
  }

  const userData = userSnap.data();
  if (userData.status === "pending") {
    alert("Your account is pending approval. You cannot make a booking at this time.");
    return; // Prevent booking if pending
  }
  const selectedFac = document.getElementById("facility").value;
  const selectedTime = document.getElementById("timeslot").value;
  const selectedDate = document.getElementById("booking-date").value;

  const facility = document.getElementById("selected-fac");
  const date = document.getElementById("selected-date");
  const time = document.getElementById("selected-time");
  const admit = document.getElementById("admit");

  const capacity = await getCapacityBySport(selectedFac); // WAIT for async result

  facility.textContent = selectedFac;
  date.textContent = selectedDate;
  time.textContent = selectedTime;
  admit.textContent = capacity ? capacity.toString() : "N/A";

  // Optionally open the dialog
  document.querySelector(".modal-booking").showModal();
});

const close_booking = document.querySelector(".close-booking");

close_booking.addEventListener("click", (e) => {
    document.querySelector(".modalbooking").close();
})

const select = document.getElementById("timeslot");
//time constraint
for (let hour = 8; hour < 20; hour++) {
  const start = `${hour.toString().padStart(2, '0')}:00`;
  const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
  const option = document.createElement("option");
  option.value = `${start}-${end}`;
  option.textContent = `${start}–${end}`;
  select.appendChild(option);
}

async function getCapacityBySport(fname) {
  const sportsRef = collection(db, "facilities"); // Replace "sports" with your collection name
  const q = query(sportsRef, where("fname", "==", fname)); // Query where "sport" field matches

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const capacity = querySnapshot.docs[0].data().capacity; // Get capacity from the first match
      console.log(`Capacity for ${fname}:`, capacity);
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
//creates booking and checks for any bookings already made
async function checkAndCreateBooking(user, fname, timeslot, date) {
  const bookingsRef = collection(db, 'bookings');
  const facRef = collection(db, 'facilities');
  const userID = user.uid;
  const userName = user.displayName || "Unknown User";

  // First, check user profile
  const userProfileRef = doc(db, "users", userID);
  const userSnap = await getDoc(userProfileRef); // <== this fetches a single user document

  if (!userSnap.exists()) {
    return { success: false, message: "User profile not found. Please register first." };
  }

  const userData = userSnap.data();

  if (userData.status === "pending") {
    return { success: false, message: "Your account is pending approval. You cannot make a booking at this time." };
  }

  // Check if user already has a booking at that timeslot on that date
  const userQuery = query(
    bookingsRef,
    where("userID", "==", userID),
    where("timeslot", "==", timeslot),
    where("date", "==", date)
  );
  const userSnapBooking = await getDocs(userQuery);
  const userConflict = !userSnapBooking.empty;

  const facQuery = query( facRef, where("fname", "==", fname), where("status", "==", "Under Maintenance"));
  const facMaintenance = await getDocs(facQuery);
  const facConflict = !facMaintenance.empty;

  // Check if facility is already booked
  const facilityQuery = query(
    bookingsRef,
    where("fname", "==", fname),
    where("timeslot", "==", timeslot),
    where("date", "==", date)
  );
  const facilitySnap = await getDocs(facilityQuery);
  const facilityConflict = !facilitySnap.empty;

  if (userConflict) {
    return { success: false, message: "User already has a booking at this timeslot." };
  }

  if (facilityConflict) {
    return { success: false, message: "Facility is already booked at this timeslot." };
  }

  if (facConflict) {
    return {success: false, message: "Facility is under maintenance."};
  }

  // Add the new booking
  const newBookingRef = await addDoc(bookingsRef, {
    userID,
    userName,
    fname,
    timeslot,
    date,
    status: "pending",
    createdAt: new Date().toISOString()
  });

  return { success: true, message: "Booking successfully created.", bookingID: newBookingRef.id };
}


document.querySelector("#confirm-btn").addEventListener("click", async function () {
  if (!checkbox.checked) {
    alert("Please agree to the terms and conditions before booking.");
    return;
  }

  const user = auth.currentUser; // NOW it's likely to be set if the user is logged in

  if (!user) {
    alert("Please sign in before booking.");
    return;
  }

  const selectedFac = document.getElementById("facility").value;
  const selectedTime = document.getElementById("timeslot").value;
  const selectedDate = document.getElementById("booking-date").value;

  const result = await checkAndCreateBooking(user, selectedFac, selectedTime, selectedDate);

  if (result.success) {
    alert(result.message);
    document.querySelector(".modal-booking").close(); // close modal on success
  } else {
    alert(result.message);
  }
});
 
const sportSelect = document.getElementById("sport");
const facilitySelect = document.getElementById("facility");

sportSelect.addEventListener("change", async function () {
  const selectedSport = sportSelect.value;
  facilitySelect.innerHTML = '<option value="" disabled selected>Loading...</option>';

  try {
    const facilitiesRef = collection(db, "facilities");
    const q = query(facilitiesRef, where("sport", "==", selectedSport));
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



