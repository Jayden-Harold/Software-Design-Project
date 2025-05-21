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

// firestore query to fetch all maintenance issues that aren't marked as complete
const q = query(
  collection(db, "Maintenance"),
  where("Status", "!=", "Complete")
);

const reportCounts = {};
const snapshot = await getDocs(q);

//gets the date from 7 days ago for the "Last 7 days" filter
const now = new Date();
const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

//checks for reports that were reported within the last 7 days
snapshot.forEach(doc => {
  const data = doc.data();
  const facility = data.facility;
  const dateString = data.ReportedDate;

  const reportedDate = new Date(dateString); // Try to parse the string
  if (!isNaN(reportedDate) && reportedDateDate >= sevenDaysAgo) {
    reportCounts[facility] = (reportCounts[facility] || 0) + 1;
  }
});

console.log(reportCounts); // { "Swimming Pool": 4, "Padel": 2, ... }

// function to plot the maintenance reports graph
function plotReportChart(reportCounts) {
  const labels = Object.keys(reportCounts);
  const data = Object.values(reportCounts);

  const ctx = document.getElementById('facilityChart').getContext('2d');
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


const ctx = document.getElementById('facilityChart').getContext('2d');
let chart; // global chart reference

// Function to get reports by date range
async function fetchReports(days) {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - days);

  const snapshot = await getDocs(collection(db, 'Maintenance'));
  const counts = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    const status = data.status?.toLowerCase();
    const fname = data.facility || '';
    const timestamp = data.ReportedDate;
    const date = timestamp?.toDate?.(); // Convert Firestore Timestamp to JS Date

    if (status !== 'complete' && date && date >= cutoff) {
      counts[fname] = (counts[fname] || 0) + 1;
    }
  });

  return counts;
}

// Function to build or update chart
async function updateChart(days) {
  const counts = await fetchReports(days);
  const labels = Object.keys(counts);
  const data = Object.values(counts);

  if (chart) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].label = `Issues Reported within the Last ${days} Days`; // update label
    chart.update();
  } else {
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: `Issues Reported within the Last ${days} Days`,
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

// Default chart on load (7 days)
updateChart(7);

// Update chart when user selects different time range
document.getElementById('dateRangeSelector').addEventListener('change', (e) => {
  const days = parseInt(e.target.value);
  updateChart(days);
  renderStatusPieChart(days);
});

// function to fetch and count maintenance reports by status (assigned, in progress or complete)
async function fetchStatusCounts(days) {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - days);

  const snapshot = await getDocs(collection(db, 'Maintenance'));

  const statusCounts = {
    Open: 0,
    "In Progress": 0,
    Closed: 0
  };

  snapshot.forEach(doc => {
    const data = doc.data();
    const status = data.Status?.toLowerCase();
    const date = data.ReportedDate?.toDate?.();

    if (date && date >= cutoff) {
      if (status === 'reported' || status === 'assigned') {
        statusCounts.Open++;
      } else if (status === 'in progress') {
        statusCounts["In Progress"]++;
      } else if (status === 'complete') {
        statusCounts.Closed++;
      }
    }
  });

  return statusCounts;
}


let pieChart; // Global reference for pie chart

/* function to display the different maintenance report 
statuses(assigned, in progress or complete) statistics in a pie chart*/
async function renderStatusPieChart(days) {
  const counts = await fetchStatusCounts(days);
  const labels = Object.keys(counts);
  const data = Object.values(counts);

  const ctx = document.getElementById('issueChart').getContext('2d');

  if (pieChart) {
    pieChart.destroy();
  }

  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: `Maintenance Status (Last ${days} Days)`,
        data,
        backgroundColor: [
          '#f44336', // Open - red
          '#ff9800', // In Progress - orange
          '#4caf50'  // Closed - green
        ]
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: `Maintenance Requests by Status (Last ${days} Days)`
        }
      }
    }
  });
}


// Call on page load
renderStatusPieChart(7);
