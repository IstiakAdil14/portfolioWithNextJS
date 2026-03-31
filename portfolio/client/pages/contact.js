import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { MdSend as SendIcon } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext";
import { useContext } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

const Contact = () => {
  const { email: authEmail } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: authEmail || "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [contactInfo, setContactInfo] = useState({
    phoneNumbers: [],
    email: "",
    businessHours: [],
    officeLocation: "",
    mapIframeSrc: "", // added field for iframe src
  });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const scrollRef = useRef(null);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  // Add CSS styles for draft-js toolbar dark mode (copied from hero-section.js)
  const draftDarkModeStyles = `
    .rdw-editor-toolbar {
      background-color: #1f2937 !important;
      border: 1px solid #374151 !important;
    }
    .rdw-option-wrapper {
      background-color: #374151 !important;
      border: 1px solid #4b5563 !important;
      color: #f9fafb !important;
    }
    .rdw-option-wrapper:hover {
      background-color: #4b5563 !important;
      border-color: #6b7280 !important;
    }
    .rdw-dropdown-wrapper {
      background-color: #374151 !important;
      border: 1px solid #4b5563 !important;
      color: #f9fafb !important;
    }
    .rdw-dropdown-wrapper:hover {
      background-color: #4b5563 !important;
      border-color: #6b7280 !important;
    }
    .rdw-dropdown-optionwrapper {
      background-color: #1f2937 !important;
      color: #f9fafb !important;
    }
    .rdw-dropdownoption-default {
      color: #f9fafb !important;
    }
    .rdw-dropdownoption-active {
      background-color: #2563eb !important;
      color: white !important;
    }
    .rdw-inline-wrapper {
      color: #f9fafb !important;
    }
  `;

  // Inject style tag for dark mode styles if darkMode is true
  useEffect(() => {
    let styleTag = document.getElementById("draft-dark-mode-styles");
    if (darkMode) {
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "draft-dark-mode-styles";
        styleTag.innerHTML = draftDarkModeStyles;
        document.head.appendChild(styleTag);
      }
    } else {
      if (styleTag) {
        styleTag.remove();
      }
    }
  }, [darkMode]);
  useEffect(() => {
    if (authEmail) {
      const fetchProfileData = async () => {
        try {
          const res = await fetch(
            `/api/auth/client-personal-details?email=${encodeURIComponent(
              authEmail
            )}`
          );
          if (!res.ok) {
            throw new Error("Failed to fetch profile data");
          }
          const data = await res.json();
          setProfileName(data.fullName || "");
          setFormData((prev) => ({
            ...prev,
            name: data.fullName || "",
            email: authEmail,
          }));
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };
      fetchProfileData();
    }
  }, [authEmail]);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await fetch("/api/admin/contactInfo");
        if (!res.ok) {
          throw new Error("Failed to fetch contact info");
        }
        const data = await res.json();
        if (data) {
          // Parse businessHours string to array of objects
          let businessHoursArray = [];
          if (
            typeof data.businessHours === "string" &&
            data.businessHours.trim() !== ""
          ) {
            businessHoursArray = data.businessHours
              .split(";")
              .map((entry) => {
                const trimmed = entry.trim();
                // Expected format: "Monday 09:00 - 18:00"
                const match = trimmed.match(
                  /^(\w+)\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/
                );
                if (match) {
                  return { day: match[1], start: match[2], end: match[3] };
                }
                return null;
              })
              .filter(Boolean);
          } else if (Array.isArray(data.businessHours)) {
            businessHoursArray = data.businessHours;
          }
          setContactInfo({
            phoneNumbers: data.phoneNumbers || [],
            email: data.email || "",
            businessHours: businessHoursArray,
            officeLocation: data.officeLocation || "",
            mapIframeSrc: data.mapIframeSrc || "", // added mapIframeSrc to state
          });
          // Initialize editorState from message if available
          if (data.message) {
            try {
              const contentState = convertFromRaw(JSON.parse(data.message));
              setEditorState(EditorState.createWithContent(contentState));
            } catch {
              setEditorState(EditorState.createEmpty());
            }
          }
        } else {
          setContactInfo({
            phoneNumbers: [],
            email: "",
            businessHours: [],
            officeLocation: "",
            mapIframeSrc: "",
          });
          setEditorState(EditorState.createEmpty());
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };
    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onEditorStateChange = (newState) => {
    setEditorState(newState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authEmail) {
      alert("You must be logged in to send a message.");
      return;
    }

    setIsLoading(true);
    try {
      const messageRaw = editorState.getCurrentContent().getPlainText();
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, message: messageRaw }),
      });
      if (response.ok) {
        setShowSuccess(true);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to send message.");
      }
    } catch (error) {
      alert("An error occurred while sending the message.");
      console.error("Contact form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    window.location.reload(); // Refresh the page
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollBy({
        left: e.deltaY,
        behavior: "smooth",
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <motion.main
        className="flex-grow max-w-3xl mx-auto p-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:col-span-2 flex flex-col"
            style={{ minHeight: "100px" }}
          >
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-5 right-5 max-w-sm w-full bg-white dark:bg-gray-800 border border-green-400 shadow-lg rounded-lg p-4 flex items-center space-x-4 z-50"
                role="alert"
              >
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-500"
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    Success! Thank you for your message!
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleCloseSuccess}
                    className="inline-flex text-green-500 hover:text-green-700 dark:hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded"
                    aria-label="Close"
                  >
                    <svg
                      className="h-5 w-5"
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
                  </button>
                </div>
              </motion.div>
            )}
            <div className="flex-grow space-y-4">
              <label className="block">
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Name
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  readOnly
                  required
                  className="mt-1 block w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600 focus:ring-opacity-50 transition cursor-not-allowed"
                />
              </label>
              <label className="block">
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  required
                  className="mt-1 block w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600 focus:ring-opacity-50 transition cursor-not-allowed"
                />
              </label>
              <label className="block mt-4">
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Message
                </span>
                <Editor
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                  toolbarClassName={darkMode ? "toolbar-dark" : "toolbar-light"}
                  wrapperClassName={darkMode ? "wrapper-dark" : "wrapper-light"}
                  editorClassName={darkMode ? "editor-dark" : "editor-light"}
                  toolbar={
                    darkMode
                      ? {
                          options: [
                            "inline",
                            "blockType",
                            "list",
                            "textAlign",
                            "colorPicker",
                            "link",
                            "remove",
                            "history",
                          ],
                          inline: {
                            options: [
                              "bold",
                              "italic",
                              "underline",
                              "strikethrough",
                            ],
                          },
                          blockType: {
                            options: [
                              "Normal",
                              "H1",
                              "H2",
                              "H3",
                              "H4",
                              "H5",
                              "H6",
                              "Blockquote",
                              "Code",
                            ],
                          },
                          list: {
                            options: [
                              "unordered",
                              "ordered",
                              "indent",
                              "outdent",
                            ],
                          },
                          // Custom toolbar styles for dark mode
                          style: {
                            backgroundColor: "#1f2937",
                            color: "#f9fafb",
                          },
                        }
                      : {
                          options: [
                            "inline",
                            "blockType",
                            "list",
                            "textAlign",
                            "colorPicker",
                            "link",
                            "remove",
                            "history",
                          ],
                          inline: {
                            options: [
                              "bold",
                              "italic",
                              "underline",
                              "strikethrough",
                            ],
                          },
                          blockType: {
                            options: [
                              "Normal",
                              "H1",
                              "H2",
                              "H3",
                              "H4",
                              "H5",
                              "H6",
                              "Blockquote",
                              "Code",
                            ],
                          },
                          list: {
                            options: [
                              "unordered",
                              "ordered",
                              "indent",
                              "outdent",
                            ],
                          },
                          // Custom toolbar styles for light mode
                          style: {
                            backgroundColor: "#f3f4f6",
                            color: "#111827",
                          },
                        }
                  }
                  placeholder="Enter your message here..."
                />
              </label>
            </div>
            <div className="mt-2 lg:mt-6" />
            <button
              type="submit"
              disabled={isLoading || showSuccess}
              className={`w-full bg-pink-600 dark:bg-pink-700 text-white py-3 text-lg rounded-lg transition mt-2 lg:mt-6 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                isLoading || showSuccess
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-pink-700 dark:hover:bg-pink-800"
              }`}
            >
              {isLoading ? (
                <>
                  Sending...
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                </>
              ) : (
                <>
                  Send Message <SendIcon />
                </>
              )}
            </button>
          </form>

          {/* Contact Info and Map */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-300">
                Contact Information
              </h2>
              <p>
                <strong>Phone:</strong> {contactInfo.phoneNumbers.join(", ")}
              </p>
              <p>
                <strong>Email:</strong> {contactInfo.email}
              </p>
              <p>
                <strong>Location:</strong> {contactInfo.officeLocation}
              </p>
              <p>
                <strong>Business Hours:</strong>
                <br />
              </p>
              {contactInfo.businessHours.length > 0 ? (
                <ul>
                  {contactInfo.businessHours.map((bh, index) => (
                    <li key={index}>
                      {bh.day}: {bh.start} - {bh.end}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Not available</p>
              )}
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <iframe
                title="BD Wedding Planner Location"
                src={contactInfo.mapIframeSrc}
                width="100%"
                height="200"
                allowFullScreen=""
                loading="lazy"
                className="border-0"
              ></iframe>
            </div>
          </div>
        </div>
      </motion.main>

      <div className="w-full max-w-screen-xl mx-auto flex justify-center mt-2 mb-0">
        <a
          href="https://wa.me/8801234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 dark:bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-600 dark:hover:bg-green-800 transition mx-auto shadow-md hover:shadow-lg"
        >
          Chat with us on WhatsApp
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
