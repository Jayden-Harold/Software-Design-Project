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
