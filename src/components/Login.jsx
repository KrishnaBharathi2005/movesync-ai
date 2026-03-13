import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  // STEP 3 — Create reCAPTCHA
  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" },
      auth
    );
  }, []);

  // STEP 4 — Send OTP
  const sendOTP = async () => {
    const appVerifier = window.recaptchaVerifier;

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    );

    window.confirmationResult = confirmationResult;
    alert("OTP sent");
  };

  // STEP 5 — Verify OTP
  const verifyOTP = async () => {
    try {
      const result = await window.confirmationResult.confirm(otp);
      console.log("User logged in:", result.user);
    } catch (error) {
      alert("OTP verification failed");
    }
  };

  // STEP 6 — Detect login state
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });
  }, []);

  return (
    <div>

      <h2>Login with Phone</h2>

      <input
        type="text"
        placeholder="Enter phone number"
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <button onClick={sendOTP}>Send OTP</button>

      <input
        type="text"
        placeholder="Enter OTP"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={verifyOTP}>Verify OTP</button>

      <div id="recaptcha-container"></div>

    </div>
  );
}

export default Login;
