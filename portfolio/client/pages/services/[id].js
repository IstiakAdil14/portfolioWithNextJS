import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useContext } from "react";
import dynamic from "next/dynamic";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

const ServiceDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, email: authEmail } = useAuth();
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
  const paymentMethods = [
    {
      id: "visa",
      label: "Visa",
      imgSrc:
        "https://images.seeklogo.com/logo-png/40/2/visa-new-2021-logo-png_seeklogo-408695.png",
    },
    {
      id: "mastercard",
      label: "Mastercard",
      imgSrc:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN3UIU6wwFcaFvgR2Yydv9B_hzmo66KqWAqg&s",
    },
    {
      id: "amex",
      label: "American Express",
      imgSrc:
        "https://www.pngplay.com/wp-content/uploads/5/American-Express-Logo-Download-Free-PNG.png",
    },
    {
      id: "bkash",
      label: "Bkash",
      imgSrc:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSxmGezg2VnpLYNHpBqqhLVW98lMzRynlW5w&s",
    },
    {
      id: "nogod",
      label: "Nogod",
      imgSrc:
        "https://upload.wikimedia.org/wikipedia/bn/thumb/9/97/%E0%A6%A8%E0%A6%97%E0%A6%A6%E0%A7%87%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg/2560px-%E0%A6%A8%E0%A6%97%E0%A6%A6%E0%A7%87%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg.png",
    },
    {
      id: "paypal",
      label: "Paypal",
      imgSrc:
        "https://w7.pngwing.com/pngs/782/863/png-transparent-paypal-logo-paypal-logo-paypal-blue-text-trademark.png",
    },
  ];

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for image slider
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Booking form state
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    specialRequests: "",
    specialRequestsEditorState: EditorState.createEmpty(),
    paymentAccountNumber: "",
    paymentAccountNumberError: "",
    paymentMethod: "sslcommerz",
  });

  const handlePaymentMethodSelect = (methodId) => {
    setBookingDetails((prev) => ({ ...prev, paymentMethod: methodId }));
  };

  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/services/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch service");
        }
        const data = await res.json();
        setService(data);
        setBookingDetails((prev) => ({
          ...prev,
          specialRequests: data.specialRequests || "",
        }));
        setError(null);
        setCurrentImageIndex(0); // Reset slider index on new service load
      } catch (err) {
        setError(err.message);
        setService(null);
      }
      setLoading(false);
    };
    fetchService();
  }, [id]);

  // Automatic image slider effect
  useEffect(() => {
    if (!service || !service.image || service.image.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === service.image.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [service]);

  // Initialize specialRequestsEditorState from bookingDetails.specialRequests string
  useEffect(() => {
    if (
      bookingDetails.specialRequests &&
      typeof bookingDetails.specialRequests === "string"
    ) {
      try {
        const contentState = convertFromRaw(
          JSON.parse(bookingDetails.specialRequests)
        );
        setBookingDetails((prev) => ({
          ...prev,
          specialRequestsEditorState:
            EditorState.createWithContent(contentState),
        }));
      } catch {
        setBookingDetails((prev) => ({
          ...prev,
          specialRequestsEditorState: EditorState.createEmpty(),
        }));
      }
    }
  }, [bookingDetails.specialRequests]);

  // Fetch user profile to set name and email in booking form
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!authEmail) {
          throw new Error("No authenticated email available");
        }
        const res = await fetch(
          `http://localhost:5000/api/auth/client-personal-details?email=${encodeURIComponent(
            authEmail
          )}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const profileData = await res.json();
        if (profileData.email) {
          setBookingDetails((prev) => ({ ...prev, email: profileData.email }));
        }
        if (profileData.fullName) {
          setBookingDetails((prev) => ({
            ...prev,
            name: profileData.fullName,
          }));
        }
        if (profileData.phoneNumber) {
          setBookingDetails((prev) => ({
            ...prev,
            phone: profileData.phoneNumber,
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated, authEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecialRequestsChange = (editorState) => {
    setBookingDetails((prev) => ({
      ...prev,
      specialRequestsEditorState: editorState,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Redirect to login with redirect back to this page
      router.push(`/login?redirect=/services/${id}`);
      return;
    }
    try {
      const bookingEmail = authEmail || bookingDetails.email;
      const specialRequestsRaw = JSON.stringify(
        convertToRaw(
          bookingDetails.specialRequestsEditorState.getCurrentContent()
        )
      );

      // Validation for paymentAccountNumber
      const { paymentMethod, paymentAccountNumber } = bookingDetails;

      // Bangladeshi phone number regex: starts with +880 or 01 and total 11 digits after 0 or +880
      const bdPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;

      // Predefined account numbers for other payment methods (example)
      const accountNumbers = {
        visa: "1234567890",
        mastercard: "2345678901",
        amex: "3456789012",
        paypal: "paypal-account-001",
        sslcommerz: "sslcommerz-account-001",
      };

      if (paymentMethod === "nogod" || paymentMethod === "bkash") {
        if (!bdPhoneRegex.test(paymentAccountNumber)) {
          setBookingDetails((prev) => ({
            ...prev,
            paymentAccountNumberError:
              "Please enter a valid Bangladeshi phone number for the selected payment method.",
          }));
          return;
        }
      } else {
        if (accountNumbers[paymentMethod] !== paymentAccountNumber) {
          setBookingDetails((prev) => ({
            ...prev,
            paymentAccountNumberError:
              "The account number does not match the selected payment method's account number.",
          }));
          return;
        }
      }

      // Validate required fields before submission
      if (
        !bookingDetails.name ||
        !bookingEmail ||
        !bookingDetails.phone ||
        !bookingDetails.eventDate ||
        !bookingDetails.paymentMethod ||
        !bookingDetails.paymentAccountNumber
      ) {
        throw new Error("Missing required booking fields");
      }

      const response = await fetch(
        `http://localhost:5000/api/services/${id}/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packageName: service.title,
            name: bookingDetails.name,
            email: bookingEmail,
            phone: bookingDetails.phone,
            eventDate: bookingDetails.eventDate,
            specialRequests: specialRequestsRaw,
            paymentMethod: bookingDetails.paymentMethod,
            paymentAccountNumber: bookingDetails.paymentAccountNumber,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit booking");
      }
      setBookingSuccess(true);
      setBookingDetails({
        name: "",
        email: bookingEmail,
        phone: "",
        eventDate: "",
        specialRequestsEditorState: EditorState.createEmpty(),
        specialRequests: "",
        paymentAccountNumber: "",
        paymentAccountNumberError: "",
        paymentMethod: "sslcommerz",
      });
    } catch (error) {
      console.error("Booking submission error:", error);
      alert(`Booking failed: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div
        className={`p-8 text-center ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Loading service details...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-8 text-center ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Error: {error}
      </div>
    );
  }

  if (!service) {
    return (
      <div
        className={`p-8 text-center ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Service not found.
      </div>
    );
  }

  return (
    <section
      className={`max-w-3xl mx-auto p-8 ${
        darkMode ? "bg-gray-900" : "bg-white"
      } rounded-lg shadow-md`}
    >
      <h1
        className={`text-4xl font-bold mb-4 ${
          darkMode ? "text-pink-400" : "text-pink-600"
        }`}
      >
        {service.title}
      </h1>
      {service.image && service.image.length > 0 && (
        <div className="mb-6">
          <img
            src={service.image[currentImageIndex]}
            alt={service.title}
            className="w-full h-auto rounded shadow-md object-cover"
          />
        </div>
      )}
      <div
        className={`mb-4 p-4 border rounded italic ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-300"
            : "bg-pink-50 border-pink-200 text-gray-700"
        }`}
        dangerouslySetInnerHTML={{
          __html: (() => {
            try {
              if (
                service.description &&
                (service.description.trim().startsWith("{") ||
                  service.description.trim().startsWith("["))
              ) {
                const rawContent = JSON.parse(service.description);
                if (
                  rawContent &&
                  rawContent.blocks &&
                  rawContent.entityMap !== undefined
                ) {
                  return draftToHtml(rawContent);
                }
              }
            } catch (e) {
              console.error("Error parsing service description:", e);
            }
            return service.description || "";
          })(),
        }}
      ></div>
      {service.features && service.features.length > 0 && (
        <ul
          className={`mb-6 list-disc list-inside space-y-1 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg
                className={`w-5 h-5 mr-2 flex-shrink-0 ${
                  darkMode ? "text-pink-400" : "text-pink-600"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      )}
      <p
        className={`mb-8 text-2xl font-semibold ${
          darkMode ? "text-pink-400" : "text-pink-700"
        }`}
      >
        {service.price} tk
      </p>

      <h2 className="text-2xl font-semibold mb-4">Book this service</h2>

      {bookingSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded">
          Booking submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block font-semibold mb-1 text-black dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={bookingDetails.name}
            readOnly
            required
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white cursor-not-allowed"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block font-semibold mb-1 text-black dark:text-white"
          >
            Email
          </label>
          {isAuthenticated ? (
            <input
              type="email"
              id="email"
              name="email"
              value={authEmail}
              disabled
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white cursor-not-allowed"
            />
          ) : (
            <input
              type="email"
              id="email"
              name="email"
              value={bookingDetails.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
            />
          )}
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block font-semibold mb-1 text-black dark:text-white"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={bookingDetails.phone}
            readOnly
            required
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white cursor-not-allowed"
          />
        </div>
        <div>
          <label
            htmlFor="eventDate"
            className="block font-semibold mb-1 text-black dark:text-white"
          >
            Event Date
          </label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            value={bookingDetails.eventDate}
            onChange={handleChange}
            required
            min={
              new Date(new Date().setDate(new Date().getDate() + 1))
                .toISOString()
                .split("T")[0]
            }
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="specialRequests"
            className="block font-semibold mb-1 text-black dark:text-white"
          >
            Special Requests
          </label>
          <div
            style={{
              minHeight: "150px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "4px",
              backgroundColor: darkMode ? "#374151" : "white",
            }}
          >
            <div
              style={{
                minHeight: "150px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
                backgroundColor: darkMode ? "#374151" : "white",
                cursor: "text",
              }}
            >
              <Editor
                editorState={bookingDetails.specialRequestsEditorState}
                onEditorStateChange={handleSpecialRequestsChange}
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
                placeholder="Enter special requests here..."
              />
            </div>{" "}
          </div>
        </div>
        <div>
          <label
            htmlFor="paymentAccountNumber"
            className="block font-semibold mb-1 text-black dark:text-white"
          >
            {bookingDetails.paymentMethod === "nogod" ||
            bookingDetails.paymentMethod === "bkash"
              ? "Number"
              : "Account Number"}
          </label>
          <input
            type="text"
            id="paymentAccountNumber"
            name="paymentAccountNumber"
            value={bookingDetails.paymentAccountNumber}
            onChange={handleChange}
            required
            className={`w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white ${
              bookingDetails.paymentAccountNumberError
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder={
              bookingDetails.paymentMethod === "nogod" ||
              bookingDetails.paymentMethod === "bkash"
                ? "Enter your number"
                : "Enter your account number"
            }
          />
          {bookingDetails.paymentAccountNumberError && (
            <p className="mt-1 text-sm text-red-600">
              {bookingDetails.paymentAccountNumberError}
            </p>
          )}
        </div>
        <div className="mb-6">
          <p
            className={`mb-2 font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Pay With
          </p>
          <div className="flex flex-wrap gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => handlePaymentMethodSelect(method.id)}
                className={`border rounded p-2 cursor-pointer transition ${
                  bookingDetails.paymentMethod === method.id
                    ? "border-pink-600 ring-2 ring-pink-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                aria-label={method.label}
              >
                <img
                  src={method.imgSrc}
                  alt={method.label}
                  className="h-10 w-auto object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
        >
          Submit Booking
        </button>
      </form>
    </section>
    
  );
};

export default ServiceDetails;
