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

async function DisplayNotifications(user) {
    try {
        const noteRef = collection(db, "notifications");
        const userID = user.uid;

        // Firestore compound query
        const q = query(
            noteRef,
            where("userID", "in", [userID, "all"]),
            where("seenBy", "not-in", [[userID]])
          );
        const querySnapshot = await getDocs(q);
        userTableBody.innerHTML = "";

        querySnapshot.forEach((docSnap) => {
            const noteData = docSnap.data();
            const category = noteData.category;
            const date = noteData.date;
            const description = noteData.description;

            const row = document.createElement("tr");

            const catCell = document.createElement("td");
            catCell.textContent = category;

            const dateCell = document.createElement("td");
            dateCell.textContent = date;

            const descCell = document.createElement("td");
            descCell.textContent = description;

            // Action Cell (Mark as Read Button)
            const actionCell = document.createElement("td");
            const markReadBtn = document.createElement("button");
            markReadBtn.textContent = "Mark as Read";
            markReadBtn.className = "mark-read-btn"; // For CSS styling
            markReadBtn.onclick = () => handleMarkAsRead(docSnap.id, userID, row);
            actionCell.appendChild(markReadBtn);

            row.appendChild(catCell);
            row.appendChild(descCell);
            row.appendChild(dateCell);
            

            userTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
}

// Handle button click - mark notification as read
async function handleMarkAsRead(notificationId, userId, rowElement) {
    try {
        const notificationRef = doc(db, "notifications", notificationId);
        
        // Update Firestore
        await updateDoc(notificationRef, {
            seenBy: arrayUnion(userId) // Add user to seenBy array
        });

        // Visual feedback: Remove bold styling and button
        rowElement.style.fontWeight = "normal";
        const btnCell = rowElement.querySelector("td:last-child");
        btnCell.innerHTML = "✓ Read"; // Or remove the cell entirely

    } catch (error) {
        console.error("Error marking notification as read:", error);
        alert("Failed to mark as read. Please try again.");
    }
}


onAuthStateChanged(auth, (user) => {
    if (user) {
        DisplayNotifications(user); // now runs for ALL matching users
    } else {
        alert("User not signed in. Redirecting...");
        window.location.href = "index.html";
    }
});