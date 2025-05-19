import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
   import { collection, query, where, getDocs, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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
  const approvedTableBody = document.querySelector("#approvedTable").getElementsByTagName("tbody")[0];

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
        const q = query(mainRef, where("Status", "==", "Reported"));
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

            // 🔁 Add event listener inside the loop
            select.addEventListener("change", async (e) => {
                const selectedStaff = e.target.value;
                const docId = docSnap.id;

                try {
                    await updateDoc(doc(db, "Maintenance", docId), {
                        assignedTo: selectedStaff,
                        Status: "Assigned"
                    });
                    alert(`Assigned to ${selectedStaff} successfully.`);

                    const perfQuery = query(
                        collection(db, "Staff Performance"),
                        where("Staff", "==", selectedStaff)
                    );
                    const perfSnapshot = await getDocs(perfQuery);

                    if (perfSnapshot.empty) {
                        await addDoc(collection(db, "Staff Performance"), {
                            Staff: selectedStaff,
                            ResolveIssues: 0,
                            AvResTime: 0,
                            CurrWorkload: 1
                        });
                    } else {
                        const staffDoc = perfSnapshot.docs[0];
                        const currentData = staffDoc.data();
                        const currentWorkload = currentData.CurrWorkload || 0;

                        await updateDoc(doc(db, "Staff Performance", staffDoc.id), {
                            CurrWorkload: currentWorkload + 1
                        });
                    }
                } catch (error) {
                    console.error("Error assigning staff:", error);
                    alert("Failed to assign staff.");
                }
            });

            tr.appendChild(facTd);
            tr.appendChild(catTd);
            tr.appendChild(descTd);
            tr.appendChild(assignedTd);
            tr.appendChild(statTd);
            tr.appendChild(dateTd);

            mainTableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error displaying reports:", error);
    }
}
async function DisplayAssigned() {
    try {
        approvedTableBody.innerHTML = ""; // Clear existing rows

        const mainRef = collection(db, "Maintenance");
        const q = query(mainRef, where("Status", "!=", "Reported"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnap) => {
            const mainData = docSnap.data();

            const tr = document.createElement("tr");
            const facTd = document.createElement("td");
            const catTd = document.createElement("td");
            const descTd = document.createElement("td");
            const assignedTd = document.createElement("td");
            const statTd = document.createElement("td");
            const dateTd = document.createElement("td");

            const createdAt = mainData.ReportedDate?.toDate ? mainData.ReportedDate.toDate() : new Date();
            dateTd.textContent = createdAt.toLocaleString();

            // Fill table cells
            facTd.textContent = mainData.facility || "";
            catTd.textContent = mainData.category || "";
            descTd.textContent = mainData.description || "";
            statTd.textContent = mainData.Status || "";
            assignedTd.textContent = mainData.assignedTo || "";

            const status = (mainData.Status || "").toLowerCase();
            if (status === "complete") {
                statTd.style.color = "green";
            } else if (status === "in progress" || status === "assigned") {
                statTd.style.color = "orange";
            }

            tr.appendChild(facTd);
            tr.appendChild(catTd);
            tr.appendChild(descTd);
            tr.appendChild(assignedTd);
            tr.appendChild(statTd);
            tr.appendChild(dateTd);

            approvedTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
    }
}
async function DisplayStaffPerformance() {
  try {
    const performanceTableBody = document.querySelector("#performanceTable tbody");
    performanceTableBody.innerHTML = "";

    const snapshot = await getDocs(collection(db, "Staff Performance"));

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      const tr = document.createElement("tr");
      const nameTd = document.createElement("td");
      const resolvedTd = document.createElement("td");
      const avgTimeTd = document.createElement("td");
      const workloadTd = document.createElement("td");

      nameTd.textContent = data.Staff || "Unknown";
      resolvedTd.textContent = data.ResolvedIssues ?? 0;

      const avgTime = data.AvResTime ?? "-";
      avgTimeTd.textContent = typeof avgTime === "number" ? `${avgTime.toFixed(2)} hrs` : "-";

      workloadTd.textContent = data.CurrWorkload ?? 0;

      tr.appendChild(nameTd);
      tr.appendChild(resolvedTd);
      tr.appendChild(avgTimeTd);
      tr.appendChild(workloadTd);

      performanceTableBody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error displaying staff performance:", error);
  }
}

async function loadStaffPerformance() {
  const tableBody = document.querySelector("#staffPerformanceTable tbody");

  // Clear existing rows (optional, useful if reloading)
  tableBody.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "Staff Performance"));

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Destructure with defaults in case some values are missing
      const {
        Staff = "N/A",
        ResolvedIssues = 0,
        AvResTime = 0,
        CurrWorkload = 0
      } = data;

      const row = document.createElement("tr");
row.innerHTML = `
        <td>${Staff}</td>
        <td>${ResolvedIssues}</td>
        <td>${AvResTime}</td>
        <td>${CurrWorkload}</td>
      `;

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading staff performance data:", error);
  }
}


onAuthStateChanged(auth, (user) => {
    if (user) {
        DisplayReports();
        DisplayAssigned();
        DisplayStaffPerformance();
        loadStaffPerformance();
    } else {
        alert("User not signed in. Redirecting...");
        window.location.href = "index.html";
    }
});

