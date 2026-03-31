import React from "react";
import ProfileForm from "./ProfileForm";

export default function EditProfileDialog({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          aria-label="Close edit profile dialog"
        >
          &#x2715;
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <ProfileForm />
      </div>
    </div>
  );
}
