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

const userTableBody = document.querySelector("#userTable").getElementsByTagName("tbody")[0];
const approvedTableBody = document.querySelector("#approvedTable").getElementsByTagName("tbody")[0];

async function DisplayPending() {
    try {
        const bookRef = collection(db, "bookings");

        // Firestore compound query
        const q = query(bookRef, where("status", "==", "pending"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnap) => {
            const bookData = docSnap.data();
            const resident = bookData.userName || "User";
            const facility = bookData.fname;
            const date = bookData.date;
            const timeslot = bookData.timeslot;

            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = resident;

            const fCell = document.createElement("td");
            fCell.textContent = facility;

            const dateCell = document.createElement("td");
            dateCell.textContent = date;

            const timeCell = document.createElement("td");
            timeCell.textContent = timeslot;

            const actionCell = document.createElement("td");

            const approveBtn = document.createElement("button");
            approveBtn.textContent = "Approve";
            approveBtn.className = "btn-approve";
            approveBtn.addEventListener("click", () => approveBooking(docSnap.id, bookData, row));

            const denyBtn = document.createElement("button");
            denyBtn.textContent = "Deny";
            denyBtn.className = "btn-deny";
            denyBtn.addEventListener("click", () => denyRequest(docSnap.id, row));

            actionCell.appendChild(approveBtn);
            actionCell.appendChild(denyBtn);

            row.appendChild(nameCell);
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

async function denyRequest(docId, rowElement) {
    const confirmation = confirm("Are you sure you want to deny this request? This action cannot be undone.");
    if (!confirmation) return;
  
    try {
      const bookDocRef = doc(db, "bookings", docId);
      await deleteDoc(bookDocRef);
      alert("Request denied and record deleted successfully.");
      rowElement.remove();
    } catch (error) {
      console.error("Error denying request:", error);
      alert("An error occurred while denying the request.");
    }
  }

async function approveBooking(docId, bookData, rowElement) {
    try {
      const bookDocRef = doc(db, "bookings", docId);
      await updateDoc(bookDocRef, { status: "approved" });

      // Remove the row from pending table immediately
      rowElement.remove();

      // Add to approved table immediately
      moveBookToApproved(bookData);

    } catch (error) {
      console.error("Error approving booking:", error);
    }
}

  
  function moveBookToApproved(bookData) {

    const tr = document.createElement("tr");
    const resTd = document.createElement("td");
    const facTd = document.createElement("td");
    const dateTd = document.createElement("td");
    const timeTd = document.createElement("td");

    resTd.textContent = bookData.userName || "No Name";
    facTd.textContent = bookData.fname;
    dateTd.textContent = bookData.date;
    timeTd.textContent = bookData.timeslot;


    const actionCell1 = document.createElement("td");

    const denyBtn = document.createElement("button");
    denyBtn.textContent = "Remove";
    denyBtn.className = "btn-deny";
    denyBtn.addEventListener("click", () => denyRequest(docSnap.id, tr) );

    actionCell1.appendChild(denyBtn);
  
    tr.appendChild(resTd);
    tr.appendChild(facTd);
    tr.appendChild(dateTd);
    tr.appendChild(timeTd);
    tr.appendChild(actionCell1);
  
    approvedTableBody.appendChild(tr);
  }

  async function DisplayBookApproved() {
    try {
        approvedTableBody.innerHTML = ""; // Clear existing rows

        const bookRef = collection(db, "bookings");
        const q = query(bookRef, where("status", "==", "approved"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnap) => {
            const bookData = docSnap.data();

            const tr = document.createElement("tr");
            const resTd = document.createElement("td");
            const facTd = document.createElement("td");
            const dateTd = document.createElement("td");
            const timeTd = document.createElement("td");

            const actionCell2 = document.createElement("td");

            const denyBtn = document.createElement("button");
            denyBtn.textContent = "Remove";
            denyBtn.className = "btn-deny";
            denyBtn.addEventListener("click", () => denyRequest(docSnap.id, tr) );

            actionCell2.appendChild(denyBtn);
          

            resTd.textContent = bookData.userName;
            facTd.textContent = bookData.fname;
            dateTd.textContent = bookData.date;
            timeTd.textContent = bookData.timeslot;

            tr.appendChild(resTd);
            tr.appendChild(facTd);
            tr.appendChild(dateTd);
            tr.appendChild(timeTd);
            tr.appendChild(actionCell2);

            approvedTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching approved staff:", error);
    }
}


onAuthStateChanged(auth, (user) => {
    if (user) {
        DisplayPending(); // now runs for ALL matching users
        DisplayBookApproved();
    } else {
        alert("User not signed in. Redirecting...");
        window.location.href = "index.html";
    }
});