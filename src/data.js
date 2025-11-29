// src/complaints/data.js
export const HOST_COMPLAINT_DESCRIPTIONS = [
  'Guest caused property damage',
  'Guest violated house rules',
  'Guest exceeded maximum occupancy',
  'Guest created excessive noise disturbance',
  'Guest brought unauthorized pets',
  'Guest held unauthorized party or event',
  'Guest left property in unsanitary condition',
  'Guest refused to vacate after checkout time',
  'Guest engaged in illegal activities',
  'Guest provided false information during booking'
];

export const CLIENT_COMPLAINT_DESCRIPTIONS = [
  'Property did not match listing description',
  'Property was unclean or unsanitary',
  'Essential amenities were not available',
  'Property had safety or security issues',
  'Host failed to provide access on check-in',
  'Host entered property without permission',
  'Host was unresponsive to communication',
  'Property had pest or insect infestation',
  'Neighborhood was unsafe or misrepresented',
  'Host cancelled booking last minute'
];

export const SAMPLE_BOOKINGS = [
  { id: 1, label: 'Booking Id 1' },
  { id: 2, label: 'Booking Id 2' },
  { id: 3, label: 'Booking Id 3' },
  { id: 4, label: 'Booking Id 4' }
];

export const INITIAL_COMPLAINTS = [
  {
    id: 1,
    bookingId: 1,
    userId: 1,
    createdOn: '2025-11-24',
    status: 'Active',
    resolutionOn: '-',
    description: 'Property did not match listing description',
    clientOrHost: 'CLIENT'
  },
  {
    id: 2,
    bookingId: 2,
    userId: 2,
    createdOn: '2025-11-20',
    status: 'Closed',
    resolutionOn: '2025-11-22',
    description: 'Guest created excessive noise disturbance',
    clientOrHost: 'HOST'
  },
  {
    id: 3,
    bookingId: 3,
    userId: 3,
    createdOn: '2025-11-10',
    status: 'Active',
    resolutionOn: '-',
    description: 'Host was unresponsive to communication',
    clientOrHost: 'CLIENT'
  },
  {
    id: 4,
    bookingId: 4,
    userId: 4,
    createdOn: '2025-10-30',
    status: 'Deleted',
    resolutionOn: '-',
    description: 'Guest refused to vacate after checkout time',
    clientOrHost: 'HOST'
  }
];
