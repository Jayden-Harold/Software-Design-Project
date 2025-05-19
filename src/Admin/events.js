import {collection,query,where,getDocs,addDoc} from "firebase/firestore";

export async function checkAndCreateEvent(db,eventSport, eventName, facilityName, eventDate, startTime, endTime, eventDescription) {
    const eventsRef = collection(db, 'events');
    const facRef = collection(db, 'facilities');
  
    // Check if an event already exists at that time and location
    const eventQuery = query(
      eventsRef,
      where("facilityName", "==", facilityName),
      where("eventDate", "==", eventDate),
      where("startTime", "==", startTime)
    );
    const eventSnap = await getDocs(eventQuery);
    const eventConflict = !eventSnap.empty;
  
    const facQuery = query(facRef, where("fname", "==", facilityName), where("status", "==", "Under Maintenance"));
    const facMaintenance = await getDocs(facQuery);
    const facConflict = !facMaintenance.empty;
  
    // Check if facility is under maintenance
    if (facConflict) {
      return { success: false, message: "Facility is under maintenance." };
    }
  
    // Check for event conflict
    if (eventConflict) {
      return { success: false, message: "An event already exists at this time and location." };
    }
  
    // Add the new event
    const newEventRef = await addDoc(eventsRef, {
      eventSport,
      eventName,
      facilityName,
      eventDate,
      startTime,
      endTime,
      eventDescription,
    });
            
    //create notification
      const notificationsRef = collection(db, "notifications");
          await addDoc(notificationsRef, {
              userID: "all", 
              category: "Events",
              date: new Date().toISOString().split('T')[0], // current date
              description: `Please note ${facilityName} will be unavaliable on the ${eventDate} due to the ${eventName} event.`,
              createdAt: new Date(),// timestamp for sorting
              seenBy:[]
          });
  
    return { success: true, message: "Event successfully created.", eventID: newEventRef.id };
  }