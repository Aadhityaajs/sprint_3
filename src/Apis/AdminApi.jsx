import axios from "axios";

const BASE_URL = "http://localhost:8081/api/admin";

// Fetch all users
export async function getAllUsers(signal = null) {
    const config = signal ? { signal } : {};
    const response = await axios.get(`${BASE_URL}/users`, config);
    return response.data;
}

// Fetch all properties
export async function getAllProperties(signal = null) {
    const config = signal ? { signal } : {};
    const response = await axios.get(`${BASE_URL}/properties`, config);
    return response.data;
}

// Fetch all bookings
export async function getAllBookings(signal = null) {
    const config = signal ? { signal } : {};
    const response = await axios.get(`${BASE_URL}/bookings`, config);
    return response.data;
}

// Block/Unblock user
export async function toggleUserBlock(userId, shouldBlock) {
    const response = await axios.put(`${BASE_URL}/users/${userId}/block`, {
        block: shouldBlock
    });
    return response.data;
}

// Delete property (soft delete)
export async function deleteProperty(propertyId) {
    const response = await axios.delete(`${BASE_URL}/properties/${propertyId}`);
    return response.data;
}

// Close booking
export async function closeBooking(bookingId) {
    const response = await axios.delete(`${BASE_URL}/bookings/${bookingId}`);
    return response.data;
}
