const {generateTimeslots,getCapacityBySport,checkAndCreateBooking,} = require ("../booking/bookings");
  
  describe("generateTimeslots", () => {
    it("should generate timeslots from 8 to 20", () => {
      const result = generateTimeslots();
      expect(result[0]).toBe("08:00–09:00");
      expect(result[result.length - 1]).toBe("19:00–20:00");
      expect(result.length).toBe(12);
    });
  
    it("should generate custom range", () => {
      const result = generateTimeslots(10, 12);
      expect(result).toEqual(["10:00–11:00", "11:00–12:00"]);
    });
  });
  
  describe("getCapacityBySport", () => {
    it("returns capacity when a match is found", async () => {
      const mockDocs = [{ data: () => ({ capacity: 25 }) }];
      const mockSnapshot = { empty: false, docs: mockDocs };
  
      const getDocs = jest.fn().mockResolvedValue(mockSnapshot);
      const collection = jest.fn();
      const query = jest.fn();
      const where = jest.fn();
  
      const result = await getCapacityBySport("Basketball", {}, getDocs, collection, query, where);
      expect(result).toBe(25);
    });
  
    it("returns null when no match is found", async () => {
      const getDocs = jest.fn().mockResolvedValue({ empty: true });
      const collection = jest.fn();
      const query = jest.fn();
      const where = jest.fn();
  
      const result = await getCapacityBySport("Curling", {}, getDocs, collection, query, where);
      expect(result).toBeNull();
    });
  });
  
  describe("checkAndCreateBooking", () => {
    const user = { uid: "user123", name: "Jane Doe" };
    const db = {};
    const bookingsRef = "mockCollectionRef";
  
    const collection = jest.fn().mockReturnValue(bookingsRef);
    const query = jest.fn().mockImplementation((...args) => args.join("|"));
    const where = jest.fn((field, op, value) => `${field}-${op}-${value}`);
  
    it("returns conflict if user already booked", async () => {
      const getDocs = jest.fn()
        .mockResolvedValueOnce({ empty: false }) // user conflict
        .mockResolvedValueOnce({ empty: true });
  
      const addDoc = jest.fn();
  
      const result = await checkAndCreateBooking(
        user, "Gym", "10:00–11:00", "2025-04-26",
        db, getDocs, addDoc, collection, query, where
      );
  
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/User already has a booking/i);
      expect(addDoc).not.toHaveBeenCalled();
    });
  
    it("returns conflict if facility already booked", async () => {
      const getDocs = jest.fn()
        .mockResolvedValueOnce({ empty: true }) // user no conflict
        .mockResolvedValueOnce({ empty: false }); // facility conflict
  
      const addDoc = jest.fn();
  
      const result = await checkAndCreateBooking(
        user, "Gym", "10:00–11:00", "2025-04-26",
        db, getDocs, addDoc, collection, query, where
      );
  
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/Facility is already booked/i);
      expect(addDoc).not.toHaveBeenCalled();
    });
  
    it("creates booking if no conflicts", async () => {
      const getDocs = jest.fn()
        .mockResolvedValueOnce({ empty: true })
        .mockResolvedValueOnce({ empty: true });
  
      const addDoc = jest.fn().mockResolvedValue({ id: "new-booking-id" });
  
      const result = await checkAndCreateBooking(
        user, "Gym", "10:00–11:00", "2025-04-26",
        db, getDocs, addDoc, collection, query, where
      );
  
      expect(result.success).toBe(true);
      expect(result.message).toMatch(/Booking successfully created/i);
      expect(result.bookingID).toBe("new-booking-id");
      expect(addDoc).toHaveBeenCalled();
    });
  });  