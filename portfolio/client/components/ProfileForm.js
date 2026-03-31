import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import ProfilePictureUpload from "./ProfilePictureUpload";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext";

export default function ProfileForm({ onSave, initialProfile }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const { email, accessToken } = useAuth();
  const { darkMode } = useContext(DarkModeContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    console.log("Edit Profile dialog opened with email:", email);
    if (initialProfile) {
      reset({
        fullName: initialProfile.fullName || "",
        phoneNumber: initialProfile.phoneNumber || "",
        address: initialProfile.address || "",
        profilePicture: initialProfile.profilePicture || "",
      });
      setLoading(false);
      setError(null);
    } else {
      async function fetchProfile() {
        setLoading(true);
        setError(null);
        try {
          if (!email) {
            throw new Error("Email not found in AuthContext");
          }
          const res = await fetch(
            "/api/auth/client-personal-details?email=" +
              encodeURIComponent(email),
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (!res.ok) {
            throw new Error("Failed to fetch profile");
          }
          const data = await res.json();
          reset({
            fullName: data.fullName || "",
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
            profilePicture: data.profilePicture || "",
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchProfile();
    }
  }, [reset, initialProfile, email, accessToken]);

  const onUpload = (filePath) => {
    setValue("profilePicture", filePath);
  };

  const onSubmit = async (data) => {
    setError(null);
    setSuccess(null);
    try {
      if (!email) {
        setError("Email not found in AuthContext. Please login again.");
        return;
      }
      const { dateOfBirth, gender, ...rest } = data;
      const body = { ...rest, email };
      const res = await fetch("/api/auth/client-personal-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error("Failed to save profile");
      }
      setSuccess("Profile saved successfully");
      if (onSave) {
        onSave();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`max-w-md mx-auto p-4 ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      } rounded-md shadow-md`}
    >
      <div className="mb-4">
        <label
          htmlFor="fullName"
          className={`block font-semibold mb-1 ${
            darkMode ? "text-gray-200" : ""
          }`}
        >
          Full Name
        </label>
        <input
          id="fullName"
          {...register("fullName", { required: "Full Name is required" })}
          type="text"
          className={`w-full border rounded px-3 py-2 ${
            errors.fullName
              ? "border-red-500"
              : darkMode
              ? "border-gray-600 bg-gray-700 text-gray-100"
              : "border-gray-300 bg-white text-gray-900"
          }`}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="phoneNumber"
          className={`block font-semibold mb-1 ${
            darkMode ? "text-gray-200" : ""
          }`}
        >
          Phone Number
        </label>
        <input
          id="phoneNumber"
          {...register("phoneNumber", {
            required: "Phone Number is required",
            pattern: {
              value: /^\+880\d{10}$/,
              message:
                "Phone number must start with +880 followed by 10 digits",
            },
          })}
          type="tel"
          className={`w-full border rounded px-3 py-2 ${
            errors.phoneNumber
              ? "border-red-500"
              : darkMode
              ? "border-gray-600 bg-gray-700 text-gray-100"
              : "border-gray-300 bg-white text-gray-900"
          }`}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="address"
          className={`block font-semibold mb-1 ${
            darkMode ? "text-gray-200" : ""
          }`}
        >
          Address
        </label>
        <textarea
          id="address"
          {...register("address")}
          className={`w-full border rounded px-3 py-2 ${
            darkMode
              ? "border-gray-600 bg-gray-700 text-gray-100"
              : "border-gray-300 bg-white text-gray-900"
          }`}
          rows={3}
        />
      </div>
      <div className="mb-4">
        <label
          className={`block font-semibold mb-1 ${
            darkMode ? "text-gray-200" : ""
          }`}
        >
          Profile Picture
        </label>
        <ProfilePictureUpload onUpload={onUpload} />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-4 py-2 rounded ${
          darkMode
            ? "bg-blue-700 text-white hover:bg-blue-800"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? "Saving..." : "Save Profile"}
      </button>
      {success && (
        <p className={`mt-2 ${darkMode ? "text-green-400" : "text-green-600"}`}>
          {success}
        </p>
      )}
      {error && (
        <p className={`mt-2 ${darkMode ? "text-red-400" : "text-red-600"}`}>
          {error}
        </p>
      )}
    </form>
  );
}
