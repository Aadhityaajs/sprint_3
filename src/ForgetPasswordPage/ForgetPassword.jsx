// ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

  const cleanUsername = (name) => name.replace(/\s+/g, "");

  const requestQuestion = async (e) => {
    e.preventDefault();
    const cleaned = cleanUsername(username || "");
    if (!cleaned || cleaned.length < 3) { toast.error("Enter a valid username (min 3 chars)"); return; }
    try {
      const res = await axios.post("http://localhost:8081/forgot-password", { username: cleaned });
      setQuestion(res.data.question || "");
      setStep(2);
      setAnswer(""); setNewPassword(""); setConfirmPassword(""); setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || "User not found");
    }
  };

  const validateReset = () => {
    const errs = {};
    const ans = (answer || "").trim();
    const pwd = (newPassword || "").trim();
    const confirm = (confirmPassword || "").trim();

    if (!ans) errs.answer = "Answer required";
    if (!pwd) errs.newPassword = "New password required";
    else if (!STRONG_PASSWORD_REGEX.test(pwd)) errs.newPassword = "Password must be ≥8 chars & include uppercase, lowercase, number & special char";
    if (!confirm) errs.confirmPassword = "Confirm your password";
    else if (pwd !== confirm) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitReset = async (e) => {
    e.preventDefault();
    if (!validateReset()) { toast.error("Fix highlighted fields"); return; }
    try {
      await axios.post("http://localhost:8081/reset-password", {
        username: cleanUsername(username),
        answer: answer.trim(),
        newPassword: newPassword.trim(),
      });
      toast.success("Password reset successful!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="page-container">
      <ToastContainer />
      <div className="form-card" style={{ minWidth: 350, maxWidth: 550 }}>
        {step === 1 && (
          <>
            <h2>Forgot Password</h2>
            <form onSubmit={requestQuestion}>
              <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <button className="btn-primary" style={{ marginTop: 12 }}>Next</button>
              <p className="link" onClick={() => navigate("/login")}>Back to Login</p>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Answer Security Question</h2>
            <form onSubmit={submitReset}>
              <p style={{ marginBottom: 6 }}>
                <strong>Question:</strong> <span style={{ color: "#333" }}>{question}</span>
              </p>

              <input className={`input ${errors.answer ? "error" : ""}`} placeholder="Your answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
              {errors.answer && <p className="error-text">{errors.answer}</p>}

              <div style={{ position: "relative", marginTop: 10 }}>
                <input type={showPassword ? "text" : "password"} className={`input ${errors.newPassword ? "error" : ""}`} placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value.replace(/\s/g, ""))} />
                <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: "absolute", right: 10, top: 8, background: "transparent", border: "none", cursor: "pointer", fontSize: 13 }}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}

              <input type={showPassword ? "text" : "password"} className={`input ${errors.confirmPassword ? "error" : ""}`} placeholder="Confirm password" style={{ marginTop: 8 }} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value.replace(/\s/g, ""))} />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

              <p style={{ color: "#a33", marginTop: 6, fontSize: 13 }}>Password must be ≥8 chars, include uppercase, lowercase, number and special char.</p>

              <button className="btn-primary" style={{ marginTop: 12 }}>Reset Password</button>

              <p className="link" style={{ marginTop: 8 }} onClick={() => { setStep(1); setQuestion(""); }}>Back</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}