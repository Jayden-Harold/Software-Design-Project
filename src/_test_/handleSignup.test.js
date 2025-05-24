/*import { handleSignupResponse } from "../auth/handleSignup";
import { signInWithCredential } from "firebase/auth";
import { getDoc,setDoc } from "firebase/firestore"; */
const { handleSignupResponse } = require("../auth/handleSignup");
const { signInWithCredential } = require("firebase/auth");
const { getDoc, setDoc } = require("firebase/firestore");

global.alert = jest.fn(); // mock global alert

//all necessary mocks needed:
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  signInWithCredential: jest.fn(),
  GoogleAuthProvider: {
    credential: jest.fn(),
  },
}));

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  doc: jest.fn(() => ({})),
}));

describe("handleSignupResponse", () => {
  let originalLocation;

  beforeEach(() => {
    //mock window.location.href
    originalLocation = window.location;
    delete window.location;
    window.location = { href: "" };

    //mock user
    signInWithCredential.mockResolvedValue({
        user: {
            uid: "mock-user-id",
            displayName: "Mock User",
            email: "mock@example.com",
          },
    });

    //mock selected role from dropdown
    document.body.innerHTML = `<select id="signup"><option value="Staff" selected>Staff</option></select>`;
  });

  afterEach(() => {
    window.location = originalLocation;
    jest.clearAllMocks();  //to clear mocks and avoid any clashes
  });

  const mockResponse = {
    credential: "mock-credential",
  };

  

  it("redirects to staff.html if user selected the staff role", async () => {
    getDoc.mockResolvedValue({ exists: () => false });
    await handleSignupResponse(mockResponse);
    expect(window.location.href).toBe("../staff.html");
    console.log("Redirect to staff page when selected role is staff when signing up");
  });

  it("redirects to user.html if user selected the resident role", async () => {
    document.body.innerHTML = `<select id="signup"><option value="Resident" selected>Resident</option></select>`;
    getDoc.mockResolvedValue({ exists: () => false });
    await handleSignupResponse(mockResponse);
    expect(window.location.href).toBe("../user.html");
    console.log("Redirect to residents page when selected role is resident when signing up");
  });

  it("Alerts if the user already exists", async () => {
    document.body.innerHTML = `<select id="signup"><option value="Staff" selected>Staff</option></select>`;
    getDoc.mockResolvedValue({ exists: () => true });
     await handleSignupResponse(mockResponse);
    expect(alert).toHaveBeenCalledWith("User already exists. Try signing in.");
    //expect(alert).toHaveBeenCalledWith("Checking if it fails");   //this is to check if ever fails : it does work
    console.log("Alert a user if they already have an account. ")
  });
});
