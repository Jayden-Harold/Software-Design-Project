import {collection,query,where,getDocs,addDoc} from "firebase/firestore";
import { checkAndCreateEvent } from "../Admin/events.js";

// Mocks
const mockCollection = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();
const mockGetDocs = jest.fn();
const mockAddDoc = jest.fn();

jest.mock("firebase/firestore", () => ({
  collection: (...args) => mockCollection(...args),
  query: (...args) => mockQuery(...args),
  where: (...args) => mockWhere(...args),
  getDocs: (...args) => mockGetDocs(...args),
  addDoc: (...args) => mockAddDoc(...args),
}));

const db = {}; // dummy Firestore db object

describe("checkAndCreateEvent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns maintenance conflict", async () => {
    mockGetDocs
      .mockResolvedValueOnce({ empty: true })   // no event conflict
      .mockResolvedValueOnce({ empty: false }); // under maintenance

    const result = await checkAndCreateEvent({
      db,
      eventSport: "Basketball",
      eventName: "Championship",
      facilityName: "Court A",
      eventDate: "2025-05-20",
      startTime: "10:00",
      endTime: "12:00",
      eventDescription: "Final game"
    });

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/under maintenance/i);
  });

  it("returns event conflict", async () => {
    mockGetDocs
      .mockResolvedValueOnce({ empty: false }) // event exists
      .mockResolvedValueOnce({ empty: true }); // no maintenance

    const result = await checkAndCreateEvent({
      db,
      eventSport: "Football",
      eventName: "Semis",
      facilityName: "Stadium A",
      eventDate: "2025-06-01",
      startTime: "14:00",
      endTime: "16:00",
      eventDescription: "Semifinal match"
    });

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/already exists/i);
  });

  it("creates event and notification", async () => {
    mockGetDocs
      .mockResolvedValueOnce({ empty: true }) // no event
      .mockResolvedValueOnce({ empty: true }); // no maintenance

    mockAddDoc.mockResolvedValueOnce({ id: "event123" }); // add event
    mockAddDoc.mockResolvedValueOnce({}); // add notification

    const result = await checkAndCreateEvent({
      db,
      eventSport: "Tennis",
      eventName: "Final",
      facilityName: "Court 2",
      eventDate: "2025-06-15",
      startTime: "10:00",
      endTime: "12:00",
      eventDescription: "Championship round"
    });

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/successfully created/i);
    expect(result.eventID).toBe("event123");
  });
});
