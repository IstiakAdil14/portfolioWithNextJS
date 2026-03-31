import React from "react";
import Navbar from "../components/Navbar";
import ProfileForm from "../components/ProfileForm";

export default function ProfilePage() {
  return (
    <>
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Client Profile</h1>
        <ProfileForm />
      </main>
    </>
  );
}
