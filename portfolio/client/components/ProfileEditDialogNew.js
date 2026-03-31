import React, { useContext } from "react";
import ProfileForm from "./ProfileForm";
import { DarkModeContext } from "../context/DarkModeContext";

export default function ProfileEditDialogNew({ isOpen, onClose, profile }) {
  const { darkMode } = useContext(DarkModeContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`rounded p-6 max-w-lg w-full relative ${
          darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 ${
            darkMode
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
          aria-label="Close edit profile dialog"
        >
          &#x2715;
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <ProfileForm onSave={onClose} initialProfile={profile} />
      </div>
    </div>
  );
}
