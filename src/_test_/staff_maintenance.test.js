//mock Firebase imports first to avoid the "getAuth" error
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({ currentUser: { uid: "user123" } })),
  onAuthStateChanged: jest.fn((auth, callback) => callback({ uid: "user123" })),
}));

jest.mock("../test_utils/firebase.js", () => ({
  auth: { currentUser: { uid: "user123" } },
  db: {},
  onAuthStateChanged: jest.fn(),
  getAuth: jest.fn(() => ({ currentUser: { uid: "user123" } })),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  setDoc: jest.fn(),
}));

//then import after mocks
import { DisplayStaffReports } from "../Maintenance/staff_maintenance";
import * as firestore from "firebase/firestore";
import { auth } from "../test_utils/firebase.js";

describe("DisplayStaffReports", () => {
  const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    document.body.innerHTML = `<table id="staffTable"><tbody></tbody></table>`;
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockAlert.mockRestore();
    mockConsoleError.mockRestore();
  });

 it("should load staff reports", async () => {  
    jest.setTimeout(10000); //setting longer timeout for this test

    firestore.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({name: "Lydia Smith"})
    });

    //mock maintenance reports
    const mockReport = {
      id: "report1",
      data: () => ({
        facility: "Cricket net 1",
        category: "Equipment",
        description: "Cricket bats are broken",
        Status: "Assigned",
        assignedTo: "Lydia Smith",
        ReportedDate: {toDate: () => new Date("2024-01-01")},
        workload: 1
      }),
      ref: {id: "report1"}
    };

    firestore.getDocs.mockResolvedValueOnce({
      docs: [mockReport],
      forEach: function(callback) {
        this.docs.forEach(callback);
      }
    });

    firestore.getDocs.mockResolvedValueOnce({
      docs: [],
      forEach: function(callback) {
        this.docs.forEach(callback); //mock query
      }
    });

    await DisplayStaffReports();
    
    const rows = document.querySelectorAll("#staffTable tbody tr");
    expect(rows.length).toBe(1);
    console.log("Checks if it loads staff maintenance reports assigned to a staff");
  }, 10000); // Set timeout for this specific test

  it("staff updates status to Complete", async () => {
  firestore.getDoc.mockResolvedValue({ 
    exists:() => true, 
    data:() => ({name: "Test User" }) 
  });

  firestore.getDocs
    .mockResolvedValueOnce({
      docs: [{
        id: "1",
        data: () => ({ Status: "In Progress" }),
        ref: {id: "1"}
      }],
      forEach: function(cb) { this.docs.forEach(cb) }
    })
    .mockResolvedValueOnce({docs:[]});

  firestore.updateDoc.mockResolvedValue();

  await DisplayStaffReports();
  
  const select = document.querySelector("select");
  select.value = "Complete";
  select.dispatchEvent(new Event("change"));
  
  await new Promise(resolve => setTimeout(resolve, 100));
  expect(firestore.updateDoc).toHaveBeenCalled();
  console.log("Checks what happens if staff updates status to complete");
});

  /*it("should handle status change to Complete", async () => {
    // Set longer timeout for this test
    jest.setTimeout(25000);

    const reportedDate = new Date("2024-01-01T12:00:00Z");
    const now = new Date("2024-01-03T12:00:00Z");
    jest.useFakeTimers().setSystemTime(now);

    // Mock user document
    firestore.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ name: "Lydia Smith" })
    });

    // Mock maintenance reports
    const mockReport = {
      id: "report1",
      data: () => ({
        facility: "Cricket net 1",
        category: "Equipment",
        description: "Cricket bats are broken",
        Status: "In Progress",
        assignedTo: "Lydia Smith",
        workload: 1,
        ReportedDate: { toDate: () => reportedDate }
      }),
      ref: { id: "report1" }
    };

    firestore.getDocs.mockResolvedValueOnce({
      docs: [mockReport],
      forEach: function(callback) {
        this.docs.forEach(callback);
      }
    });

    // Mock facilities
    const mockFacility = {
      id: "facility1",
      ref: { id: "facility1" },
      data: () => ({ fname: "Cricket net 1", status: "under maintenance" })
    };

    firestore.getDocs.mockResolvedValueOnce({
      docs: [mockFacility],
      forEach: function(callback) {
        this.docs.forEach(callback);
      }
    });

    // Mock staff performance
    firestore.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        ResolvedIssues: 2,
        resolutionTime: 4,
        CurrWorkload: 3
      })
    });

    // Mock update operations
    firestore.updateDoc.mockImplementation(() => Promise.resolve());
    firestore.setDoc.mockImplementation(() => Promise.resolve());

    await DisplayStaffReports();

    // Find the select element
    const select = document.querySelector("#staffTable select");
    if (!select) {
      throw new Error("Select element not found in table");
    }

    // Change status to Complete
    select.value = "Complete";
    select.dispatchEvent(new Event("change"));

    // Wait for all async operations to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify updates
    expect(firestore.updateDoc).toHaveBeenCalledTimes(3);
    expect(mockAlert).toHaveBeenCalledWith('Status updated to "Complete"');

    jest.useRealTimers();
  }, 15000); // Set timeout for this specific test */

  
});