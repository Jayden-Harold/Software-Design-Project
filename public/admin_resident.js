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

const userTableBody = document.querySelector("#userTable").getElementsByTagName("tbody")[0];
const approvedTableBody = document.querySelector("#approvedTable").getElementsByTagName("tbody")[0];
//displays all users awaiting approval
async function DisplayResPending() {
    try {
        const usersRef = collection(db, "users");

        // Firestore compound query
        const q = query(usersRef, where("status", "==", "pending"), where("role", "==", "Resident"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnap) => {
            const userData = docSnap.data();
            const name = userData.name || "User";
            const createdAt = userData.createdAt?.toDate().toLocaleString() || "N/A";

            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = name;

            const dateCell = document.createElement("td");
            dateCell.textContent = createdAt;

            const actionCell = document.createElement("td");
// approve or deny buttons
            const approveBtn = document.createElement("button");
            approveBtn.textContent = "Approve";
            approveBtn.className = "btn-approve";
            approveBtn.addEventListener("click", () => approveResident(docSnap.id, userData, row));

            const denyBtn = document.createElement("button");
            denyBtn.textContent = "Deny";
            denyBtn.className = "btn-deny";
            denyBtn.addEventListener("click", () => denyRequest(docSnap.id, row) );

            actionCell.appendChild(approveBtn);
            actionCell.appendChild(denyBtn);

            row.appendChild(nameCell);
            row.appendChild(dateCell);
            row.appendChild(actionCell);

            userTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching pending residents:", error);
    }
}
// function to approve residents in the db
async function approveResident(docId, resData, rowElement) {
    try {
      const resDocRef = doc(db, "users", docId);
      await updateDoc(resDocRef, { status: "approved" });

      // Remove the row from pending table immediately
      rowElement.remove();

      // Add to approved table immediately
      moveResToApproved(resData);

    } catch (error) {
      console.error("Error approving resident:", error);
    }
}
// denies resident requests as users
async function denyRequest(docId, rowElement) {
    const confirmation = confirm("Are you sure you want to deny this request? This action cannot be undone.");
    if (!confirmation) return;
  
    try {
      const resDocRef = doc(db, "users", docId);
      await deleteDoc(resDocRef);
      alert("Request denied and record deleted successfully.");
      rowElement.remove();
    } catch (error) {
      console.error("Error denying request:", error);
      alert("An error occurred while denying the request.");
    }
  }
  // moves pending users to approved section
  function moveResToApproved(resData) {

    const tr = document.createElement("tr");
    const nameTd = document.createElement("td");
    const dateTd = document.createElement("td");
  
    nameTd.textContent = resData.name || "No Name";
    const createdAt = resData.createdAt?.toDate ? resData.createdAt.toDate() : new Date();
    dateTd.textContent = createdAt.toLocaleString();
  
    const actionCell1 = document.createElement("td");

    const denyBtn = document.createElement("button");
    denyBtn.textContent = "Remove";
    denyBtn.className = "btn-deny";
    denyBtn.addEventListener("click", () => denyRequest(docSnap.id, tr) );

    actionCell1.appendChild(denyBtn);

    tr.appendChild(nameTd);
    tr.appendChild(dateTd);
    tr.appendChild(actionCell1);
  
    approvedTableBody.appendChild(tr);
  }
//displays approved residents
  async function DisplayResApproved() {
    try {
        approvedTableBody.innerHTML = ""; // Clear existing rows

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("status", "==", "approved"), where("role", "==", "Resident"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnap) => {
            const resData = docSnap.data();

            const tr = document.createElement("tr");
            const nameTd = document.createElement("td");
            const dateTd = document.createElement("td");

            nameTd.textContent = resData.name || "No Name";
            const createdAt = resData.createdAt?.toDate ? resData.createdAt.toDate() : new Date();
            dateTd.textContent = createdAt.toLocaleString();

            const actionCell2 = document.createElement("td");

            const denyBtn = document.createElement("button");
            denyBtn.textContent = "Remove";
            denyBtn.className = "btn-deny";
            denyBtn.addEventListener("click", () => denyRequest(docSnap.id, tr) );

            actionCell2.appendChild(denyBtn);

            tr.appendChild(nameTd);
            tr.appendChild(dateTd);
            tr.appendChild(actionCell2);

            approvedTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching approved residents:", error);
    }
}


onAuthStateChanged(auth, (user) => {
    if (user) {
        DisplayResPending(); // now runs for ALL matching users
        DisplayResApproved();
    } else {
        alert("User not signed in. Redirecting...");
        window.location.href = "index.html";
    }
});
