import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../test_utils/firebase.js";

export function generateTimeslots(start = 8, end = 20) {
    const slots = [];
    for (let hour = start; hour < end; hour++) {
      const startStr = `${hour.toString().padStart(2, "0")}:00`;
      const endStr = `${(hour + 1).toString().padStart(2, "0")}:00`;
      slots.push(`${startStr}–${endStr}`);
    }
    return slots;
  }
  
  export async function getCapacityBySport(fname, db, getDocs, collection, query, where) {
    const sportsRef = collection(db, "facilities");
    const q = query(sportsRef, where("fname", "==", fname));
  
    try {
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs[0].data().capacity;
      }
      return null;
    } catch (error) {
      console.error("Error fetching capacity:", error);
      return null;
    }
  }
  
  export async function checkAndCreateBooking(user, fname, timeslot, date, db, getDocs, addDoc, collection, query, where) {
    const bookingsRef = collection(db, "bookings");
  
    const userID = user.uid;
    const userName = user.name;
  
    const userQuery = query(bookingsRef, where("userID", "==", userID), where("timeslot", "==", timeslot), where("date", "==", date));
    const facilityQuery = query(bookingsRef, where("fname", "==", fname), where("timeslot", "==", timeslot), where("date", "==", date));
  
    const [userSnap, facilitySnap] = await Promise.all([getDocs(userQuery), getDocs(facilityQuery)]);
  
    if (!userSnap.empty) return { success: false, message: "User already has a booking at this timeslot." };
    if (!facilitySnap.empty) return { success: false, message: "Facility is already booked at this timeslot." };
  
    const bookingRef = await addDoc(bookingsRef, {
      userID,
      userName,
      fname,
      timeslot,
      date,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
  
    return { success: true, message: "Booking successfully created.", bookingID: bookingRef.id };
  }
  
  export function populateTimeslots(selectElement) {
    const slots = generateTimeslots();
    slots.forEach(slot => {
      const option = document.createElement("option");
      option.value = slot;
      option.textContent = slot;
      selectElement.appendChild(option);
    });
  }