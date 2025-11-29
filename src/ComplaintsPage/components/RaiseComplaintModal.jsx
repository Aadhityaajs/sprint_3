// src/complaints/components/RaiseComplaintModal.jsx
import React, { useEffect, useState } from 'react';
import { HOST_COMPLAINT_DESCRIPTIONS, CLIENT_COMPLAINT_DESCRIPTIONS } from '../../data';
import { getEligibleBookings } from '../../Apis/complaintsApi';

export default function RaiseComplaintModal({ form, setForm, errors, onSubmit, onClose, userRole }) {
  const descriptions = userRole === 'client' ? CLIENT_COMPLAINT_DESCRIPTIONS : HOST_COMPLAINT_DESCRIPTIONS;
  const [bookingIds, setBookingIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch eligible bookings when modal opens
    const fetchBookings = async () => {
      console.log("=== FETCHING ELIGIBLE BOOKINGS ===");
      const sessionData = sessionStorage.getItem("currentUser");

      if (sessionData) {
        const currentUser = JSON.parse(sessionData);
        console.log("Calling API with role:", currentUser.role, "userId:", currentUser.userId);

        const result = await getEligibleBookings(currentUser.role, currentUser.userId);
        console.log("API result:", result);

        if (result.success) {
          setBookingIds(result.bookingIds || []);
        } else {
          console.error("API returned error:", result);
        }
      } else {
        console.error("No session data found!");
      }
      setLoading(false);
    };

    fetchBookings();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white p-5 rounded-xl min-w-[320px] max-w-[520px] shadow-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Register Complaint</h2>

        <form onSubmit={onSubmit} className="block">
          <label className="block mb-2.5">
            Booking ID
            <select
              className="w-full p-2 rounded-md border border-gray-400 bg-white text-gray-600 mt-1"
              value={form.bookingId}
              onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
              disabled={loading}
            >
              <option value="">{loading ? 'Loading bookings...' : 'Select booking'}</option>
              {bookingIds.map((id) => (
                <option key={id} value={id}>Booking Id {id}</option>
              ))}
            </select>
            {errors.bookingId && <div className="text-red-600 text-xs mt-1.5">{errors.bookingId}</div>}
          </label>

          <label className="block mb-2.5">
            User ID
            <input
              className="w-full p-2 rounded-md border border-gray-400 bg-white text-gray-600 mt-1"
              value={form.userId}
              readOnly
            />
          </label>

          <label className="block mb-2.5">
            Description
            <select
              className="w-full p-2 rounded-md border border-gray-400 bg-white text-gray-600 mt-1"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            >
              <option value="">Select description</option>
              {descriptions.map((d, i) => <option key={i} value={d}>{d}</option>)}
            </select>
            {errors.description && <div className="text-red-600 text-xs mt-1.5">{errors.description}</div>}
          </label>

          <div className="flex gap-2 justify-end mt-3">
            <button type="button" className="bg-gray-500 border border-gray-300 p-2 px-3 rounded-lg text-white cursor-pointer hover:bg-gray-600" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-600 text-white border-0 p-2 px-3 rounded-lg cursor-pointer hover:bg-blue-700">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
