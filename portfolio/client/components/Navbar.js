import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { DarkModeContext } from "../context/DarkModeContext";
import { motion } from "framer-motion";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import CommentIcon from "@mui/icons-material/Comment";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import Tooltip from "@mui/material/Tooltip";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { useAuth } from "../context/AuthContext";

import LogoutLoadingOverlay from "./LogoutLoadingOverlay";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const {
    isAuthenticated,
    logout,
    clientDetailsSaved,
    passwordSet,
    setLoggingOut,
    email,
  } = useAuth();

  const [profileRegistered, setProfileRegistered] = React.useState(false);
  const [registrationProcessing, setRegistrationProcessing] =
    React.useState(false);

  React.useEffect(() => {
    const registered = localStorage.getItem("profileRegistered");
    const processing = localStorage.getItem("registrationProcessing");
    // Show profile button after login regardless of profileRegistered flag
    if (isAuthenticated) {
      setProfileRegistered(true);
    } else {
      setProfileRegistered(registered === "true");
    }
    setRegistrationProcessing(processing === "true");
  }, [isAuthenticated, email]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (isAuthenticated && email) {
        try {
          const response = await fetch(
            `/api/auth/client-personal-details?email=${encodeURIComponent(
              email
            )}`
          );
          if (response.ok) {
            const data = await response.json();
            // Append timestamp to bust cache and force image refresh
            const profilePicUrl = data.profilePicture
              ? data.profilePicture + "?t=" + new Date().getTime()
              : null;
            setProfilePicture(profilePicUrl);
          } else {
            setProfilePicture(null);
          }
        } catch (error) {
          setProfilePicture(null);
        }
      } else {
        setProfilePicture(null);
      }
    };
    fetchProfilePicture();
  }, [isAuthenticated, email]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignupClick = () => {
    window.location.href = "/signup";
  };

  const handleLoginClick = () => {
    window.location.href = "/login";
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    setHideNavbar(true);
    setLoading(true);
    setLoggingOut(true);
    setTimeout(() => {
      logout();
      setLoading(false);
      setHideNavbar(false);
      setLoggingOut(false);
      window.location.href = "/";
    }, 3000);
  };

  return (
    <>
      {loading && <LogoutLoadingOverlay />}
      <nav
        className={`bg-white dark:bg-gray-800 shadow-md relative z-50 ${
          hideNavbar ? "hidden" : ""
        } md:block`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Hamburger menu button for small screens */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex-shrink-0 flex items-center space-x-2 text-2xl font-bold text-pink-600">
              <EventIcon fontSize="large" />
              <span>BD Wedding Planner</span>
            </div>
            {/* Desktop menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 transition font-semibold cursor-pointer rounded-md px-2 py-1"
              >
                <Tooltip title="Home" arrow>
                  <HomeIcon fontSize="large" />
                </Tooltip>
              </Link>
              <Link
                href="/about"
                className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 transition font-semibold cursor-pointer rounded-md px-2 py-1"
              >
                <Tooltip title="About" arrow>
                  <InfoIcon fontSize="large" />
                </Tooltip>
              </Link>
              <Link
                href="/services"
                className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 transition font-semibold cursor-pointer rounded-md px-2 py-1"
              >
                <Tooltip title="Services" arrow>
                  <MiscellaneousServicesIcon fontSize="large" />
                </Tooltip>
              </Link>
              <Link
                href="/portfolio"
                className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 transition font-semibold cursor-pointer rounded-md px-2 py-1"
              >
                <Tooltip title="Portfolio" arrow>
                  <PhotoLibraryIcon fontSize="large" />
                </Tooltip>
              </Link>
              <Link
                href="/testimonials"
                className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 transition font-semibold cursor-pointer rounded-md px-2 py-1"
              >
                <Tooltip title="Testimonials" arrow>
                  <CommentIcon fontSize="large" />
                </Tooltip>
              </Link>
              <Link
                href="/contact"
                className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 transition font-semibold cursor-pointer rounded-md px-2 py-1"
              >
                <Tooltip title="Contact" arrow>
                  <ContactMailIcon fontSize="large" />
                </Tooltip>
              </Link>
              {/* Conditional Login/Signup Button */}
              {!isAuthenticated || !passwordSet ? (
                <Tooltip title="Login/Signup" arrow>
                  <button
                    className="flex items-center space-x-2 px-3 py-1 text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 font-semibold rounded-md transition"
                    aria-label="Login/Signup"
                    onClick={handleLoginClick}
                  >
                    <LoginIcon fontSize="large" />
                  </button>
                </Tooltip>
              ) : null}
            </div>

            {/* Dark mode toggle */}
            <div className="flex items-center space-x-4">
              {/* Profile dropdown */}
              {isAuthenticated &&
                passwordSet &&
                profileRegistered &&
                !registrationProcessing && (
                  <div className="relative group">
                    <button
                      className="flex items-center space-x-2 px-3 py-1 text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 font-semibold rounded-md transition focus:outline-none"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span>Profile</span>
                      )}
                      <svg
                        className="w-4 h-4 ml-1 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.516 7.548l4.484 4.482 4.484-4.482L15.484 9l-5.484 5.484L4.516 9z" />
                      </svg>
                    </button>
                    <div className="absolute left-0 mt-1 w-40 bg-white dark:bg-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-200 z-50">
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 rounded-md transition font-semibold cursor-pointer"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 hover:text-red-800 dark:hover:text-red-300 rounded-md transition font-semibold cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              <motion.button
                onClick={toggleDarkMode}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full shadow-lg focus:outline-none transition ${
                  darkMode
                    ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                    : "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                }`}
                aria-label="Toggle Dark Mode"
                title="Toggle Dark Mode"
              >
                {darkMode ? (
                  <NightsStayIcon className="h-6 w-6" />
                ) : (
                  <WbSunnyIcon className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden flex justify-start">
            <div className="bg-white dark:bg-gray-800 w-64 h-full p-4 space-y-4 shadow-lg overflow-auto">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-semibold text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 transition"
              >
                <HomeIcon fontSize="large" />
                <span>Home</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-semibold text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 transition"
              >
                <InfoIcon fontSize="large" />
                <span>About</span>
              </Link>
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-semibold text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 transition"
              >
                <MiscellaneousServicesIcon fontSize="large" />
                <span>Services</span>
              </Link>
              <Link
                href="/portfolio"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-semibold text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 transition"
              >
                <PhotoLibraryIcon fontSize="large" />
                <span>Portfolio</span>
              </Link>
              <Link
                href="/testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-semibold text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 transition"
              >
                <CommentIcon fontSize="large" />
                <span>Testimonials</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-semibold text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 transition"
              >
                <ContactMailIcon fontSize="large" />
                <span>Contact</span>
              </Link>

              {/* Conditional Signup/Login Button */}
              {!isAuthenticated || !passwordSet ? (
                <button
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-semibold text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700 hover:text-pink-600 dark:hover:text-pink-300 transition"
                  aria-label="Login/Signup"
                  onClick={handleLoginClick}
                >
                  <LoginIcon fontSize="large" />
                  <span>Login/Signup</span>
                </button>
              ) : null}
            </div>
            <div
              className="flex-grow"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu overlay"
            />
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
