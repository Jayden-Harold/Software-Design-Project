import { JSDOM } from 'jsdom';
import { DisplayPending, denyRequest } from '../booking/user_booking';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../test_utils/firebase.js';

// Mock Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn((db, path) => `collection/${path}`),
  query: jest.fn(() => 'mockQuery'),
  where: jest.fn(() => 'mockWhere'),
  getDocs: jest.fn(),
  doc: jest.fn((db, path, id) => `doc/${path}/${id}`),
  deleteDoc: jest.fn(),
}));

// Mock Firebase db
jest.mock('../test_utils/firebase.js', () => ({
  db: 'mockDb'
}));

describe('Booking Functions', () => {
  let dom;
  let originalConsoleError;

  beforeAll(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();

    dom = new JSDOM(`
      <html>
        <body>
          <table id="bookTable">
            <tbody></tbody>
          </table>
        </body>
      </html>
    `, { url: "http://localhost" });
    
    global.window = dom.window;
    global.document = dom.window.document;
    global.HTMLElement = dom.window.HTMLElement;
    global.confirm = jest.fn();
    global.alert = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    document.body.innerHTML = `
      <table id="bookTable">
        <tbody></tbody>
      </table>
    `;
    jest.clearAllMocks();
  });

  describe('DisplayPending', () => {
    test('should display multiple bookings in the table', async () => {
      const mockData = [
        {
          id: 'booking1',
          data: () => ({
            fname: 'Tennis Court',
            date: '2025-05-10',
            timeslot: '10:00 - 11:00',
            status: 'pending',
            userID: 'user123'
          })
        },
        {
          id: 'booking2',
          data: () => ({
            fname: 'Basketball Court',
            date: '2025-05-11',
            timeslot: '14:00 - 15:00',
            status: 'pending',
            userID: 'user123'
          })
        }
      ];

      // Fix 1: Properly structured mock response
        getDocs.mockResolvedValueOnce({
            forEach: jest.fn(callback => {
            mockData.forEach(doc => {
                callback({
                id: doc.id,
                data: doc.data
                });
            });
            })
        });

        await DisplayPending({ uid: 'user123' });

        const rows = document.querySelectorAll('#bookTable tbody tr');
        expect(rows.length).toBe(2);
      
       //Verify the first row's content
        expect(rows[0].querySelector('td:nth-child(1)').textContent).toBe('Tennis Court');
        expect(rows[0].querySelector('td:nth-child(2)').textContent).toBe('2025-05-10');
        expect(rows[0].querySelector('td:nth-child(3)').textContent).toBe('10:00 - 11:00');
        
        //Verify the second row's content
        expect(rows[1].querySelector('td:nth-child(1)').textContent).toBe('Basketball Court');
        expect(rows[1].querySelector('td:nth-child(2)').textContent).toBe('2025-05-11');
        expect(rows[1].querySelector('td:nth-child(3)').textContent).toBe('14:00 - 15:00');
        console.log("Fetch all bookings for a specific user");
    });

    test('should handle empty results', async () => {
      getDocs.mockResolvedValueOnce({
        forEach: jest.fn() //No calls to callback
      });

      await DisplayPending({uid: 'user123' });

      const rows = document.querySelectorAll('#bookTable tbody tr');
      expect(rows.length).toBe(0);
      console.log("Fetches zero bookings if user has no bookings");
    });

    test('should handle missing table element gracefully', async () => {
      document.body.innerHTML = ''; // No table exists
      
      await expect(DisplayPending({uid: 'user123' })).resolves.not.toThrow();
    });

    test('should filter by userID and status', async () => {
      getDocs.mockResolvedValueOnce({
        forEach: jest.fn(callback => callback({
          id: 'booking1',
          data: () => ({
            fname: 'Tennis Court',
            date: '2025-05-10',
            timeslot: '10:00 - 11:00',
            status: 'pending',
            userID: 'user123'
          })
        }))
      });

      await DisplayPending({ uid: 'user123' });

      // Verify the query was built correctly
      expect(collection).toHaveBeenCalledWith(db, 'bookings');
      expect(where).toHaveBeenCalledWith('userID', '==', 'user123');
      expect(where).toHaveBeenCalledWith('status', '==', 'pending');
      expect(query).toHaveBeenCalled();
      console.log("Fetch bookings and filter by user id and status of bookigns");
    });
  });

  describe('denyRequest', () => {
    test('should delete booking when confirmed', async () => {
      global.confirm.mockReturnValueOnce(true);
      const mockRow = document.createElement('tr');
      document.body.querySelector('#bookTable tbody').appendChild(mockRow);

      await denyRequest('booking1', mockRow);

      expect(confirm).toHaveBeenCalled();
      expect(deleteDoc).toHaveBeenCalledWith('doc/bookings/booking1');
      expect(mockRow.parentNode).toBeNull(); //Row should be removed
      expect(alert).toHaveBeenCalledWith('Booking cancelled successfully.');
      console.log("User can cancel booking successfully");
    });

  

    test('should handle delete errors', async () => {
      global.confirm.mockReturnValueOnce(true);
      const mockRow = document.createElement('tr');
      document.body.querySelector('#bookTable tbody').appendChild(mockRow);
      const error = new Error('Delete failed');
      deleteDoc.mockRejectedValueOnce(error);

      await denyRequest('booking1', mockRow);

      expect(deleteDoc).toHaveBeenCalled();
      expect(alert).toHaveBeenCalledWith('An error occurred while cancelling the booking.');
      expect(console.error).toHaveBeenCalledWith('Error cancelling booking:', error);
      console.log("Error if there's an error cancelling a booking");
    });
  });
});