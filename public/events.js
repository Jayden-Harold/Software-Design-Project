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
      

  
const container = document.querySelector(".container");

// function to fetch events from firestore and display the events
async function displayEvents() {
    try {
      const eventRef = collection(db, "events"); 
      const q = query(eventRef);
      const querySnapshot = await getDocs(q);
  
      
      // query to fetch all the relevant details for each event from the DB
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
          <img src=${image} alt="${eventName}} poster" />
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

/* check if user is logged in before displaying events,
if not, alert user they're not signed in and redirects to the homepage*/
onAuthStateChanged(auth, (user) => {
    if (user) {
        displayEvents(); // now runs for ALL matching users
    } else {
        alert("User not signed in. Redirecting...");
        window.location.href = "index.html";
    }
});