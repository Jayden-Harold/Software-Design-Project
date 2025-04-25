document.body.innerHTML = `
  <table id="userTable"><tbody></tbody></table>
  <table id="approvedTable"><tbody></tbody></table>`
;
const { approveResident, moveResToApproved,denyRequest } = require ("../Admin/admin_resident");
const { deleteDoc, doc } = require("firebase/firestore");


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

    });
});
//denying:
describe("denyRequest", () => {
  const { deleteDoc, doc } = require("firebase/firestore");

  let rowElement;
  const docId = "User-5678";

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

    await denyRequest(docId, rowElement);

    expect(doc).toHaveBeenCalledWith(expect.anything(), "users", docId);
    expect(deleteDoc).toHaveBeenCalledWith(expect.anything());
    expect(alert).toHaveBeenCalledWith("Request denied and record deleted successfully.");
    expect(document.getElementById("row-1")).toBeNull();
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

    await denyRequest(docId, rowElement);

    expect(alert).toHaveBeenCalledWith("An error occurred while denying the request.");
    expect(document.getElementById("row-1")).not.toBeNull();
  });
});



