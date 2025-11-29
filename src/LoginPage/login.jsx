import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Apis/UserApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CONSTANTS } from "../constants";

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field, value) => {
    setForm({ ...form, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validate = (field) => {
    let msg = "";

    if (field === "username") {
      if (!form.username.trim()) {
        msg = "Username is required";
      } else if (form.username.trim().length < CONSTANTS.MIN_USERNAME_LENGTH) {
        msg = `Username must be at least ${CONSTANTS.MIN_USERNAME_LENGTH} characters`;
      }
    }

    if (field === "password") {
      if (!form.password.trim()) {
        msg = "Password is required";
      } else if (form.password.trim().length < CONSTANTS.MIN_PASSWORD_LENGTH) {
        msg = `Password must be at least ${CONSTANTS.MIN_PASSWORD_LENGTH} characters`;
      }
    }

    setErrors((prev) => ({ ...prev, [field]: msg }));
    return msg === "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const usernameValid = validate("username");
    const passwordValid = validate("password");

    if (!usernameValid || !passwordValid) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    if (isSubmitting) return;

    const data = {
      username: form.username.trim(),
      password: form.password.trim(),
    };

    setIsSubmitting(true);

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
            const role = response.data.user.role.toLowerCase();
            if (role === "client") {
              navigate("/clientDashboard");
            } else if (role === "host") {
              navigate("/hostDashboard");
            } else if (role === "admin") {
              navigate("/adminDashboard");
            } else {
              navigate("/");
            }
          }, 1200);
        } else {
          toast.error(response.data.message || "Login failed");
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  const inputStyle = (hasError) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-150 ease-in-out ${
      hasError
        ? "border-red-400 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-white">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">User Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              className={inputStyle(errors.username)}
              type="text"
              placeholder="Enter Username"
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              onBlur={() => validate("username")}
              disabled={isSubmitting}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              className={inputStyle(errors.password)}
              type="password"
              placeholder="Enter Password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              onBlur={() => validate("password")}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            className={`w-full text-white py-3 px-4 rounded-lg transition duration-200 font-medium ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p
            className="text-blue-600 cursor-pointer hover:text-blue-800 text-center mt-4 text-sm"
            onClick={() => !isSubmitting && navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
        </form>

        <div className="mt-6 text-center text-sm">
          <span
            className="text-blue-600 cursor-pointer hover:text-blue-800 hover:underline font-medium"
            onClick={() => !isSubmitting && navigate("/signup")}
          >
            Don't have an account? Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}