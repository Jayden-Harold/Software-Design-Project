import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, collection, query, where, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

async function DisplayPending(user) {
    try {
        const bookRef = collection(db, "bookings");
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef); // reads the document at /users/user.uid
        const userData = userSnap.data();
        const userID = user.uid;

        // Firestore compound query
        const q = query(bookRef, where("userID", "==", userID));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnap) => {
            const bookData = docSnap.data();
            const facility = bookData.fname;
            const date = bookData.date;
            const timeslot = bookData.timeslot;

            const row = document.createElement("tr");

            const fCell = document.createElement("td");
            fCell.textContent = facility;

            const dateCell = document.createElement("td");
            dateCell.textContent = date;

            const timeCell = document.createElement("td");
            timeCell.textContent = timeslot;

            const actionCell = document.createElement("td");

            const denyBtn = document.createElement("button");
            denyBtn.textContent = "Deny";
            denyBtn.className = "btn-deny";
            denyBtn.addEventListener("click", () => denyRequest(docSnap.id, row));

            actionCell.appendChild(denyBtn);

            row.appendChild(fCell);
            row.appendChild(dateCell);
            row.appendChild(timeCell);
            row.appendChild(actionCell);

            userTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching pending staff:", error);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        DisplayPending(); // now runs for ALL matching users
    } else {
        alert("User not signed in. Redirecting...");
        window.location.href = "index.html";
    }
});