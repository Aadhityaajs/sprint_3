import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { signup } from "../Apis/UserApi";

// Hardcoded Indian states + districts
const INDIAN_DATA = {
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangalore", "Hubli"],
  Kerala: ["Kochi", "Trivandrum", "Kozhikode"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Delhi: ["New Delhi", "Dwarka", "Saket"]
};

const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What city were you born in?"
];

const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function cleanUsernameRaw(name) {
  return name.replace(/\s+/g, "");
}

export default function Signup() {
  const navigate = useNavigate();

  const [states] = useState(Object.keys(INDIAN_DATA));
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    building: "",
    street: "",
    city: "",
    pincode: "",
    state: "",
    country: "India",
    password: "",
    confirmPassword: "",
    securityQuestion: SECURITY_QUESTIONS[0],
    securityAnswer: "",
    termsAccepted: false,
    role: "client" // <-- DEFAULT ROLE
  });

  const [errors, setErrors] = useState({});

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleStateChange = (stateName) => {
    update("state", stateName);
    update("city", "");
    setCities(INDIAN_DATA[stateName] || []);
  };

  const validate = (field) => {
    let msg = "";

    if (field === "username") {
      const cleaned = cleanUsernameRaw(form.username);
      if (!cleaned || cleaned.length < 3) msg = "Enter a valid username";
    }

    if (field === "email" && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      msg = "Invalid email";

    if (field === "phone" && form.phone.length !== 10)
      msg = "Phone must be 10 digits";

    if (["building", "street", "city", "state"].includes(field) && !form[field])
      msg = "Required";

    if (field === "pincode" && form.pincode.length !== 6) msg = "6 digits";

    if (field === "password" && !STRONG_PASSWORD_REGEX.test(form.password))
      msg = "Weak password";

    if (field === "confirmPassword" && form.confirmPassword !== form.password)
      msg = "Passwords do not match";

    if (field === "securityAnswer" && !form.securityAnswer.trim())
      msg = "Required";

    if (field === "termsAccepted" && !form.termsAccepted)
      msg = "Please accept Terms";

    setErrors((p) => ({ ...p, [field]: msg }));
  };

 const submit = async (e) => {
  e.preventDefault();

  const fields = [
    "username",
    "email",
    "phone",
    "building",
    "street",
    "city",
    "pincode",
    "state",
    "password",
    "confirmPassword",
    "securityAnswer",
    "termsAccepted"
  ];

  fields.forEach(validate);

  // Check if there are any errors
  const hasErrors = Object.values(errors).some((v) => v);
  if (hasErrors) {
    toast.error("Fix highlighted fields");
    return;
  }

  try {
    const payload = {
      username: cleanUsernameRaw(form.username),
      email: form.email,
      phone: form.phone,
      address: {
        building: form.building,
        street: form.street,
        city: form.city,
        pincode: form.pincode,
        state: form.state,
        country: "India"
      },
      password: form.password,
      role: form.role, // client or host
      securityQuestion: form.securityQuestion, // ADD THIS
      securityAnswer: form.securityAnswer // ADD THIS
    };

    const res = await signup(payload);

    if (res?.status === 200) {
      toast.success("Account created successfully!");
      setTimeout(() => navigate("/login"), 1200);
    } else {
      toast.error(res?.data?.message || "Signup failed");
    }
  } catch (err) {
    console.error("Signup error:", err);
    toast.error(err?.response?.data?.message || "Signup failed");
  }
};

  const input = (err) =>
    `w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition ${
      err
        ? "border-red-400 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <ToastContainer />

      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Create Account
        </h2>

        {/* ---------- ROLE TOGGLE ---------- */}
        <div className="flex items-center justify-center mb-6">
          <span className={`mr-3 font-semibold ${form.role === "client" ? "text-blue-600" : "text-gray-600"}`}>
            Client
          </span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={form.role === "host"}
              onChange={() =>
                update("role", form.role === "client" ? "host" : "client")
              }
            />
            <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition"></div>
            <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-7"></div>
          </label>

          <span className={`ml-3 font-semibold ${form.role === "host" ? "text-blue-600" : "text-gray-600"}`}>
            Host
          </span>
        </div>

        {/* ---------- FORM START ---------- */}
        <form onSubmit={submit} className="space-y-4">
          <input
            className={input(errors.username)}
            placeholder="Username"
            value={form.username}
            onChange={(e) => update("username", e.target.value)}
            onBlur={() => validate("username")}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

          <input
            className={input(errors.email)}
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => validate("email")}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            className={input(errors.phone)}
            placeholder="Phone Number"
            maxLength={10}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
            onBlur={() => validate("phone")}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

          <h3 className="text-lg font-semibold text-gray-700 mt-4">Address</h3>

          <div className="grid grid-cols-3 gap-3">
            <input
              className={input(errors.building)}
              placeholder="Building"
              value={form.building}
              onChange={(e) => update("building", e.target.value)}
              onBlur={() => validate("building")}
            />

            <input
              className={input(errors.street)}
              placeholder="Street"
              value={form.street}
              onChange={(e) => update("street", e.target.value)}
              onBlur={() => validate("street")}
            />

            <input
              className={input(errors.city)}
              placeholder="City"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              onBlur={() => validate("city")}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input
              className={input(errors.pincode)}
              placeholder="Pincode"
              maxLength={6}
              value={form.pincode}
              onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))}
              onBlur={() => validate("pincode")}
            />

            <select
              className={input(errors.state)}
              value={form.state}
              onChange={(e) => handleStateChange(e.target.value)}
              onBlur={() => validate("state")}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              className={input()}
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <input
            type="password"
            className={input(errors.password)}
            placeholder="Password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            onBlur={() => validate("password")}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <input
            type="password"
            className={input(errors.confirmPassword)}
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            onBlur={() => validate("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}

          <label className="block font-medium text-gray-700">Security Question</label>
          <select
            className={input()}
            value={form.securityQuestion}
            onChange={(e) => update("securityQuestion", e.target.value)}
          >
            {SECURITY_QUESTIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>

          <input
            className={input(errors.securityAnswer)}
            placeholder="Security Answer"
            value={form.securityAnswer}
            onChange={(e) => update("securityAnswer", e.target.value)}
            onBlur={() => validate("securityAnswer")}
          />
          {errors.securityAnswer && (
            <p className="text-red-500 text-sm">{errors.securityAnswer}</p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={form.termsAccepted}
              onChange={(e) => update("termsAccepted", e.target.checked)}
              onBlur={() => validate("termsAccepted")}
            />
            <span className="text-sm">
              I accept{" "}
              <a
                href="https://www.termsandconditionsgenerator.com"
                target="_blank"
                className="text-blue-600 underline"
              >
                Terms & Conditions
              </a>
            </span>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-500 text-sm">{errors.termsAccepted}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 text-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>

          <p
            className="text-center text-blue-600 mt-4 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </p>
        </form>
      </div>
    </div>
  );
}
