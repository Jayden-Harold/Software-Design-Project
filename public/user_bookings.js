import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, collection, query, where, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

    const menu = document.querySelector("#mobile-menu");
    const menuLinks = document.querySelector(".nav-menu");
    
    // Toggle Mobile Menu
    menu.addEventListener("click", () => {
        menu.classList.toggle("is-active");
        menuLinks.classList.toggle("active");
    });

const userTableBody = document.querySelector("#bookTable").getElementsByTagName("tbody")[0];

//function to fetch and display a user's pending bookings
async function DisplayPending(user) {
    try {
        const bookRef = collection(db, "bookings");
        const userID = user.uid;

        // Firestore compound query
        const q = query(bookRef, where("userID", "==", userID));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnap) => {
            const bookData = docSnap.data();
            const facility = bookData.fname;
            const date = bookData.date;
            const timeslot = bookData.timeslot;
            const status = bookData.status;

            const row = document.createElement("tr");

            const fCell = document.createElement("td");
            fCell.textContent = facility;

            const dateCell = document.createElement("td");
            dateCell.textContent = date;

            const timeCell = document.createElement("td");
            timeCell.textContent = timeslot;

            const statusCell = document.createElement("td");
            statusCell.textContent = status;

            const actionCell = document.createElement("td");

            const denyBtn = document.createElement("button");
            denyBtn.textContent = "CANCEL";
            denyBtn.className = "btn-deny";
            denyBtn.addEventListener("click", () => denyRequest(docSnap.id, row));

            actionCell.appendChild(denyBtn);

            row.appendChild(fCell);
            row.appendChild(dateCell);
            row.appendChild(timeCell);
            row.appendChild(statusCell);
            row.appendChild(actionCell);

            userTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching pending bookings:", error);
    }
}

//function to cancel a user's booking 
async function denyRequest(docId, rowElement) {
    const confirmation = confirm("Are you sure you want to cancel this booking? This action cannot be undone.");
    if (!confirmation) return;
  
    try {
      const bookDocRef = doc(db, "bookings", docId);
      await deleteDoc(bookDocRef);
      alert("Booking cancelled successfully.");
      rowElement.remove();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("An error occurred while cancelling the booking.");
    }
  }

/* check if user is logged in before displaying pending bookings,
if not, alert user they're not signed in and redirects to the homepage*/  
onAuthStateChanged(auth, (user) => {
    if (user) {
        DisplayPending(user); // now runs for ALL matching users
    } else {
        alert("User not signed in. Redirecting...");
        window.location.href = "index.html";
    }
});