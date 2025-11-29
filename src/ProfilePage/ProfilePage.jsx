import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { REGEX, CONSTANTS } from "../constants";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editData, setEditData] = useState({});

  // Change password state
  const [showChange, setShowChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [cpErrors, setCpErrors] = useState({});

  useEffect(() => {
    const data = sessionStorage.getItem("currentUser");
    if (!data) {
      navigate("/login");
      return;
    }
    try {
      setUser(JSON.parse(data));
    } catch (err) {
      console.error("Error parsing user data:", err);
      sessionStorage.removeItem("currentUser");
      navigate("/login");
    }
  }, [navigate]);

  const startEdit = (field) => {
    setEditField(field);
    setEditData({ ...user });
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = async () => {
    try {
      const res = await axios.put(
        `${CONSTANTS.API_BASE_URL}/api/user/update`,
        editData
      );

      if (res.status === 200) {
        toast.success("Profile updated successfully");
        setUser(editData);
        sessionStorage.setItem("currentUser", JSON.stringify(editData));
        setEditField(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const cancelEdit = () => {
    setEditField(null);
    setEditData({});
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.post(`${CONSTANTS.API_BASE_URL}/api/user/delete`, {
        username: user.username,
      });
      toast.success("Account deleted successfully");
      sessionStorage.removeItem("currentUser");
      setTimeout(() => navigate("/signup"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  const validateChange = () => {
    const errs = {};
    const oldP = (oldPassword || "").trim();
    const np = (newPassword || "").trim();
    const conf = (confirmNew || "").trim();

    if (!oldP) errs.oldPassword = "Old password is required";
    if (!np) {
      errs.newPassword = "New password is required";
    } else if (!REGEX.STRONG_PASSWORD.test(np)) {
      errs.newPassword =
        "Password must be ≥8 chars & include uppercase, lowercase, number & special char";
    }
    if (!conf) {
      errs.confirmNew = "Please confirm your new password";
    } else if (np !== conf) {
      errs.confirmNew = "Passwords do not match";
    }

    setCpErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const navigateBack = () => {
    const storage = sessionStorage.getItem("currentUser");
    if (storage) {
      const currentUser = JSON.parse(storage);
      if (currentUser.role === "client") {
        navigate("/clientDashboard");
      } else if (currentUser.role === "host") {
        navigate("/hostDashboard");
      }
    }
  };

  const submitChangePassword = async () => {
    if (!validateChange()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    try {
      await axios.post(`${CONSTANTS.API_BASE_URL}/api/user/change-password`, {
        username: user.username,
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim(),
      });

      toast.success("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmNew("");
      setShowChange(false);
      setCpErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

  if (!user) return null;

  const fields = [
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
  ];

  const addressFields = [
    { label: "Building", key: "building" },
    { label: "Street", key: "street" },
    { label: "City", key: "city" },
    { label: "Pincode", key: "pincode" },
    { label: "State", key: "state" },
    { label: "Country", key: "country" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, <span className="text-blue-600">{user.username}</span> 🎉
        </h1>

        {/* Basic Fields */}
        {fields.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-3 py-3 border-b border-gray-200"
          >
            <strong className="w-32 text-gray-700">{item.label}:</strong>
            {editField === item.key ? (
              <>
                <input
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editData[item.key] || ""}
                  onChange={(e) => handleEditChange(item.key, e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  onClick={saveChanges}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-gray-900">{user[item.key]}</span>
                <span
                  className="cursor-pointer text-xl hover:scale-110 transition"
                  onClick={() => startEdit(item.key)}
                >
                  ✏️
                </span>
              </>
            )}
          </div>
        ))}

        <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
          Address
        </h3>

        {/* Address Fields */}
        {addressFields.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-3 py-3 border-b border-gray-200"
          >
            <strong className="w-32 text-gray-700">{item.label}:</strong>
            {editField === item.key ? (
              <>
                <input
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={
                    editData.address ? editData.address[item.key] || "" : ""
                  }
                  onChange={(e) => {
                    const ad = { ...(editData.address || {}) };
                    ad[item.key] = e.target.value;
                    handleEditChange("address", ad);
                  }}
                />
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  onClick={saveChanges}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-gray-900">
                  {(user.address && user.address[item.key]) || ""}
                </span>
                <span
                  className="cursor-pointer text-xl hover:scale-110 transition"
                  onClick={() => startEdit(item.key)}
                >
                  ✏️
                </span>
              </>
            )}
          </div>
        ))}

        {/* Change Password Section */}
        {showChange && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Change Password
            </h4>

            <input
              type="password"
              placeholder="Old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${cpErrors.oldPassword ? "border-red-500" : "border-gray-300"
                }`}
            />
            {cpErrors.oldPassword && (
              <p className="text-red-600 text-sm mb-2">{cpErrors.oldPassword}</p>
            )}

            <input
              type={showPwd ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value.replace(/\s/g, ""))}
              className={`w-full px-3 py-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${cpErrors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
            />
            {cpErrors.newPassword && (
              <p className="text-red-600 text-sm mb-2">{cpErrors.newPassword}</p>
            )}

            <input
              type={showPwd ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmNew}
              onChange={(e) => setConfirmNew(e.target.value.replace(/\s/g, ""))}
              className={`w-full px-3 py-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${cpErrors.confirmNew ? "border-red-500" : "border-gray-300"
                }`}
            />
            {cpErrors.confirmNew && (
              <p className="text-red-600 text-sm mb-2">{cpErrors.confirmNew}</p>
            )}

            <div className="mt-2 mb-3">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  checked={showPwd}
                  onChange={() => setShowPwd((s) => !s)}
                  className="w-4 h-4"
                />
                Show passwords
              </label>
            </div>

            <div className="mt-3">
              <button
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                onClick={submitChangePassword}
              >
                Save New Password
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 flex-wrap justify-center items-center">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={() => setShowChange((s) => !s)}
          >
            {showChange ? "Hide Change Password" : "Change Password"}
          </button>
          <button
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            onClick={deleteAccount}
          >
            Delete Account
          </button>
          <button
            className="px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition"
            onClick={navigateBack}
          >
            Back
          </button>
          <button
            className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
            onClick={logout}
          >
            Logout
          </button>
          
        </div>
      </div>
    </div>
  );
}