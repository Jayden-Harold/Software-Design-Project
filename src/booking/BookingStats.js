import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../test_utils/firebase.js";

export function displayBookingStats(bookings) {
    const facilityCounts = {};
    let totalBookings = 0;
  
    bookings.forEach((booking) => {
      const facilityName = booking.fname;
      if (facilityName && booking.status === "approved") {
        facilityCounts[facilityName] = (facilityCounts[facilityName] || 0) + 1;
        totalBookings++;
      }
    });
  
    let mostPopularFacility = "";
    let maxBookings = 0;
  
    for (const [facility, count] of Object.entries(facilityCounts)) {
      if (count > maxBookings) {
        mostPopularFacility = facility;
        maxBookings = count;
      }
    }
  
    return { totalBookings, mostPopularFacility };
}
  