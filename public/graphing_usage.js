import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
   import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
   import { getFirestore, collection, query, where, getDocs, updateDoc, doc, deleteDoc, arrayUnion} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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


const q = query(
  collection(db, "bookings"),
  where("status", "==", "approved")
);

const bookingCounts = {};
const snapshot = await getDocs(q);

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

console.log(bookingCounts); // { "Pool": 4, "Gym": 2, ... }

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

