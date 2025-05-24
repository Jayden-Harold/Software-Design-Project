import {displayBookingStats} from '../booking/BookingStats';

describe('Test booking statistics functionality', () => {
  it('Return 0 bookings and empty facility if input is empty', () => {
    const result = displayBookingStats([]);
    expect(result).toEqual({totalBookings: 0, mostPopularFacility:'' });
    console.log("Output 0 bookings and empty facility if the input is empty");
  });

  it('Count only approved bookings', () => {
    const data = [
      {fname:'Padel Court 1', status:'approved'},
      {fname:'Hockey field 2', status:'pending'},
      {fname:'Padel Court 1', status:'approved'},
    ];
    const result = displayBookingStats(data);
    expect(result).toEqual({totalBookings: 2, mostPopularFacility: 'Padel Court 1'});
    console.log("Counts approved bookings successfully");
  });

  it('Ignores any bookings without a facility name', () => {
    const data = [
      { status: 'approved'},
      {fname: '', status: 'approved'},
      {fname: 'Netball Court 1', status: 'approved'},
    ];
    const result = displayBookingStats(data);
    expect(result).toEqual({totalBookings: 1, mostPopularFacility: 'Netball Court 1' });
    
  });
});
