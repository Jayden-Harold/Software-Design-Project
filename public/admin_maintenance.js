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

        const mainRef = collection(db, "Maintenance");
        const q = query(mainRef);
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

            facTd.textContent = mainData.facility;
            catTd.textContent = mainData.category;
            descTd.textContent = mainData.description;
            statTd.textContent = mainData.Status;
            const select = document.createElement('select');
            ['Pending', 'Approved', 'Denied'].forEach(status => {
                const option = document.createElement('option');
                option.value = status.toLowerCase();
                option.textContent = status;
                select.appendChild(option);
            });

            tr.appendChild(facTd);
            tr.appendChild(catTd);
            tr.appendChild(descTd);
            tr.appendChild(select);
            tr.appendChild(dateTd);
            tr.appendChild(statTd);

            mainTableBody.appendChild(tr);

        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        DisplayReports();
    } else {
        alert("User not signed in. Redirecting...");
        window.location.href = "index.html";
    }
});
