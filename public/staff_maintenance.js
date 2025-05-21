import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
   import { collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
   import { updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

   // firebase configurator
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

    // function to display maintenance reports assigned to the specific staff member
    async function DisplayStaffReports() {
      try {
          const user = auth.currentUser;
          if (!user) {
              alert("User not signed in."); //checks if staff member is signed in
              return;
          }
  
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const staffName = userDoc.data()?.name; //get the staff member's name
  
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
              ["Assigned", "In Progress", "Complete"].forEach((status) => {
                  const option = document.createElement("option");
                  option.value = status;
                  option.textContent = status;
                  if (data.Status === status) option.selected = true;
                  statusSelect.appendChild(option);
              });

              const facilitiesRef = collection(db, "facilities");
              const q = query(facilitiesRef, where("fname", "==", data.facility));
              const querySnapshot = await getDocs(q);
            
              // Handle reported maintenance issue status update by staff member
              statusSelect.addEventListener("change", async (e) => {
                  const newStatus = e.target.value;
                  try {
                      await updateDoc(doc(db, "Maintenance", docSnap.id), {
                          Status: newStatus
                      });
                      alert(`Status updated to "${newStatus}"`);
                      
                      /*if the staff updates maintenance issue to "complete", update the staff
                      member's resolution time*/
                      if (newStatus === "Complete"){
                        const now = new Date();
                        const reportedDate = data.ReportedDate?.toDate ? data.ReportedDate.toDate() : now;
                        const resolutionTime = (now - reportedDate) / (1000 * 60 * 60); // in hours

                        await updateDoc(doc(db, "Maintenance", docSnap.id), {
                            ResolvedDate: now,
                            resolutionTime: resolutionTime
                          });
                         
                         const assignedTo = data.assignedTo || staffName;
                         const workload = data.workload || 0;

                          const staffRef = doc(db, "Staff Performance", assignedTo);
                          const staffSnap = await getDoc(staffRef); 
                        
                          // updates the relevant staff performance attributes:
                          if (staffSnap.exists()) {
                            const staffData = staffSnap.data();
                            const updatedIssuesResolved = (staffData.ResolvedIssues || 0) + 1;
                            const updatedResolutionTime = (staffData.resolutionTime || 0) + resolutionTime;
                            const updatedWorkload = (staffData.CurrWorkload || 0) - 1;
                            const updatedAvgResolutionTime = updatedResolutionTime / updatedIssuesResolved;
                        
                            await updateDoc(staffRef, {
                              ResolvedIssues: updatedIssuesResolved,
                              ResolutionTime: updatedResolutionTime,
                              CurrWorkload: updatedWorkload,
                              AvResTime: updatedAvgResolutionTime
                            });
                          } else {
                            await setDoc(staffRef, {
                              Staff: assignedTo,
                              ResolvedIssues: 1,
                              resolutionTime: resolutionTime,
                              CurrWorkload: workload,
                              AvResTime: resolutionTime
                            });
                          }
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

/* check if staff is logged in before displaying maintenance reports,
if not, alert user they're not signed in and redirects to the homepage*/  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      DisplayStaffReports();
    } else {
      alert("Not signed in");
      window.location.href = "index.html";
    }
  });
  
