import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // You can access user.uid, user.email, etc.
    console.log("User signed in:", user.email);
  } else {
    // Redirect to login or show a warning
    window.location.href = "login.html";
  }
});

document.getElementById("event-btn").addEventListener("click", (e) => {
    e.preventDefault;
    document.querySelector(".modal-event").showModal();
})

const close_btn = document.querySelector(".close-btn");

close_btn.addEventListener("click", (e) => {
    e.preventDefault;
    document.querySelector(".modal-event").close();
})


//locations dropdown - popular with all facilities
const locationSelect = document.getElementById("facility");

document.addEventListener("DOMContentLoaded", async function () {
  locationSelect.innerHTML = '<option value="" disabled selected>Loading...</option>';

  try {
    const facilitiesRef = collection(db, "facilities");
    const q = query(facilitiesRef);
    const querySnapshot = await getDocs(q);

    locationSelect.innerHTML = '<option value="" disabled selected>Location…</option>';

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


document.querySelector("#event-btn").addEventListener("click", async function () {


  const eventName = document.getElementById("eventName" ).value;
  const eventDate = document.getElementById("eventDate").value;
  const location = document.getElementById("facility").value;
  const eventStartTime = document.getElementById("start").value;
  const eventEndTime = document.getElementById("end").value;
  const Description = document.getElementById("desc").value;
  const Image = document.getElementById("image").file[0];

 try {
// 1. Check if the facility is under maintenance
const maintenanceRef = collection(db, "Maintenance");
const maintenanceQuery = query(
  maintenanceRef,
  where("facility", "==", selectedFac),
  where("Status", "!=", "completed") // Or use "Reported"/"Assigned" depending on your flow
);
const maintenanceSnapshot = await getDocs(maintenanceQuery);

if (!maintenanceSnapshot.empty) {
  alert("This facility is currently under maintenance. Please choose another one.");
  return;
}
// 2. Check if there's an event already at that time and facility
const eventsRef = collection(db, "Events");
const eventsQuery = query(
  eventsRef,
  where("location", "==", selectedFac),
  where("eventDate", "==", eventDate)
);
const eventsSnapshot = await getDocs(eventsQuery);

if (!conflictSnapshot.empty) {
  alert("This facility is already booked for an event on that date.");
  return;
}

// 3. Upload image to Firebase Storage
const imageStorageRef = storageRef(storage, `eventImages/${Date.now()}_${imageFile.name}`);
await uploadBytes(imageStorageRef, imageFile);
const imageURL = await getDownloadURL(imageStorageRef);

//4. Upload data to db
    await addDoc(collection(db , "Events"),{
      eventName: eventName,
      location: location,
      eventDate: eventDate,
      eventStartTime: eventStartTime,
      eventEndTime: eventEndTime,	
      description: Description,   
      image: Image,
    });
 
    alert("Event created successfully.");
    
} catch (error) {
  console.error("Error creating event:", error);
  alert("Failed to create event. Try again.");
}

});


