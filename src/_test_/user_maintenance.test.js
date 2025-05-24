import { populateFacilities, submitMaintenanceIssue } from "../Maintenance/user_maintenance";
import { collection, getDocs, addDoc, updateDoc, query, where } from "firebase/firestore";
import { auth, db } from "../test_utils/firebase.js";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

jest.mock("../test_utils/firebase.js", () => ({
  db: {},
  auth: { currentUser:{ uid: "user123" } },
}));

describe("populateFacilities", () => {
  let select;

  beforeEach(() => {
    document.body.innerHTML = `<select id="facility_1"></select>`;
    select = document.getElementById("facility_1");
  });

  it("populates facilities in the dropdown", async () => {
    getDocs.mockResolvedValueOnce({
      empty: false,
      forEach: (cb) =>
        ["Padel court 1", "Cricket net 1"].forEach(name =>
          cb({ data: () => ({ fname: name }) })
        ),
    });

    await populateFacilities(select);
    expect(select.children[1].textContent).toBe("Padel court 1");
    expect(select.children[2].textContent).toBe("Cricket net 1");
    console.log("Facilities populated correctly when reporting a maintenance issue.");
  });

 

  
});

describe("submitMaintenanceIssue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
  });


  it("submits issue and updates facility", async () => {
    auth.currentUser = { uid: "testUser" };
    const mockDoc = { ref: "docRef" };

    getDocs.mockResolvedValueOnce({ empty: false, docs: [mockDoc] });

    await submitMaintenanceIssue("Basketball court", "Infrastructure", "Holes in fence");

    expect(addDoc).toHaveBeenCalledTimes(2);
    expect(updateDoc).toHaveBeenCalledWith("docRef", { status: "Under Maintenance" });
    expect(alert).toHaveBeenCalledWith("Issue reported succesfully.");
    console.log("Maintenance issue submitted and facility status updated successfully.")
  });

  it("alerts error on failure", async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    auth.currentUser = { uid: "testUser" };
    addDoc.mockRejectedValueOnce(new Error("Error"));
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    await submitMaintenanceIssue("Soccer field 1", "Infrastructure", "grass is too long");
    expect(alertSpy).toHaveBeenCalledWith("Failed to submit report. Try again.");
    expect(errorSpy).toHaveBeenCalledWith("Error submitting report:", expect.any(Error));
    console.log("error was handled when maintenance report submission failed");
  });
});
