import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
   import { collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

   const firebaseConfig = {
    apiKey: "AIzaSyDSqHKGzYj8bUzKGoFHH93x3Wlq4G463yY",
    authDomain: "greensmoke-ee894.firebaseapp.com",
    projectId: "greensmoke-ee894",
    storageBucket: "greensmoke-ee894.firebasestorage.app",
    messagingSenderId: "140065144019",
    appId: "1:140065144019:web:48e4963e4826a85aca2826"
  };

  const menu = document.querySelector("#mobile-menu");
  const menuLinks = document.querySelector(".nav-menu");
  
  // Toggle Mobile Menu
  menu.addEventListener("click", () => {
      menu.classList.toggle("is-active");
      menuLinks.classList.toggle("active");
  });
  
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const user = auth.currentUser;

  const mainTableBody = document.querySelector("#mainTable").getElementsByTagName("tbody")[0];

  async function DisplayReports() {
    try {
        mainTableBody.innerHTML = ""; // Clear existing rows

        // Step 1: Fetch all staff members (once)
        const staffSnapshot = await getDocs(
            query(collection(db, "users"), where("role", "==", "Staff"))
        );

        const staffList = [];
        staffSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.name) {
                staffList.push(data.name);
            }
        });

        // Step 2: Fetch all maintenance reports
        const mainRef = collection(db, "Maintenance");
        const q = query(mainRef);
        const querySnapshot = await getDocs(q);

        // Step 3: Build table rows
        querySnapshot.forEach((docSnap) => {
            const mainData = docSnap.data();

            const tr = document.createElement("tr");
            const facTd = document.createElement("td");
            const catTd = document.createElement("td");
            const descTd = document.createElement("td");
            const assignedTd = document.createElement("td");
            const statTd = document.createElement("td");
            const dateTd = document.createElement("td");

            // Format date
            const createdAt = mainData.ReportedDate?.toDate ? mainData.ReportedDate.toDate() : new Date();
            dateTd.textContent = createdAt.toLocaleString();

            // Fill table cells
            facTd.textContent = mainData.facility || "";
            catTd.textContent = mainData.category || "";
            descTd.textContent = mainData.description || "";
            statTd.textContent = mainData.Status || "";

            // Create and populate the select dropdown
            const select = document.createElement("select");
            select.innerHTML = `<option value="" disabled selected>Select staff...</option>`;

            if (staffList.length > 0) {
                staffList.forEach((name) => {
                    const option = document.createElement("option");
                    option.value = name;
                    option.textContent = name;
                    select.appendChild(option);
                });
            } else {
                const option = document.createElement("option");
                option.value = "";
                option.textContent = "No staff found";
                select.appendChild(option);
            }

            assignedTd.appendChild(select);

            // Append all cells to row
            tr.appendChild(facTd);
            tr.appendChild(catTd);
            tr.appendChild(descTd);
            tr.appendChild(assignedTd);
            tr.appendChild(dateTd);
            tr.appendChild(statTd);

            // Append row to table
            mainTableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error displaying reports:", error);
    }
}

    select.addEventListener("change", async (e) => {
      const selectedStaff = e.target.value;
      const docId = docSnap.id; // ID of the current report
  
      try {
          await updateDoc(doc(db, "Maintenance", docId), {
              assignedTo: selectedStaff,
              Status: "assigned"  // ✅ Add this line to update the status
          });
          alert(`Assigned to ${selectedStaff} successfully.`);
          statTd.textContent = "assigned"; // Optional: instantly update UI
      } catch (error) {
          console.error("Error assigning staff:", error);
          alert("Failed to assign staff.");
      }
  });

onAuthStateChanged(auth, (user) => {
    if (user) {
        DisplayReports();
    } else {
        alert("User not signed in. Redirecting...");
        window.location.href = "index.html";
    }
});
