//same as user_bookings.js
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../test_utils/firebase.js";

//const userTableBody = document.querySelector("#bookTable")?.getElementsByTagName("tbody")[0];

export async function DisplayPending(user) {
  try {
    const userTableBody = document.querySelector("#bookTable tbody");
    const bookRef = collection(db, "bookings");
    const userID = user.uid;

    const q = query(bookRef, where("userID", "==", userID ), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);

    //Clear existing rows first
    if (userTableBody) {
        userTableBody.innerHTML = '';
    }

    querySnapshot.forEach((docSnap) => {
      const bookData = docSnap.data();
      const { fname, date, timeslot, status } = bookData;

      const row = document.createElement("tr");

      const fCell = document.createElement("td");
      fCell.textContent = fname;

      const dateCell = document.createElement("td");
      dateCell.textContent = date;

      const timeCell = document.createElement("td");
      timeCell.textContent = timeslot;

      const statusCell = document.createElement("td");
      statusCell.textContent = status;

      const actionCell = document.createElement("td");

      const denyBtn = document.createElement("button");
      denyBtn.textContent = "CANCEL";
      denyBtn.className = "btn-deny";
      denyBtn.addEventListener("click", () => denyRequest(docSnap.id, row));

      actionCell.appendChild(denyBtn);

      row.appendChild(fCell);
      row.appendChild(dateCell);
      row.appendChild(timeCell);
      row.appendChild(statusCell);
      row.appendChild(actionCell);

      userTableBody?.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
  }
}

export async function denyRequest(docId, rowElement) {
  const confirmation = confirm("Are you sure you want to cancel this booking? This action cannot be undone.");
  if (!confirmation) return;

  try {
    const bookDocRef = doc(db, "bookings", docId);
    await deleteDoc(bookDocRef);
    alert("Booking cancelled successfully.");
    rowElement.remove();
  } catch (error) {
    console.error("Error cancelling booking:", error);
    alert("An error occurred while cancelling the booking.");
  }
}
