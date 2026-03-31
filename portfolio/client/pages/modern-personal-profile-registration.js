 
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { NumericFormat } from "react-number-format";
import { DarkModeContext } from "../context/DarkModeContext";

const countryCodes = [
  { code: "+1", name: "United States", length: 10 },
  { code: "+44", name: "United Kingdom", length: 10 },
  { code: "+91", name: "India", length: 10 },
  { code: "+61", name: "Australia", length: 9 },
  { code: "+81", name: "Japan", length: 10 },
  { code: "+49", name: "Germany", length: 11 },
  { code: "+33", name: "France", length: 9 },
  { code: "+880", name: "Bangladesh", length: 10 },
  { code: "+86", name: "China", length: 11 },
  { code: "+7", name: "Russia", length: 10 },
  // Add more country codes as needed
];

export default function ModernPersonalProfileRegistration() {
  const router = useRouter();
  const { email, password } = router.query;
  const { darkMode } = useContext(DarkModeContext);

  const [details, setDetails] = useState({
    email: email || "",
    password: password || "",
    fullName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    gender: "", // added gender field
    profilePicture: "", // added profilePicture field
  });

  const [selectedCountryCode, setSelectedCountryCode] = useState("+880");
  const [phoneNumberLength, setPhoneNumberLength] = useState(10);

  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [phoneError, setPhoneError] = useState(null);

  useEffect(() => {
    if (email) {
      setDetails((prev) => ({ ...prev, email }));
    }
  }, [email]);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleCountryCodeChange = (e) => {
    const newCode = e.target.value;
    setSelectedCountryCode(newCode);
    const country = countryCodes.find((c) => c.code === newCode);
    setPhoneNumberLength(country ? country.length : 10);
  };

  const validatePhoneNumber = (phone, countryCode, length) => {
    // Validate phone number: country code + exactly length digits
    // Escape + in countryCode for regex
    const escapedCode = countryCode.replace("+", "\\+");
    const regex = new RegExp("^" + escapedCode + "\\d{" + length + "}$");
    return regex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Remove previous email login token when signup processing starts
    localStorage.removeItem("accessToken");
    // Set registration processing flag
    localStorage.setItem("registrationProcessing", "true");

    setSaving(true);
    setError(null);
    setSuccess(null);

    // Prepend selected country code if missing for validation and submission
    let phoneNumberToValidate = details.phoneNumber;
    if (!phoneNumberToValidate.startsWith(selectedCountryCode)) {
      phoneNumberToValidate = selectedCountryCode + phoneNumberToValidate;
    }

    if (!validatePhoneNumber(phoneNumberToValidate, selectedCountryCode, phoneNumberLength)) {
      setError(
        `Please enter a valid phone number starting with ${selectedCountryCode} and exactly ${phoneNumberLength} digits after the country code.`
      );
      setSaving(false);
      // Clear registration processing flag on error
      localStorage.setItem("registrationProcessing", "false");
      return;
    }

    try {
      // accessToken removed above, so no token sent here
      // Prepare details with full phone number including selected country code
      const detailsToSubmit = {
        ...details,
        phoneNumber: phoneNumberToValidate,
      };

      const res = await fetch("http://localhost:5000/api/modernPersonalDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // No Authorization header since token removed
        },
        body: JSON.stringify(detailsToSubmit),
      });

      if (!res.ok) {
        let errorText;
        try {
          const errorData = await res.clone().json();
          errorText = errorData.message || JSON.stringify(errorData);
        } catch {
          try {
            errorText = await res.clone().text();
          } catch {
            errorText = "Failed to save personal details";
          }
        }
        throw new Error(errorText || "Failed to save personal details");
      }
      setSuccess("Personal details saved successfully");
      localStorage.setItem("profileRegistered", "true");
      // Clear registration processing flag after success
      localStorage.setItem("registrationProcessing", "false");
      // Redirect to login page with email and password
      router.push({
        pathname: "/login",
        query: { email: details.email, password: details.password },
      });
    } catch (err) {
      setError(err.message);
      // Clear registration processing flag on error
      localStorage.setItem("registrationProcessing", "false");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`max-w-lg mx-auto p-6 rounded shadow-md mt-10 ${
      darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
    }`}>
      <h2 className="text-3xl font-bold mb-6 text-center">Personal Details</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={details.email}
            readOnly
            disabled
            className={`w-full border rounded px-4 py-2 cursor-not-allowed ${
              darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"
            }`}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold mb-1"
          >
            Password
          </label>
          <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={details.password}
            readOnly
            disabled
            className={`w-full border rounded px-4 py-2 cursor-not-allowed ${
              darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"
            }`}
            required
          />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-2 top-2 focus:outline-none ${
                darkMode ? "text-yellow-400 hover:text-yellow-300" : "text-gray-600 hover:text-gray-900"
              }`}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zM10 15a5 5 0 110-10 5 5 0 010 10z" />
                  <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4.03 3.97a.75.75 0 10-1.06 1.06l1.528 1.528A9.956 9.956 0 001 10c.73 2.89 4 7 9 7 1.847 0 3.56-.58 4.97-1.56l1.528 1.528a.75.75 0 101.06-1.06l-14-14zM10 5a5 5 0 014.546 2.916l-1.52 1.52A3 3 0 0010 7a2.99 2.99 0 00-2.46 1.36L6.06 6.88A4.978 4.978 0 0110 5zm0 10a5 5 0 01-4.546-2.916l1.52-1.52A3 3 0 0010 13a2.99 2.99 0 002.46-1.36l1.48 1.48A4.978 4.978 0 0110 15z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold mb-1"
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={details.fullName}
            onChange={handleChange}
            className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 ${
              darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-pink-500" : "bg-white border-gray-300 text-black focus:ring-blue-500"
            }`}
            required
          />
        </div>
        <div>
          <label
            htmlFor="countryCode"
            className="block text-sm font-semibold mb-1"
          >
            Country Code
          </label>
          <select
            id="countryCode"
            name="countryCode"
            value={selectedCountryCode}
            onChange={handleCountryCodeChange}
            className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 ${
              darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-pink-500" : "bg-white border-gray-300 text-black focus:ring-blue-500"
            }`}
          >
            {countryCodes.map(({ code, name }) => (
              <option key={code} value={code}>
                {name} ({code})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-semibold mb-1"
          >
            Phone Number
          </label>
          <NumericFormat
            key={phoneNumberLength}
            id="phoneNumber"
            name="phoneNumber"
            value={details.phoneNumber}
            onValueChange={(values) => {
              let { value } = values;
              setDetails({ ...details, phoneNumber: value });
              // Live validation
              const fullPhone = selectedCountryCode + value;
              if (!validatePhoneNumber(fullPhone, selectedCountryCode, phoneNumberLength)) {
                setPhoneError(`Phone number must be exactly ${phoneNumberLength} digits after the country code.`);
              } else {
                setPhoneError(null);
              }
            }}
            isAllowed={(values) => {
              const { value } = values;
              return value.length <= phoneNumberLength;
            }}
            format={"#".repeat(phoneNumberLength)}
            mask="_"
            className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 ${
              darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-pink-500" : "bg-white border-gray-300 text-black focus:ring-blue-500"
            }`}
            placeholder={Array(phoneNumberLength).fill("0").join("")}
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-semibold mb-1">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={details.address}
            onChange={handleChange}
            className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 ${
              darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-pink-500" : "bg-white border-gray-300 text-black focus:ring-blue-500"
            }`}
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Gender</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={details.gender === "Male"}
                onChange={handleChange}
                className="form-radio"
                required
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={details.gender === "Female"}
                onChange={handleChange}
                className="form-radio"
                required
              />
              <span className="ml-2">Female</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="Other"
                checked={details.gender === "Other"}
                onChange={handleChange}
                className="form-radio"
                required
              />
              <span className="ml-2">Other</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              if (file.size > 10 * 1024 * 1024) {
                alert("File size must be less than 10MB");
                return;
              }
              const formData = new FormData();
              formData.append("profilePicture", file);
              try {
                const accessToken = localStorage.getItem("accessToken");
                const res = await fetch("/api/auth/upload-profile-picture", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: formData,
                });
                if (!res.ok) {
                  const errorData = await res.json();
                  alert(
                    "Upload failed: " + (errorData.message || res.statusText)
                  );
                  return;
                }
                const data = await res.json();
                setDetails((prev) => ({
                  ...prev,
                  profilePicture: data.filePath,
                }));
              } catch (err) {
                alert("Upload error: " + err.message);
              }
            }}
            className="w-full"
          />
          {details.profilePicture && (
            <img
              src={details.profilePicture}
              alt="Profile Preview"
              className="mt-2 max-h-40 rounded"
            />
          )}
        </div>
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-semibold mb-1"
          >
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={details.dateOfBirth}
            onChange={handleChange}
            className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 ${
              darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-pink-500" : "bg-white border-gray-300 text-black focus:ring-blue-500"
            }`}
            max={new Date().toISOString().split("T")[0]}
            title="Date of birth cannot be today or in the future"
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving || phoneError !== null}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          {saving ? "Saving..." : "Save Personal Details"}
        </button>
        {phoneError && <p className="text-red-600 mt-2 text-center">{phoneError}</p>}
        {success && (
          <p className="text-green-600 mt-4 text-center">{success}</p>
        )}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
}
