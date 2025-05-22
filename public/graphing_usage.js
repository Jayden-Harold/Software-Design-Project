import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, collection, query, where, getDocs, updateDoc, doc, deleteDoc, arrayUnion} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

// firestore query to fetch all bookings that have been approved by admin
const q = query(
  collection(db, "bookings"),
  where("status", "==", "approved")
);

const bookingCounts = {};
const snapshot = await getDocs(q);

//gets the date from 7 days ago for the "Last 7 days" filter
const now = new Date();
const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

snapshot.forEach(doc => {
  const data = doc.data();
  const facility = data.fname;
  const dateString = data.date;

  const bookingDate = new Date(dateString); // Try to parse the string
  if (!isNaN(bookingDate) && bookingDate >= sevenDaysAgo) {
    bookingCounts[facility] = (bookingCounts[facility] || 0) + 1;
  }
});

console.log(bookingCounts); // { "Swimming Pool": 4, "Padel": 2, ... }


// function to plot the bookings graph
function plotBookingChart(bookingCounts) {
  const labels = Object.keys(bookingCounts);
  const data = Object.values(bookingCounts);

  const ctx = document.getElementById('bookingsChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Approved Bookings (Last 7 Days)',
        data,
        backgroundColor: 'rgba(0, 150, 136, 0.7)',
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


const ctx = document.getElementById('bookingsChart').getContext('2d');
let chart; // global chart reference

// Function to get bookings by date range
async function fetchBookings(days) {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - days);

  const snapshot = await getDocs(collection(db, 'bookings'));
  const counts = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    const status = data.status?.toLowerCase();
    const fname = data.fname || '';
    const dateStr = data.date;
    const date = new Date(dateStr);

    if (status === 'approved' && date >= cutoff) {
      counts[fname] = (counts[fname] || 0) + 1;
    }
  });

  return counts;
}


// Function to build or update chart
async function updateChart(days) {
  const counts = await fetchBookings(days);
  const labels = Object.keys(counts);
  const data = Object.values(counts);

  if (chart) {
    // update existing chart
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].label = `Approved Bookings (Last ${days} Days)`; // <-- Fix here
    chart.update();
  } else {
    // create chart for first time
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: `Approved Bookings (Last ${days} Days)`,
          data,
          backgroundColor: 'rgba(0, 150, 136, 0.7)',
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


// Default load (7 days)
updateChart(7);

// Listen for selector changes
document.getElementById('dateRangeSelector').addEventListener('change', (e) => {
  const days = parseInt(e.target.value);
  updateChart(days);
});

const ctx1 = document.getElementById('bookingsChart-custom').getContext('2d');
let chart1; // global chart reference


// function to fetch and count bookings by status: approved
async function fetchBookingsCustom(days = null, startDate = null, endDate = null) {
  const snapshot = await getDocs(collection(db, 'bookings'));
  const counts = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    const status = data.status?.toLowerCase();
    const fname = data.fname || '';
    const dateStr = data.date;
    const date = new Date(dateStr);

    let include = false;
    if (status === 'approved') {
      if (days !== null) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        include = date >= cutoff;
      } else if (startDate && endDate) {
        include = date >= new Date(startDate) && date <= new Date(endDate);
      }
    }

    if (include) {
      counts[fname] = (counts[fname] || 0) + 1;
    }
  });

  return counts;
}

/* function to highlight a specific facility bar when a user filters bookings by facility*/
async function updateChartCustom(days = null, startDate = null, endDate = null) {
  const counts = await fetchBookingsCustom(days, startDate, endDate);
  const labels = Object.keys(counts);
  const data = Object.values(counts);

  const selectedFacility = document.getElementById("facility")?.value;

  const backgroundColors = labels.map(label =>
    label === selectedFacility ? 'rgba(255, 99, 132, 0.8)' : 'rgba(0, 150, 136, 0.7)'
  );

  const labelText = days
    ? `Approved Bookings (Last ${days} Days)`
    : `Approved Bookings (${startDate} to ${endDate})`;

  if (chart1) {
    chart1.data.labels = labels;
    chart1.data.datasets[0].data = data;
    chart1.data.datasets[0].label = labelText;
    chart1.data.datasets[0].backgroundColor = backgroundColors;
    chart1.update();
  } else {
    chart1 = new Chart(ctx1, {
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

updateChartCustom(7);

// date range filter listener
document.getElementById('dateRangeSelector2').addEventListener('change', (e) => {
  const val = e.target.value;
  if (val === "custom") {
    document.getElementById("customDateModal").style.display = "block";
  } else {
    const days = parseInt(val);
    updateChartCustom(days);
  }
});

//listener to update the chart based on the selected date range filter
document.getElementById("applyDateRange").addEventListener("click", () => {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }

  if (new Date(startDate) > new Date(endDate)) {
    alert("Start date must be before end date.");
    return;
  }

  document.getElementById("customDateModal").style.display = "none";

  updateChartCustom(null, startDate, endDate);
});

const sportSelect = document.getElementById("sport");
const facilitySelect = document.getElementById("facility");

//listener to fetch all facility data related to the sport based on the sports filter
sportSelect.addEventListener("change", async function () {
  const selectedSport = sportSelect.value;
  facilitySelect.innerHTML = '<option value="" disabled selected>Loading...</option>';

  try {
    const facilitiesRef = collection(db, "facilities");
    const q = query(facilitiesRef, where("sport", "==", selectedSport));
    const querySnapshot = await getDocs(q);

    facilitySelect.innerHTML = '<option value="" disabled selected>Facility...</option>';

    if (querySnapshot.empty) {
      facilitySelect.innerHTML = '<option value="">No facilities found for this sport</option>';
    } else {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const option = document.createElement("option");
        option.value = data.fname;
        option.textContent = data.fname;
        facilitySelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error loading facilities:", error);
    facilitySelect.innerHTML = '<option value="">Error loading facilities</option>';
  }
});

//listener to update the chart based on the selected sport and date range filter
document.getElementById("facility").addEventListener("change", () => {
  const val = document.getElementById("dateRangeSelector2").value;
  if (val === "custom") {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    if (startDate && endDate) {
      updateChartCustom(null, startDate, endDate);
    }
  } else {
    const days = parseInt(val);
    updateChartCustom(days);
  }
});

const sportSelect1 = document.getElementById("sport1");
const facilitySelect1 = document.getElementById("facility1");

//listener to fetch all facility data related to the sport based on the sports filter for another chart
sportSelect1.addEventListener("change", async function () {
  const selectedSport = sportSelect1.value;
  facilitySelect1.innerHTML = '<option value="" disabled selected>Loading...</option>';

  try {
    const facilitiesRef = collection(db, "facilities");
    const q = query(facilitiesRef, where("sport", "==", selectedSport));
    const querySnapshot = await getDocs(q);

    facilitySelect1.innerHTML = '<option value="" disabled selected>Facility...</option>';

    if (querySnapshot.empty) {
      facilitySelect1.innerHTML = '<option value="">No facilities found for this sport</option>';
    } else {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const option = document.createElement("option");
        option.value = data.fname;
        option.textContent = data.fname;
        facilitySelect1.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error loading facilities:", error);
    facilitySelect1.innerHTML = '<option value="">Error loading facilities</option>';
  }
});
