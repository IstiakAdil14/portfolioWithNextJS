import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const VerifyOtp = () => {
  const router = useRouter();
  const { email } = router.query;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      if (response.data.message === "User verified successfully") {
        setMessage("Verification successful! Please set your password.");
        setTimeout(() => {
          router.push({
            pathname: "/register",
            query: { email: email },
          });
        }, 2000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Error resending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
      <p className="mb-4">Enter the 6-digit OTP sent to {email}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 border rounded mb-4 text-center tracking-widest text-xl"
          placeholder="Enter OTP"
          pattern="\d{6}"
          required
        />
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {message && <p className="text-green-600 mb-4">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      <button
        onClick={handleResend}
        disabled={loading}
        className="mt-4 w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
      >
        Resend OTP
      </button>
    </div>
  );
};

export default VerifyOtp;
