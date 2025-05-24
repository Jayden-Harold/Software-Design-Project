document.body.innerHTML = `<table id="userTable"><tbody></tbody></table>
  <table id="approvedTable"><tbody></tbody></table>`;
const { approveResident, moveResToApproved,denyRequest,DisplayResApproved } = require ("../Admin/admin_resident");
const { deleteDoc, doc,getDocs,collection,query, where } = require("firebase/firestore");


jest.mock("firebase/firestore", () => ({
getFirestore: jest.fn(() => ({})),
getDocs: jest.fn(),
updateDoc: jest.fn(),
deleteDoc: jest.fn(),
doc: jest.fn(() => ({})),
collection: jest.fn(),
query: jest.fn(),
where: jest.fn(),
}));


describe("approveResident", () => {
    const mockDoc = jest.fn();
    const mockUpdateDoc = require("firebase/firestore").updateDoc;
  
    beforeEach(() => {
      document.body.innerHTML = `<table id="userTable"><tbody></tbody></table>
      <table id="approvedTable"><tbody></tbody></table>`;
    });


    it ( "Aprroves a resident and moves them to the approved users table", async () =>{
        const mock_row= document.createElement ("tr");  //table row
        document.body.appendChild (mock_row);

        const mockUser = {
            name: "John Smith",
            createdAt: { toDate: () => new Date("2024-04-01T12:00:00Z") },
        };
    
        const docId = "User-1234";
        
        await approveResident(docId, mockUser, mock_row);
        expect( mockUpdateDoc).toHaveBeenCalledWith(expect.anything(),{
            status: "approved",
        });

        setTimeout(() => {
          console.log("Approved table rows: ", approvedTable.children);
          
          expect(approvedTable.children.length).toBe(1); //Check if 1 row is added
    
          expect(approvedTable.children[0].textContent).toContain("John Smith"); //Check if the row contains the user's name
        }, 100);
        console.log("Approved resident is moved to residents table succesfully");
    });
});
//denying:
describe("denyRequest", () => {
  const { deleteDoc, doc } = require("firebase/firestore");

  let rowElement;
  const docId = "User-5678";
  deleteDoc.mockResolvedValue();

  beforeEach(() => {
    document.body.innerHTML = `
      <table><tbody><tr id="row-1"><td>User</td></tr></tbody></table>
    `;
    rowElement = document.getElementById("row-1");

    // Reset mocks
    jest.clearAllMocks();

    // Mock confirm and alert
    global.confirm = jest.fn();
    global.alert = jest.fn();
  });

  it("deletes the doc and removes the row when confirmed", async () => {
    confirm.mockReturnValue(true);
    let mockDb={}; //mock db


    await denyRequest(mockDb,docId, rowElement);

    expect(doc).toHaveBeenCalledWith(mockDb, "users", docId);
    expect(deleteDoc).toHaveBeenCalledWith(expect.anything());
    expect(alert).toHaveBeenCalledWith("Request denied and record deleted successfully.");
    expect(document.getElementById("row-1")).toBeNull();
    console.log("Removes resident if they're role request is denied");
  });

  it("does nothing if user cancels", async () => {
    confirm.mockReturnValue(false);

    await denyRequest(docId, rowElement);

    expect(deleteDoc).not.toHaveBeenCalled();
    expect(alert).not.toHaveBeenCalled();
    expect(document.getElementById("row-1")).not.toBeNull();
  });

  it("shows error if deleteDoc fails", async () => {
    confirm.mockReturnValue(true);
    deleteDoc.mockRejectedValue(new Error("Firebase error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {}); //remove this and the last line to show console error

    await denyRequest(docId, rowElement); 

    expect(alert).toHaveBeenCalledWith("An error occurred while denying the request.");
    expect(document.getElementById("row-1")).not.toBeNull();
    consoleSpy.mockRestore(); // Clean up after test
    console.log("Returns error if firestore fails");
  });
});

//Displaying approved residents test:
describe("DisplayResApproved", () => {
  let mockDb;
  let approvedTableBody;

  beforeEach(() => {
    document.body.innerHTML = `
    <table id="approvedTable"><tbody></tbody></table>`;
    approvedTableBody = document.querySelector("#approvedTable tbody");

    mockDb = {}; //mock db
    jest.clearAllMocks();
    collection.mockReturnValue("mockCollection");
    query.mockReturnValue("mockQuery");
    where.mockReturnValue("mockWhere");
  });

  afterEach(() => {
    document.body.innerHTML = ""; //Clean up DOM
  });

  it("Clears the table and adds approved residents", async () => {
    const mockDocs = [
      {
        id: "1",
        data: () => ({
          name: "John English",
          createdAt: {
            toDate: () => new Date("2023-01-01T10:00:00Z")
          },
        }),
      },
      {
        id: "2",
        data: () => ({
          name: "Jane Smith",
          createdAt: {
            toDate: () => new Date("2023-01-02T12:30:00Z")
          },
        }),
      },
    ];

    getDocs.mockResolvedValue({
      forEach: (cb) => mockDocs.forEach((doc) => cb({
        data: () => doc.data(),})),
    });

    approvedTableBody.innerHTML = "<tr><td>Old Data</td></tr>";
    await DisplayResApproved();
    expect(approvedTableBody.querySelectorAll("tr").length).toBe(2); //ensure it resets

    const rows = approvedTableBody.querySelectorAll("tr");
    expect(rows.length).toBe(2); //Check rows appended
    expect(rows[0].textContent).toContain("John English");
    expect(rows[1].textContent).toContain("Jane Smith");
    console.log("Fetches approved staff members for display");
  });

  it("handles no approved residents", async () => {
    getDocs.mockResolvedValue({
      forEach: () => {}, // No documents
    });

    await DisplayResApproved();
    expect(approvedTableBody.children.length).toBe(0); //to be empty
     console.log("staff table is empty if there's no approved staff");
  });

  it("logs error on failure", async () => {
    console.error = jest.fn();

    getDocs.mockRejectedValue(new Error("Firestore error"));

    await DisplayResApproved();
    expect(console.error).toHaveBeenCalledWith("Error fetching approved residents:", expect.any(Error));
    console.log("Returns error if there's an error fetching residents");
  });
});



