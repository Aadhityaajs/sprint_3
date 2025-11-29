import axios from "axios";

const BASE_URL = "http://localhost:8081/api/complaints";

function headers(role, userId) {
  return {
    "Content-Type": "application/json",
    "x-user-role": role.toUpperCase(),
    "x-user-id": String(userId)
  };
}

/* ---------------------------------------------------
   GET ALL - fix backend keys → React-friendly keys
---------------------------------------------------- */
export async function getAllComplaints(role, userId) {
  try {
    const response = await axios.get(BASE_URL, { headers: headers(role, userId) });
    const data = response.data;
    console.log(data);

    // Handle both array response or object with complaints key
    const rawComplaints = Array.isArray(data) ? data : (data.complaints || []);


    const fixed = rawComplaints.map(c => {
      const statusLower = (c.complaintStatus || "").toLowerCase();
      let status = "Closed";
      if (statusLower === "active") status = "Active";
      else if (statusLower === "deleted") status = "Deleted";

      return {
        id: c.complaintId,
        bookingId: c.bookingId,
        userId: c.userId,
        clientOrHost: c.clientOrHost,
        description: c.complaintDescription,
        status: status,
        createdOn: c.createdOn,
        resolvedOn: c.resolvedOn
      };
    });
    console.log("Loaded complaints:", fixed);
    return { complaints: fixed };
  } catch (err) {
    console.error("Error fetching complaints:", err);
    return { complaints: [] };
  }
}


/* ---------------------------------------------------
   CREATE (CLIENT/HOST) - fixed endpoint + body + headers
---------------------------------------------------- */
export async function createComplaint(role, userId, body) {
  const response = await axios.post(BASE_URL, body, {
    headers: headers(role, userId)
  });

  const c = response.data;

  return {
    complaint: {
      id: c.complaintId,
      bookingId: c.bookingId,
      userId: c.userId,
      clientOrHost: c.clientOrHost,
      description: c.complaintDescription,
      status:
        c.complaintStatus.toLowerCase() === "active"
          ? "Active"
          : c.complaintStatus.toLowerCase() === "deleted"
            ? "Deleted"
            : "Closed",
      createdOn: c.createdOn,
      resolvedOn: c.resolvedOn || ""
    }
  };
}


/* ---------------------------------------------------
   RESOLVE (ADMIN)
---------------------------------------------------- */
export async function resolveComplaint(role, userId, id) {
  const response = await axios.patch(`${BASE_URL}/${id}/resolve`, {}, {
    headers: headers(role, userId)
  });

  const c = response.data;

  return {
    complaint: {
      id: c.complaintId,
      bookingId: c.bookingId,
      userId: c.userId,
      clientOrHost: c.clientOrHost,
      description: c.complaintDescription,
      status: "Closed",
      createdOn: c.createdOn,
      resolvedOn: c.resolvedOn
    }
  };
}

/* ---------------------------------------------------
   DELETE (OWNER)
---------------------------------------------------- */
export async function deleteComplaint(role, userId, id) {
  const response = await axios.patch(`${BASE_URL}/${id}/delete`, {}, {
    headers: headers(role, userId)
  });

  const c = response.data;

  return {
    complaint: {
      id: c.complaintId,
      bookingId: c.bookingId,
      userId: c.userId,
      clientOrHost: c.clientOrHost,
      description: c.complaintDescription,
      status: "Deleted",
      createdOn: c.createdOn,
      resolvedOn: c.resolvedOn
    }
  };
}

/* ---------------------------------------------------
   GET ELIGIBLE BOOKINGS FOR COMPLAINTS
---------------------------------------------------- */
export async function getEligibleBookings(role, userId) {
  try {
    const response = await axios.get(
      `http://localhost:8081/api/users/eligible-bookings/${userId}`,
      { headers: headers(role, userId) }
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching eligible bookings:", err);
    return { success: false, bookingIds: [] };
  }
}
