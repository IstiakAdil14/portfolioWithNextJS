import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-transparent animate-fadeIn">
      <div className="bg-white bg-opacity-30 dark:bg-gray-900 dark:bg-opacity-30 p-12 rounded-3xl shadow-[0_0_20px_rgba(124,58,237,0.7)] w-full max-w-md text-center transition-transform transform hover:scale-105">
        <div className="flex flex-col items-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 dark:border-gray-700 h-20 w-20 mb-8 animate-spin border-purple-600 dark:border-purple-400 shadow-lg"></div>
          <h2 className="text-4xl font-extrabold mb-6 text-gray-900 dark:text-white tracking-wider flex items-center justify-center">
            Loading
            <span className="dots ml-3 text-purple-600 dark:text-purple-400 font-extrabold text-4xl animate-pulse">
              ...
            </span>
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg font-medium">
            Please wait while we log you in.
          </p>
          <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 dark:bg-purple-500 animate-progressBar"></div>
          </div>
        </div>
        <style jsx>{`
          .loader {
            border-top-color: #7c3aed; /* Tailwind purple-600 */
            box-shadow: 0 0 15px #7c3aed;
          }
          .dots {
            animation: pulse 1.5s infinite;
          }
          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.3;
            }
          }
          @keyframes progressBar {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }
          .animate-progressBar {
            animation: progressBar 2s linear forwards;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

const Login = () => {
  const router = useRouter();
  const { login, setPasswordSet } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set email and password from query params if available
    if (router.query.email) {
      setEmail(router.query.email);
    }
    if (router.query.password) {
      setPassword(router.query.password);
    }
  }, [router.query]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url === "/login") {
        setEmail("");
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const startTime = Date.now();
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        // Set profileRegistered flag after successful login
        localStorage.setItem("profileRegistered", "true");
        login(response.data.accessToken, email); // Pass token and email to update context state immediately
        if (typeof response.data.passwordSet === "boolean") {
          localStorage.setItem(
            "passwordSet",
            response.data.passwordSet ? "true" : "false"
          );
          setPasswordSet(response.data.passwordSet);
        }
        const elapsed = Date.now() - startTime;
        const delay = Math.max(3000 - elapsed, 0);
        setTimeout(() => {
          setLoading(false);
          const redirectPath = router.query.redirect || "/";
          router.replace(redirectPath);
        }, delay);
      } else {
        setError("Login failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error during login");
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-md mx-auto mt-10 p-6 border rounded shadow dark">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className={loading ? "pointer-events-none select-none" : ""}
      >
        <input
          type="email"
          name="new-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4 text-gray-900 bg-white dark:text-white dark:bg-gray-700 dark:border-gray-600"
          placeholder="Email"
          required
          autoComplete="new-email"
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded text-gray-900 bg-white dark:text-white dark:bg-gray-800"
            placeholder="Password"
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-300"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 10s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6z" />
                <circle cx="10" cy="10" r="3" />
              </svg>
            )}
          </button>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex justify-center items-center"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {loading && <LoadingOverlay />}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="text-blue-600 hover:bg-blue-100 px-4 py-2 rounded border border-blue-600 transition-colors duration-200"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
