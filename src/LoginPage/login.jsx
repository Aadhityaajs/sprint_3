import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../Apis/UserApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const update = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validate = (field) => {
    let msg = "";

    if (field === "username" && form.username.trim().length < 3)
      msg = "Enter a valid username";

    if (field === "password" && form.password.trim().length < 8)
      msg = "Password must be at least 8 characters";

    setErrors((prev) => ({ ...prev, [field]: msg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validate("username");
    validate("password");

    if (errors.username || errors.password) {
      toast.error("Fix highlighted fields");
      return;
    }

    const data = {
      username: form.username,
      password: form.password,
    };

    try {
      const response = await login(data);

      if (response.status >= 200 && response.status < 300) {
        if (response.data.success) {
          toast.success("Login successful!");

          sessionStorage.setItem(
            "currentUser",
            JSON.stringify({
              username: response.data.user.username,
              role: response.data.user.role,
              userId: response.data.user.userId,
            })
          );

          setTimeout(() => {
            if (response.data.user.role === "client") {
              navigate("/clientDashboard");
            } else if (response.data.user.role === "host") {
              navigate("/hostDashboard");
            } else if (response.data.user.role === "admin") {
              navigate("/adminDashboard");
            }
          }, 1200);
        } else {
          toast.error(response.data.message || "Login failed");
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  };

  const inputStyle = (hasError) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-150 ease-in-out ${
      hasError
        ? "border-red-400 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-100 bg-gradient-to-b from-blue-200 to-white">
      <ToastContainer />

      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm">
        <h2 className="text-3xl front-bold mb-8 text-center">User Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className={inputStyle(errors.username)}
            type="text"
            placeholder="Enter Username"
            value={form.username}
            onChange={(e) => update("username", e.target.value)}
            onBlur={() => validate("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}

          <input
            className={inputStyle(errors.password)}
            type="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            onBlur={() => validate("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <button
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            type="submit"
          >
            Login
          </button>

          {/* 🔹 FORGOT PASSWORD LINK ADDED HERE */}
          <p
            className="text-blue-600 cursor-pointer hover:text-blue-800 text-center mt-2"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
        </form>

        <div className="mt-6 text-center text-sm">
          <span
            className="text-blue-600 cursor-pointer hover:text-blue-800 hover:underline font-medium"
            onClick={() => navigate("/signup")}
          >
            Don't have an account? Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}
