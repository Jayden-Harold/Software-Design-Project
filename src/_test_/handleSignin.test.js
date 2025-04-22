import { handleSigninResponse } from "../auth/handleSignin";
import { signInWithCredential } from "firebase/auth";
import { getDoc } from "firebase/firestore";

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
  doc: jest.fn(() => ({})),
}));

describe("handleSigninResponse", () => {
  let originalLocation;

  beforeEach(() => {
    //mock window.location.href
    originalLocation = window.location;
    delete window.location;
    window.location = { href: "" };

    //default mock response from Google
    signInWithCredential.mockResolvedValue({
      user: { uid: "mock-user-id" },
    });
  });

  afterEach(() => {
    window.location = originalLocation;
    jest.clearAllMocks();  //to clear mocks and avoid any clashes
  });

  const mockResponse = {
    credential: "mock-credential",
  };

  const setupRole = (role) => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        name: "Mock User",
        role: role,
      }),
    });
  };

  it("redirects to admin.html if user is admin", async () => {
    setupRole("Admin");
    await handleSigninResponse(mockResponse);
    expect(window.location.href).toBe("../admin.html");
  });

  it("redirects to staff.html if user is staff", async () => {
    setupRole("Staff");
    await handleSigninResponse(mockResponse);
    expect(window.location.href).toBe("../staff.html");
  });

  it("redirects to user.html if user is a resident", async () => {
    setupRole("Resident");
    await handleSigninResponse(mockResponse);
    expect(window.location.href).toBe("../user.html");
  });

  it("alerts if user does not exist", async () => {
    //Mock user and DB not finding the user
    signInWithCredential.mockResolvedValue({ user: { uid: "nonexistent-user" } });
    getDoc.mockResolvedValue({ exists: () => false });
    global.alert = jest.fn();

    await handleSigninResponse(mockResponse);

    expect(alert).toHaveBeenCalledWith("No account found. Please sign up first.");
  });
});
