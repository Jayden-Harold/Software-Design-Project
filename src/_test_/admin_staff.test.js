document.body.innerHTML = `
  <table id="userTable"><tbody></tbody></table>
  <table id="approvedTable"><tbody></tbody></table>`
;
jest.mock("../test_utils/firebase.js", () => ({
    db: {},
    auth: {}
  }));
  
jest.mock("firebase/firestore", () => ({
    updateDoc: jest.fn(),
    getDocs: jest.fn(),
    doc: jest.fn(() => ({})),
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
}));
const { approveStaff, moveStaffToApproved } = require ( "../Admin/admin_staff");

describe("approveStaff", () => {
  const mockDoc = jest.fn();
  const mockUpdateDoc = require("firebase/firestore").updateDoc;

  beforeEach(() => {
    document.body.innerHTML = `<table id="userTable"><tbody></tbody></table>
      <table id="approvedTable"><tbody></tbody></table>
    `;
  });

  it("approves a staff member and moves them to the approved staff table", async () => {
    const mockrow = document.createElement("tr");  //table row
    document.body.appendChild(mockrow);

    const mockUser = {
      name: "John Smith",
      createdAt: { toDate: () => new Date("2024-04-01T12:00:00Z") },
    };

    const docId = "Staff-1234";

    await approveStaff(docId, mockUser, mockrow);
    expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(),{ 
        status: "approved" });

    setTimeout(() => {
        console.log("Approved table rows: ", approvedTable.children);
        
        expect(approvedTable.children.length).toBe(1); //Check if 1 row is added
  
        expect(approvedTable.children[0].textContent).toContain("John Smith"); //Check if the row contains the user's name
      }, 100);
  });
});
