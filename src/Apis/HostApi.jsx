import axios from "axios";

const API_BASE = "http://localhost:8081/api/host";

async function request(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  
  // Axios uses a configuration object instead of separate parameters like fetch
  const config = {
    method: opts.method || 'get', // Default to GET if not specified
    url: url,
    data: opts.body, // Axios automatically serializes 'data' to JSON
    headers: opts.headers || { "Content-Type": "application/json" },
    // Axios uses 'withCredentials' instead of 'credentials'
    withCredentials: opts.credentials === "same-origin", 
    ...opts, // Spread any other custom options (like 'signal', 'timeout', etc.)
  };

  try {
    // Axios response structure is different: data is in the 'data' property
    const res = await axios(config);
    console.log("res data wdwldwl data: ", res.data);
    return res.data;
  } catch (error) {
    // Axios automatically throws an error for non-2xx responses (like 404, 500)
    // The error object has a 'response' property if one was received from the server
    const err = error.response ? error.response.data : { message: error.message };
    throw err;
  }
}

// Exports
export async function getProperties(userId) {
  return request(`/properties/${userId}`, { method: "GET" });
}
export async function getDeletedProperties(userId) {
  return request(`/properties/deleted/${userId}`, { method: "GET" });
}
export async function getPropertyById(propertyId) {
  console.log(propertyId);
  return request(`/viewPropertyById/${propertyId}`, { method: "GET" });
}
export async function addProperty(payload) {
  return request(`/property`, { method: "POST", body: payload });
}
export async function updateProperty(payload) {
  return request(`/updateProperty`, { method: "PUT", body: payload });
}
export async function deleteProperty(propertyId) {
  return request(`/deleteProperty/${propertyId}`, { method: "DELETE" });
}
export async function getBookings(userId) {
  return request(`/bookings/${userId}`, { method: "GET" });
}

export async function getRevenue(userId) {
  return request(`/revenue/${userId}`, { method: "GET" });
}
