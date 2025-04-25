document.body.innerHTML = `
  <table id="userTable"><tbody></tbody></table>
  <table id="approvedTable"><tbody></tbody></table>`
;
const { approveResident, moveResToApproved } = require ("../Admin/admin_resident");

jest.mock("firebase/firestore", () => ({
getFirestore: jest.fn(() => ({})),
getDocs: jest.fn(),
updateDoc: jest.fn(),
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



