import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

function Login() {

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  // Create reCAPTCHA
  useEffect(() => {

    if (!window.recaptchaVerifier) {

      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );

    }

  }, []);

  // Send OTP
  const sendOTP = async () => {

    try {

      const appVerifier = window.recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );

      window.confirmationResult = confirmationResult;

      alert("OTP Sent Successfully");

    } catch (error) {

      console.error(error);
      alert("Failed to send OTP");

    }

  };

  // Verify OTP
  const verifyOTP = async () => {

    try {

      const result = await window.confirmationResult.confirm(otp);

      console.log("User logged in:", result.user);

      alert("Login Successful");

    } catch (error) {

      console.error(error);
      alert("Invalid OTP");

    }

  };

  return (

    <div style={{ textAlign: "center", marginTop: "100px" }}>

      <h2>MoveSync AI Login</h2>

      {/* PHONE NUMBER INPUT */}

      <input
        type="text"
        placeholder="+91 Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <br /><br />

      {/* SEND OTP BUTTON */}

      <button onClick={sendOTP}>
        Continue with Phone Number
      </button>

      <br /><br />

      {/* OTP INPUT */}

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <br /><br />

      {/* VERIFY OTP BUTTON */}

      <button onClick={verifyOTP}>
        Verify OTP
      </button>

      {/* REQUIRED FOR FIREBASE */}

      <div id="recaptcha-container"></div>

    </div>

  );
}

export default Login;
