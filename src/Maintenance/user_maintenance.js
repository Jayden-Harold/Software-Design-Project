import { collection, query, where, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../test_utils/firebase.js";

// function to fetch and disply facilities
export async function populateFacilities(facilitySelect) {
  facilitySelect.innerHTML = '<option value="" disabled selected>Loading...</option>';

  try {
    const facilitiesRef = collection(db, "facilities");
    const q = query(facilitiesRef);
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
}

// function to submit a maintenance issue
export async function submitMaintenanceIssue(selectedFac, selectedCat, GivenDesc) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please sign in.");
    return;
  }

  try {
    await addDoc(collection(db , "Maintenance"), {
      facility: selectedFac,
      category: selectedCat,
      description: GivenDesc,
      assignedTo: "TBD",
      Status: "Reported",
      ReportedDate: new Date(),
      ResolvedDate: "N/A",
      resolutionTime: "N/A",
    });

    await addDoc(collection(db, "notifications"), {
      userID: "all", 
      category: "Maintenance",
      date: new Date().toISOString().split('T')[0],
      description: `Please note ${selectedFac} is currently under maintenance.`,
      createdAt: new Date(),
      seenBy: [],
    });

    const q = query(collection(db, "facilities"), where("fname", "==", selectedFac));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      for (const facilityDoc of querySnapshot.docs) {
        await updateDoc(facilityDoc.ref, { status: "Under Maintenance" });
      }
    } else {
      console.error("No facility found with the given Facility name:", selectedFac);
    }

    alert("Issue reported succesfully.");
  } catch (error) {
    console.error("Error submitting report:", error);
    alert("Failed to submit report. Try again.");
  }
}
