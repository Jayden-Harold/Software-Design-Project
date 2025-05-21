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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to get and display booking statistics
async function displayBookingStats() {
  try {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    const facilityCounts = {};
    let totalBookings = 0;
    
    // Count bookings per facility and get total count
    querySnapshot.forEach((doc) => {
      const bookingData = doc.data();
      const facilityName = bookingData.fname;
      if (facilityName && bookingData.status == "approved") {
        facilityCounts[facilityName] = (facilityCounts[facilityName] || 0) + 1;
        totalBookings++;
      }
    });
    
    // Find the facility with the highest count
    let mostPopularFacility = "";
    let maxBookings = 0;
    
    for (const [facility, count] of Object.entries(facilityCounts)) {
      if (count > maxBookings) {
        mostPopularFacility = facility;
        maxBookings = count;
      }
    }
    
    // Display most popular facility
    const popularFacilityElement = document.querySelector('#most-popular-facility');
    if (popularFacilityElement) {
      if (mostPopularFacility) {
        popularFacilityElement.innerHTML = `
          <h1>Most Popular Facility</h1>
          <h2>${mostPopularFacility}</h2>
        `;
      } else {
        popularFacilityElement.innerHTML = `
          <h1>Most Popular Facility</h1>
          <h2>No booking data available</h2>
        `;
      }
    }
    
    // Display total bookings
    const totalBookingsElement = document.querySelector('#total-bookings');
    if (totalBookingsElement) {
      totalBookingsElement.innerHTML = `
        <h1>Total Bookings</h1>
        <h2>${totalBookings}</h2>
      `;
    }
    
  } catch (error) {
    console.error("Error fetching booking data:", error);
    
    const popularFacilityElement = document.querySelector('.most-popular-facility');
    if (popularFacilityElement) {
      popularFacilityElement.innerHTML = `
        <h1>Most Popular Facility</h1>
        <h2>Error loading data</h2>
      `;
    }
    
    const totalBookingsElement = document.querySelector('.total-bookings');
    if (totalBookingsElement) {
      totalBookingsElement.innerHTML = `
        <h1>Total Bookings</h1>
        <h2>Error loading data</h2>
      `;
    }
  }
}

// Tab functions
function openView(evt, viewName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(viewName).style.display = "block";
  evt.currentTarget.className += " active";
  
  if (viewName === 'usage-trends') {
    displayBookingStats();
  }
}

const usageTrends = document.getElementById('usage-trends-btn');
usageTrends.addEventListener("click", (e) => {
    e.preventDefault();
    openView(e, 'usage-trends')
});

const customView = document.getElementById('custom-view-btn');
customView.addEventListener("click", (e) => {
    e.preventDefault();
    openView(e, 'custom-view')
});

// Initialize
usageTrends.click();

const ctxMaintenance = document.getElementById('maintenanceChart').getContext('2d');
let maintenanceChart;

// Fetch resolved maintenance issues grouped by facility
async function fetchMaintenanceCounts(days = null, startDate = null, endDate = null) {
  const snapshot = await getDocs(collection(db, 'Maintenance'));
  const counts = {};
  const now = new Date();

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const facility = data.facility || 'Unknown Facility';
    const timestamp = data.ReportedDate;

    const reportedDate = timestamp.toDate(); // convert Firestore Timestamp to JS Date
    let include = false;

    if (days !== null) {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - days);
      include = reportedDate >= cutoff;
    } else if (startDate && endDate) {
      include = reportedDate >= new Date(startDate) && reportedDate <= new Date(endDate);
    }

    if (include) {
      counts[facility] = (counts[facility] || 0) + 1;
    }
  });

  return counts;
}

// Build or update the maintenance chart
async function updateMaintenanceChart(days = null, startDate = null, endDate = null) {
  const counts = await fetchMaintenanceCounts(days, startDate, endDate);
  const labels = Object.keys(counts);
  const data = Object.values(counts);
const selectedFacility = document.getElementById("facility1")?.value;

  const backgroundColors = labels.map(label =>
    label === selectedFacility ? 'rgba(255, 99, 132, 0.8)' : 'rgba(0, 150, 136, 0.7)'
  );

  const labelText = days
    ? `Maintenance Issues (Last ${days} Days)`
    : `Maintenance Issues (${startDate} to ${endDate})`;

  if (maintenanceChart) {
    maintenanceChart.data.labels = labels;
    maintenanceChart.data.datasets[0].data = data;
    maintenanceChart.data.datasets[0].label = labelText;
    maintenanceChart.data.datasets[0].backgroundColor = backgroundColors;
    maintenanceChart.update();
  } else {
    maintenanceChart = new Chart(ctxMaintenance, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: labelText,
          data,
          backgroundColor: backgroundColors,
          barThickness: 50
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }
}




// Default to last 7 days
updateMaintenanceChart(7);

// Optional: Add a selector just like for bookings
document.getElementById('maintenanceDateRangeSelector').addEventListener('change', (e) => {
  const val = e.target.value;
  if (val === "custom") {
    document.getElementById("customMaintenanceModal").style.display = "block";
    document.getElementById("modalBackdrop").style.display = "block";
  } else {
    const days = parseInt(val);
    updateMaintenanceChart(days);
  }
});

document.getElementById("facility1").addEventListener("change", () => {
  const val = document.getElementById("maintenanceDateRangeSelector").value;
  if (val === "custom") {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    if (startDate && endDate) {
      updateChartCustom(null, startDate, endDate);
    }
  } else {
    const days = parseInt(val);
    updateMaintenanceChart(days);
  }



});

const approvedTableBody = document.querySelector("#mainTable").getElementsByTagName("tbody")[0];
//Displays assigned maintenance issue details
async function DisplayAssigned() {
  try {
    approvedTableBody.innerHTML = ""; // Clear existing rows

    const dateRange = document.getElementById("dateRange").value;
    const days = parseInt(dateRange, 10);

    const endDate = new Date(); // now
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const mainRef = collection(db, "Maintenance");

    // Only filter by Status in the query to avoid needing a composite index
    const q = query(mainRef, where("Status", "!=", "Reported"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((docSnap) => {
      const mainData = docSnap.data();

      // Convert Firestore Timestamp to JS Date
      const reportedDate = mainData.ReportedDate?.toDate?.();
      if (!reportedDate) return;

      // Filter by date range manually in JS
      if (reportedDate < startDate || reportedDate > endDate) return;

      const tr = document.createElement("tr");
      const facTd = document.createElement("td");
      const catTd = document.createElement("td");
      const descTd = document.createElement("td");
      const assignedTd = document.createElement("td");
      const statTd = document.createElement("td");
      const dateTd = document.createElement("td");

      dateTd.textContent = reportedDate.toLocaleString();
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
    console.error("Error fetching maintenance data:", error);
  }
}


DisplayAssigned();
