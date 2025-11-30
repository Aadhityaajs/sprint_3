const BASE_URL = "http://localhost:8081/api/admin/notifications";

function headers(role, userId) {
  return {
    "Content-Type": "application/json",
    "x-user-role": role.toLowerCase(),
    "x-user-id": String(userId)
  };
}

/* ---------------------------------------------------
   GET ALL
---------------------------------------------------- */
export async function getAllNotifications(role, userId) {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      headers: headers(role, userId)
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    // Backend returns { success: true, data: [...] }
    return { notifications: data.data || [] };
  } catch (err) {
    console.error(err);
    return { notifications: [] };
  }
}

/* ---------------------------------------------------
   CREATE
---------------------------------------------------- */
export async function createNotification(role, creatorId, body) {
  const { type, title, message, target, targetUsers } = body;
  const usersToNotify = targetUsers || [];
  const createdNotifications = [];

  // The backend creates one notification per request (per user).
  // So we loop here to create for all target users.
  for (const uid of usersToNotify) {
    try {
      const payload = {
        userId: uid,
        notificationTitle: title,
        notificationMessage: message,  // Changed from 'message' to 'notificationMessage'
        notificationType: type,
        notificationTarget: target || 'Selected Users',  // Changed from 'target' to 'notificationTarget'
      };

      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: headers(role, creatorId),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        // Backend returns { success: true, data: newNotification }
        if (data.data) {
          createdNotifications.push(data.data);
        }
      }
    } catch (err) {
      console.error("Failed to create notification for user", uid, err);
    }
  }

  return {
    notifications: createdNotifications
  };
}

/* ---------------------------------------------------
   MARK AS READ
---------------------------------------------------- */
export async function markAsRead(role, userId, id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}/read`, {
      method: "PUT",
      headers: headers(role, userId)
    });
    if (!res.ok) throw new Error("Failed to mark as read");
    const data = await res.json();
    return { notification: data.data };
  } catch (err) {
    console.error(err);
    return { error: "Failed to mark as read" };
  }
}


