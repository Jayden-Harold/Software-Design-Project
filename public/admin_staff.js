import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

const userTableBody = document.querySelector("#userTable").getElementsByTagName("tbody")[0];
const approvedTableBody = document.querySelector("#approvedTable").getElementsByTagName("tbody")[0];

async function DisplayStaffPending() {
    try {
        const usersRef = collection(db, "users");

        // Firestore compound query
        const q = query(usersRef, where("status", "==", "pending"), where("role", "==", "Staff"));
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

            const approveBtn = document.createElement("button");
            approveBtn.textContent = "Approve";
            approveBtn.className = "btn-approve";
            approveBtn.addEventListener("click", () => approveStaff(docSnap.id, userData, row));

            const denyBtn = document.createElement("button");
            denyBtn.textContent = "Deny";
            denyBtn.className = "btn-deny";

            actionCell.appendChild(approveBtn);
            actionCell.appendChild(denyBtn);

            row.appendChild(nameCell);
            row.appendChild(dateCell);
            row.appendChild(actionCell);

            userTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching pending staff:", error);
    }
}

async function approveStaff(docId, staffData, rowElement) {
    try {
      const staffDocRef = doc(db, "users", docId);
      await updateDoc(staffDocRef, { status: "approved" });

      // Remove the row from pending table immediately
      rowElement.remove();

      // Add to approved table immediately
      moveStaffToApproved(staffData);

    } catch (error) {
      console.error("Error approving staff:", error);
    }
}

  
  function moveStaffToApproved(staffData) {

    const tr = document.createElement("tr");
    const nameTd = document.createElement("td");
    const dateTd = document.createElement("td");
  
    nameTd.textContent = staffData.name || "No Name";
    const createdAt = staffData.createdAt?.toDate ? staffData.createdAt.toDate() : new Date();
    dateTd.textContent = createdAt.toLocaleString();
  
    tr.appendChild(nameTd);
    tr.appendChild(dateTd);
  
    approvedTableBody.appendChild(tr);
  }

  async function DisplayStaffApproved() {
    try {
        approvedTableBody.innerHTML = ""; // Clear existing rows

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("status", "==", "approved"), where("role", "==", "Staff"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnap) => {
            const staffData = docSnap.data();

            const tr = document.createElement("tr");
            const nameTd = document.createElement("td");
            const dateTd = document.createElement("td");

            nameTd.textContent = staffData.name || "No Name";
            const createdAt = staffData.createdAt?.toDate ? staffData.createdAt.toDate() : new Date();
            dateTd.textContent = createdAt.toLocaleString();

            tr.appendChild(nameTd);
            tr.appendChild(dateTd);

            approvedTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching approved staff:", error);
    }
}


onAuthStateChanged(auth, (user) => {
    if (user) {
        DisplayStaffPending(); // now runs for ALL matching users
        DisplayStaffApproved();
    } else {
        alert("User not signed in. Redirecting...");
        window.location.href = "index.html";
    }
});