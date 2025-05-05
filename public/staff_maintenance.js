import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
   import { collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
   import { updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

    async function DisplayStaffReports() {
      try {
          const user = auth.currentUser;
          if (!user) {
              alert("User not signed in.");
              return;
          }
  
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const staffName = userDoc.data()?.name;
  
          if (!staffName) {
              alert("User name not found.");
              return;
          }
  
          const tableBody = document.querySelector("#staffTable").getElementsByTagName("tbody")[0];
          tableBody.innerHTML = ""; // Clear previous rows
  
          // Get only maintenance reports assigned to this staff
          const q = query(collection(db, "Maintenance"), where("assignedTo", "==", staffName));
          const snapshot = await getDocs(q);
  
          snapshot.forEach(async (docSnap) => {
              const data = docSnap.data();
              const tr = document.createElement("tr");
  
              const facTd = document.createElement("td");
              const catTd = document.createElement("td");
              const descTd = document.createElement("td");
              const dateTd = document.createElement("td");
              const statusTd = document.createElement("td");
  
              // Fill data
              facTd.textContent = data.facility || "";
              catTd.textContent = data.category || "";
              descTd.textContent = data.description || "";
              const date = data.ReportedDate?.toDate ? data.ReportedDate.toDate() : new Date();
              dateTd.textContent = date.toLocaleString();
  
              // Status dropdown
              const statusSelect = document.createElement("select");
              ["In Progress", "Complete"].forEach((status) => {
                  const option = document.createElement("option");
                  option.value = status;
                  option.textContent = status;
                  if (data.Status === status) option.selected = true;
                  statusSelect.appendChild(option);
              });

              const facilitiesRef = collection(db, "facilities");
              const q = query(facilitiesRef, where("fname", "==", data.facility));
              const querySnapshot = await getDocs(q);
            
              // Handle status update
              statusSelect.addEventListener("change", async (e) => {
                  const newStatus = e.target.value;
                  try {
                      await updateDoc(doc(db, "Maintenance", docSnap.id), {
                          Status: newStatus
                      });
                      alert(`Status updated to "${newStatus}"`);
                      if (newStatus === "Complete"){
                        querySnapshot.forEach(async (facilityDoc) => {
                          await updateDoc(facilityDoc.ref, {
                            status: "available"
                          });
                        }); 
                      }
                  } catch (err) {
                      console.error("Failed to update status:", err);
                      alert("Error updating status.");
                  }
              });

              statusTd.appendChild(statusSelect);
  
              tr.appendChild(facTd);
              tr.appendChild(catTd);
              tr.appendChild(descTd);
              tr.appendChild(statusTd);
              tr.appendChild(dateTd);
              tableBody.appendChild(tr);
          });
      } catch (error) {
          console.error("Error loading staff reports:", error);
      }
  }
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      DisplayStaffReports();
    } else {
      alert("Not signed in");
      window.location.href = "index.html";
    }
  });
  