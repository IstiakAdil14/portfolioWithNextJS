import React, { useState } from "react";

export default function ProfilePictureUpload({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        setError("File size exceeds 100MB limit");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      // Automatically upload after file selection
      setUploading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("profilePicture", file);

        const res = await fetch("/api/auth/upload-profile-picture", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Upload failed");
        }

        const data = await res.json();
        onUpload(data.filePath);
      } catch (err) {
        setError(err.message);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Profile Preview"
          className="mt-2 h-24 w-24 object-cover rounded-full"
        />
      )}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
