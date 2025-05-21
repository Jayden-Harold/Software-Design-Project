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

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const user = auth.currentUser;

    document.getElementById("create-event").addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(".modal-event").showModal();
      });
      
      const close_btn = document.querySelector(".close-btn");
      close_btn.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(".modal-event").close();
      });
      
      // Populate location dropdown with all facilities
      const locationSelect = document.getElementById("facility");
      
      document.addEventListener("DOMContentLoaded", async function () {
        locationSelect.innerHTML = '<option value="" disabled selected>Loading...</option>';

        const today = new Date().toISOString().split('T')[0];
        document.getElementById("eventDate").setAttribute("min", today)
      
        try {
          const facilitiesRef = collection(db, "facilities");
          const querySnapshot = await getDocs(facilitiesRef);
      
          locationSelect.innerHTML = '<option value="" disabled selected>Location…</option>';
      
          if (querySnapshot.empty) {
            locationSelect.innerHTML = '<option value="">No facilities found</option>';
          } else {
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              const option = document.createElement("option");
              option.value = data.fname;
              option.textContent = data.fname;
              locationSelect.appendChild(option);
            });
          }
        } catch (error) {
          console.error("Error loading facilities:", error);
          locationSelect.innerHTML = '<option value="">Error loading facilities</option>';
        }
      });
      
      // Event creation logic
document.querySelector("#event-btn").addEventListener("click", async function () {
    const eventSport = document.getElementById("sport").value;
    const eventName = document.getElementById("eventName").value;
    const eventDate = document.getElementById("eventDate").value;
    const location = document.getElementById("facility").value;
    const startTime = document.getElementById("start").value;
    const endTime = document.getElementById("end").value;
    const eventDescription = document.getElementById("desc").value;

    
    const result = await checkAndCreateEvent(eventSport, eventName, location, eventDate, startTime, endTime, eventDescription);

    if (result.success) {
        alert(result.message);
        document.querySelector(".modal-event").close(); // close modal on success
      } else {
        alert(result.message);
      }

});
//creates events based on necessary checks
async function checkAndCreateEvent(eventSport, eventName, facilityName, eventDate, startTime, endTime, eventDescription) {
    const eventsRef = collection(db, 'events');
    const facRef = collection(db, 'facilities');
  
    // Check if an event already exists at that time and location
    const eventQuery = query(
      eventsRef,
      where("facilityName", "==", facilityName),
      where("eventDate", "==", eventDate),
      where("startTime", "==", startTime)
    );
    const eventSnap = await getDocs(eventQuery);
    const eventConflict = !eventSnap.empty;
  
    const facQuery = query(facRef, where("fname", "==", facilityName), where("status", "==", "Under Maintenance"));
    const facMaintenance = await getDocs(facQuery);
    const facConflict = !facMaintenance.empty;
  
    // Check if facility is under maintenance
    if (facConflict) {
      return { success: false, message: "Facility is under maintenance." };
    }
  
    // Check for event conflict
    if (eventConflict) {
      return { success: false, message: "An event already exists at this time and location." };
    }
  
    // Add the new event
    const newEventRef = await addDoc(eventsRef, {
      eventSport,
      eventName,
      facilityName,
      eventDate,
      startTime,
      endTime,
      eventDescription,
    });
            
    //create notification
      const notificationsRef = collection(db, "notifications");
          await addDoc(notificationsRef, {
              userID: "all", 
              category: "Events",
              date: new Date().toISOString().split('T')[0], // current date
              description: `Please note ${facilityName} will be unavaliable on the ${eventDate} due to the ${eventName} event.`,
              createdAt: new Date(),// timestamp for sorting
              seenBy:[]
          });
  
    return { success: true, message: "Event successfully created.", eventID: newEventRef.id };
  }
  
const container = document.querySelector(".container");
//displays events
async function displayEvents() {
    try {
      const eventRef = collection(db, "events"); // or your actual Firestore collection
      const q = query(eventRef);
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach((docSnap) => {
        const eventData = docSnap.data();
        const eventName = eventData.eventName;
        const eventEndTime = eventData.endTime;
        const eventStartTime = eventData.startTime;
        const date = eventData.eventDate;
        const facility = eventData.facilityName;
        const sport = eventData.eventSport;

        const lowSport = sport.toLowerCase();

       const image = `"images/${lowSport}-img.png"` 
  
        const article = document.createElement("article");
        article.className = "event-card";
  
        article.innerHTML = `
          <img src=${image} alt="${eventName} poster" />
          <section class="details">
            <h3>${eventName}</h3>
            <p>${facility}</p>
            <p>${date}</p>
            <p>${eventStartTime}-${eventEndTime}</p>
            <span class="category">${sport}</span>
          </section>
        `;
  
        container.appendChild(article);
      });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

onAuthStateChanged(auth, (user) => {
    if (user) {
        displayEvents(); // now runs for ALL matching users
    } else {
        alert("User not signed in. Redirecting...");
        window.location.href = "index.html";
    }
});
  


