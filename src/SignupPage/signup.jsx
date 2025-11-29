import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../Apis/UserApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { REGEX, CONSTANTS, SECURITY_QUESTIONS, INDIAN_STATES, INDIAN_STATE_DISTRICTS } from "../constants";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    building: "",
    street: "",
    city: "",
    pincode: "",
    state: "",
    password: "",
    confirmPassword: "",
    role: "client",
    securityQuestion: SECURITY_QUESTIONS[0],
    securityAnswer: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState([]);

  const cleanUsernameRaw = (name) => name.replace(/\s+/g, "");

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (field) => {
    let msg = "";

    if (field === "username") {
      const cleaned = cleanUsernameRaw(form.username);
      if (!cleaned) {
        msg = "Username is required";
      } else if (cleaned.length < CONSTANTS.MIN_USERNAME_LENGTH) {
        msg = `Username must be at least ${CONSTANTS.MIN_USERNAME_LENGTH} characters`;
      }
    }

    if (field === "email" && !REGEX.EMAIL.test(form.email)) {
      msg = "Invalid email address";
    }

    if (field === "phone") {
      if (!form.phone) {
        msg = "Phone number is required";
      } else if (form.phone.length !== CONSTANTS.PHONE_LENGTH) {
        msg = `Phone must be ${CONSTANTS.PHONE_LENGTH} digits`;
      }
    }

    if (["building", "street"].includes(field) && !form[field].trim()) {
      msg = "This field is required";
    }

    if (field === "city" && !form.city) {
      msg = "City is required";
    }

    if (field === "state" && !form.state) {
      msg = "State is required";
    }

    if (field === "pincode") {
      if (!form.pincode) {
        msg = "Pincode is required";
      } else if (form.pincode.length !== CONSTANTS.PINCODE_LENGTH) {
        msg = `Pincode must be ${CONSTANTS.PINCODE_LENGTH} digits`;
      }
    }

    if (field === "password") {
      if (!form.password) {
        msg = "Password is required";
      } else if (!REGEX.STRONG_PASSWORD.test(form.password)) {
        msg = "Password must be ≥8 chars & include uppercase, lowercase, number & special char";
      }
    }

    if (field === "confirmPassword") {
      if (!form.confirmPassword) {
        msg = "Please confirm your password";
      } else if (form.confirmPassword !== form.password) {
        msg = "Passwords do not match";
      }
    }

    if (field === "securityAnswer" && !form.securityAnswer.trim()) {
      msg = "Security answer is required";
    }

    if (field === "termsAccepted" && !form.termsAccepted) {
      msg = "You must accept the Terms & Conditions";
    }

    setErrors((p) => ({ ...p, [field]: msg }));
    return msg === "";
  };

  const handleStateChange = (stateValue) => {
    update("state", stateValue);
    update("city", ""); // Clear city when state changes

    if (INDIAN_STATE_DISTRICTS[stateValue]) {
      setCities(INDIAN_STATE_DISTRICTS[stateValue]);
    } else {
      setCities([]);
    }
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
      "termsAccepted",
    ];

    // Validate all fields
    const validationResults = fields.map(field => validate(field));
    const allValid = validationResults.every(result => result);

    if (!allValid) {
      toast.error("Please fix all highlighted fields");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        username: cleanUsernameRaw(form.username),
        email: form.email.trim(),
        phone: form.phone,
        address: {
          building: form.building.trim(),
          street: form.street.trim(),
          city: form.city.trim(),
          pincode: form.pincode,
          state: form.state,
          country: "India",
        },
        password: form.password,
        role: form.role,
        securityQuestion: form.securityQuestion,
        securityAnswer: form.securityAnswer.trim(),
      };

      const res = await signup(payload);

      if (res?.status === 200 || res?.status === 201) {
        toast.success("Account created successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(res?.data?.message || "Signup failed");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err?.response?.data?.message || "Signup failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const inputStyle = (err) =>
    `w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition ${err
      ? "border-red-400 focus:ring-red-500"
      : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Create Account
        </h2>

        {/* Role Toggle */}
        <div className="flex items-center justify-center mb-6">
          <span
            className={`mr-3 font-semibold ${form.role === "client" ? "text-blue-600" : "text-gray-600"
              }`}
          >
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
              disabled={isSubmitting}
            />
            <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition"></div>
            <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-7"></div>
          </label>

          <span
            className={`ml-3 font-semibold ${form.role === "host" ? "text-blue-600" : "text-gray-600"
              }`}
          >
            Host
          </span>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Username */}
          <div>
            <input
              className={inputStyle(errors.username)}
              placeholder="Username"
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              onBlur={() => validate("username")}
              disabled={isSubmitting}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              className={inputStyle(errors.email)}
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              onBlur={() => validate("email")}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              className={inputStyle(errors.phone)}
              placeholder="Phone Number"
              maxLength={CONSTANTS.PHONE_LENGTH}
              value={form.phone}
              onChange={(e) =>
                update("phone", e.target.value.replace(/\D/g, ""))
              }
              onBlur={() => validate("phone")}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mt-4">Address</h3>

          {/* Address - Building, Street, City */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <input
                className={inputStyle(errors.building)}
                placeholder="Building"
                value={form.building}
                onChange={(e) => update("building", e.target.value)}
                onBlur={() => validate("building")}
                disabled={isSubmitting}
              />
              {errors.building && (
                <p className="text-red-500 text-xs mt-1">{errors.building}</p>
              )}
            </div>

            <div>
              <input
                className={inputStyle(errors.street)}
                placeholder="Street"
                value={form.street}
                onChange={(e) => update("street", e.target.value)}
                onBlur={() => validate("street")}
                disabled={isSubmitting}
              />
              {errors.street && (
                <p className="text-red-500 text-xs mt-1">{errors.street}</p>
              )}
            </div>

            <div>
              <select
                className={inputStyle(errors.city)}
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                onBlur={() => validate("city")}
                disabled={isSubmitting || cities.length === 0}
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
          </div>

          {/* Pincode, State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                className={inputStyle(errors.pincode)}
                placeholder="Pincode"
                maxLength={CONSTANTS.PINCODE_LENGTH}
                value={form.pincode}
                onChange={(e) =>
                  update("pincode", e.target.value.replace(/\D/g, ""))
                }
                onBlur={() => validate("pincode")}
                disabled={isSubmitting}
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
              )}
            </div>

            <div>
              <select
                className={inputStyle(errors.state)}
                value={form.state}
                onChange={(e) => handleStateChange(e.target.value)}
                onBlur={() => validate("state")}
                disabled={isSubmitting}
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              className={inputStyle(errors.password)}
              placeholder="Password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              onBlur={() => validate("password")}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              className={inputStyle(errors.confirmPassword)}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              onBlur={() => validate("confirmPassword")}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Security Question */}
          <div>
            <label className="block font-medium text-gray-700 mb-2 text-sm">
              Security Question
            </label>
            <select
              className={inputStyle()}
              value={form.securityQuestion}
              onChange={(e) => update("securityQuestion", e.target.value)}
              disabled={isSubmitting}
            >
              {SECURITY_QUESTIONS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* Security Answer */}
          <div>
            <input
              className={inputStyle(errors.securityAnswer)}
              placeholder="Security Answer"
              value={form.securityAnswer}
              onChange={(e) => update("securityAnswer", e.target.value)}
              onBlur={() => validate("securityAnswer")}
              disabled={isSubmitting}
            />
            {errors.securityAnswer && (
              <p className="text-red-500 text-sm mt-1">
                {errors.securityAnswer}
              </p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="terms"
                checked={form.termsAccepted}
                onChange={(e) => update("termsAccepted", e.target.checked)}
                onBlur={() => validate("termsAccepted")}
                disabled={isSubmitting}
                className="w-4 h-4"
              />
              <label htmlFor="terms" className="text-sm text-gray-700"></label>
              I accept{" "}

              <a
                href="https://www.termsandconditionsgenerator.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Terms & Conditions
              </a>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-500 text-sm mt-1">
                {errors.termsAccepted}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg mt-4 text-lg font-semibold transition ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>

          <p
            className="text-center text-blue-600 mt-4 cursor-pointer hover:underline text-sm"
            onClick={() => !isSubmitting && navigate("/login")}
          >
            Already have an account? Login
          </p>
        </form>
      </div >
    </div >
  );
}