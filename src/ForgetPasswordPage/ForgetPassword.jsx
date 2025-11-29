import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { REGEX, CONSTANTS } from "../constants";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cleanUsername = (name) => name.replace(/\s+/g, "");

  const requestQuestion = async (e) => {
    e.preventDefault();

    const cleaned = cleanUsername(username || "");
    
    // Validate username
    if (!cleaned) {
      toast.error("Username is required");
      return;
    }
    if (cleaned.length < CONSTANTS.MIN_USERNAME_LENGTH) {
      toast.error(`Username must be at least ${CONSTANTS.MIN_USERNAME_LENGTH} characters`);
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${CONSTANTS.API_BASE_URL}/forgot-password`, { 
        username: cleaned 
      });
      
      setQuestion(res.data.question || "");
      setStep(2);
      setAnswer("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      toast.success("Security question retrieved");
    } catch (err) {
      toast.error(err.response?.data?.message || "User not found");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateReset = () => {
    const errs = {};
    const ans = (answer || "").trim();
    const pwd = (newPassword || "").trim();
    const conf = (confirmPassword || "").trim();

    if (!ans) {
      errs.answer = "Answer is required";
    }

    if (!pwd) {
      errs.newPassword = "New password is required";
    } else if (!REGEX.STRONG_PASSWORD.test(pwd)) {
      errs.newPassword = "Password must be ≥8 chars & include uppercase, lowercase, number & special char";
    }

    if (!conf) {
      errs.confirmPassword = "Please confirm your password";
    } else if (pwd !== conf) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitReset = async (e) => {
    e.preventDefault();

    if (!validateReset()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await axios.post(`${CONSTANTS.API_BASE_URL}/reset-password`, {
        username: cleanUsername(username),
        answer: answer.trim(),
        newPassword: newPassword.trim(),
      });

      toast.success("Password reset successful!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Forgot Password</h2>
            <form onSubmit={requestQuestion} className="space-y-4">
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                className={`w-full py-3 rounded-lg font-medium transition ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Please wait..." : "Next"}
              </button>
              <p
                className="text-center text-blue-600 cursor-pointer hover:underline text-sm"
                onClick={() => !isSubmitting && navigate("/login")}
              >
                Back to Login
              </p>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Answer Security Question</h2>
            <form onSubmit={submitReset} className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-1">Security Question:</p>
                <p className="font-medium text-gray-900">{question}</p>
              </div>

              <div>
                <input
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.answer
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Your answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.answer && <p className="text-red-500 text-sm mt-1">{errors.answer}</p>}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.newPassword
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value.replace(/\s/g, ""))}
                  disabled={isSubmitting}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value.replace(/\s/g, ""))}
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showPwd"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="w-4 h-4"
                />
                <label htmlFor="showPwd" className="text-sm text-gray-700">
                  Show passwords
                </label>
              </div>

              <p className="text-xs text-gray-600">
                Password must be ≥8 chars, include uppercase, lowercase, number and special char.
              </p>

              <button
                className={`w-full py-3 rounded-lg font-medium transition ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>

              <p
                className="text-center text-blue-600 cursor-pointer hover:underline text-sm"
                onClick={() => {
                  if (!isSubmitting) {
                    setStep(1);
                    setQuestion("");
                    setAnswer("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setErrors({});
                  }
                }}
              >
                Back
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}