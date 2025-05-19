//import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "firebase/auth";
import { getDocs, doc, updateDoc, collection, query, where,deleteDoc } from "firebase/firestore";
import { auth, db } from "../test_utils/firebase.js";

export const userTableBody = document.querySelector("#userTable").getElementsByTagName("tbody")[0];
export const approvedTableBody = document.querySelector("#approvedTable").getElementsByTagName("tbody")[0];

export async function DisplayResPending() {
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

export async function approveResident(docId, resData, rowElement) {
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

export async function denyRequest(db,docId, rowElement) {
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
  
export  function moveResToApproved(resData) {

    const tr = document.createElement("tr");
    const nameTd = document.createElement("td");
    const dateTd = document.createElement("td");
  
    nameTd.textContent = resData.name || "No Name";
    const createdAt = resData.createdAt?.toDate ? resData.createdAt.toDate() : new Date();
    dateTd.textContent = createdAt.toLocaleString();
  
    tr.appendChild(nameTd);
    tr.appendChild(dateTd);
  
    approvedTableBody.appendChild(tr);
  }

 export  async function DisplayResApproved() {
    try {
        const approvedTableBody = document.querySelector("#approvedTable tbody"); 
        if (!approvedTableBody) return;
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

            tr.appendChild(nameTd);
            tr.appendChild(dateTd);

            approvedTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching approved residents:", error);
    }
}



/*onAuthStateChanged(auth, (user) => {
    if (user) {
        DisplayResPending(); // now runs for ALL matching users
        DisplayResApproved();
    } else {
        alert("User not signed in. Redirecting...");
        window.location.href = "index.html";
    }
}); */