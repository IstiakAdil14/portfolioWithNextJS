import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";

import { DarkModeContext } from "../context/DarkModeContext";
import { useContext } from "react";
import draftToHtml from "draftjs-to-html";

const ServicePackages = () => {
  const { isAuthenticated, accessToken } = useAuth();
  const router = useRouter();
  const { darkMode } = useContext(DarkModeContext);

  const [packages, setPackages] = useState([]);
  const [customizeServices, setCustomizeServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [showCustomizeForm, setShowCustomizeForm] = useState(false);
  const [customDetails, setCustomDetails] = useState({
    selectedCategory: "",
    selectedEventType: "",
    guestCount: "",
    specialRequests: "",
    ratePerGuest: 0,
    categoryDescription: "",
    totalPrice: 0,
    paymentMethod: "sslcommerz",
    paymentAccountNumber: "",
    paymentAccountNumberError: "",
  });

  const getTomorrowDateString = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: getTomorrowDateString(),
  });

  // Disable editing of name, email, phone if user is authenticated
  const isUserAuthenticated = !!userDetails.email;

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/services");
        if (!response.ok) {
          throw new Error("Failed to fetch packages");
        }
        const data = await response.json();
        const packagesWithCustomize = [
          ...data,
          {
            _id: "customize",
            title: "Customize Package",
            description: "",
            price: "",
          },
        ];
        setPackages(packagesWithCustomize);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    const fetchCustomizeServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/customizeServices"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch customized services");
        }
        const data = await response.json();
        setCustomizeServices(data);

        // Derive unique categories from customizeServices data
        const uniqueCategories = [
          ...new Set(data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);

        // If a category is already selected, filter event types for that category
        if (customDetails.selectedCategory) {
          const filteredEventTypes = data
            .filter((item) => item.category === customDetails.selectedCategory)
            .map((item) => item.eventType);
          setEventTypes([...new Set(filteredEventTypes)]);
        } else {
          setEventTypes([]);
        }
      } catch (error) {
        console.error("Error fetching customized services:", error);
      }
    };

    fetchPackages();
    fetchCustomizeServices();
  }, []);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      const fetchProfileData = async () => {
        try {
          const decoded = JSON.parse(
            atob(
              accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
            )
          );
          const email =
            decoded.email ||
            decoded.user_email ||
            decoded.sub ||
            decoded.username ||
            null;
          if (email) {
            const res = await fetch(
              `http://localhost:5000/api/auth/client-personal-details?email=${encodeURIComponent(
                email
              )}`
            );
            if (res.ok) {
              const profile = await res.json();
              setUserDetails((prev) => ({
                ...prev,
                name: profile.fullName || "",
                email: profile.email || "",
                phone: profile.phoneNumber || "",
              }));
            }
          }
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
        }
      };
      fetchProfileData();
    }
  }, [isAuthenticated, accessToken]);

  const handleOpenCustomize = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    const tomorrowStr = `${yyyy}-${mm}-${dd}`;
    setUserDetails((prev) => ({
      ...prev,
      eventDate: tomorrowStr,
    }));
    setShowCustomizeForm(true);
  };

  const handleCloseCustomize = () => {
    setShowCustomizeForm(false);
    setCustomDetails({
      selectedCategory: "",
      selectedEventType: "",
      guestCount: "",
      specialRequests: "",
      ratePerGuest: 0,
      categoryDescription: "",
      totalPrice: 0,
    });
    setUserDetails({
      name: "",
      email: "",
      phone: "",
      eventDate: "",
    });
    setEventTypes([]); // Clear event types on close
  };

  const calculatePrice = (guestCount, ratePerGuest) => {
    const guests = parseInt(guestCount, 10);
    const rateGuest = parseFloat(ratePerGuest);
    if (isNaN(guests) || isNaN(rateGuest)) return 0;
    return guests * rateGuest;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedDetails = { ...customDetails, [name]: value };

    if (name === "selectedCategory") {
      // When category changes, update event types accordingly
      const filteredEventTypes = customizeServices
        .filter((item) => item.category === value)
        .map((item) => item.eventType);
      setEventTypes([...new Set(filteredEventTypes)]);

      // Reset selectedEventType when category changes
      updatedDetails.selectedEventType = "";
    }

    if (name === "selectedCategory" || name === "selectedEventType") {
      const matchedService = customizeServices.find(
        (cs) =>
          cs.category ===
            (name === "selectedCategory"
              ? value
              : customDetails.selectedCategory) &&
          cs.eventType ===
            (name === "selectedEventType"
              ? value
              : customDetails.selectedEventType)
      );
      if (matchedService) {
        updatedDetails.ratePerGuest = matchedService.ratePerGuest;
        updatedDetails.categoryDescription = matchedService.categoryDescription;
      } else {
        updatedDetails.ratePerGuest = 0;
        updatedDetails.categoryDescription = "";
      }
    }

    updatedDetails.totalPrice = calculatePrice(
      updatedDetails.guestCount,
      updatedDetails.ratePerGuest
    );

    setCustomDetails(updatedDetails);
  };

  const handlePaymentMethodSelect = (methodId) => {
    setCustomDetails((prev) => ({ ...prev, paymentMethod: methodId }));
  };

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    if (name === "eventDate") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (selectedDate < tomorrow) {
        alert("Event date must be from tomorrow onwards.");
        return;
      }
    }
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("You must be logged in to submit a booking.");
      router.push("/login");
      return;
    }

    if (
      !userDetails.name ||
      !userDetails.email ||
      !userDetails.phone ||
      !userDetails.eventDate ||
      !customDetails.paymentMethod ||
      !customDetails.paymentAccountNumber
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Validation for paymentAccountNumber
    const { paymentMethod, paymentAccountNumber } = customDetails;

    // Bangladeshi phone number regex: starts with +880 or 01 and total 11 digits after 0 or +880
    const bdPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;

    // Card number example suggestions for other payment methods
    const cardNumberExamples = {
      visa: "e.g. 4111 1111 1111 1111",
      mastercard: "e.g. 5500 0000 0000 0004",
      amex: "e.g. 3400 0000 0000 009",
      paypal: "e.g. paypal-account-001",
      sslcommerz: "e.g. sslcommerz-account-001",
    };

    if (paymentMethod === "nogod" || paymentMethod === "bkash") {
      if (!bdPhoneRegex.test(paymentAccountNumber)) {
        alert(
          "Please enter a valid Bangladeshi phone number for the selected payment method."
        );
        return;
      }
    } else {
      // Stronger validation: check if paymentAccountNumber matches card number pattern (digits only, length 13-19) and passes Luhn check
      const cardNumberDigits = paymentAccountNumber.replace(/\s/g, '');
      const cardNumberPattern = /^[0-9]{13,19}$/;

      function luhnCheck(num) {
        let sum = 0;
        let shouldDouble = false;
        for (let i = num.length - 1; i >= 0; i--) {
          let digit = parseInt(num.charAt(i), 10);
          if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
          }
          sum += digit;
          shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
      }

      if (
        !paymentAccountNumber ||
        !cardNumberPattern.test(cardNumberDigits) ||
        /^0+$/.test(cardNumberDigits) ||
        !luhnCheck(cardNumberDigits)
      ) {
        alert(
          `Please enter a valid card number for the selected payment method. ${cardNumberExamples[paymentMethod] || ""}`
        );
        return;
      }
    }

    const bookingData = {
      packageId: null,
      packageName: "Customize Package",
      name: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phone,
      eventDate: userDetails.eventDate,
      specialRequests: customDetails.specialRequests,
      paymentMethod: customDetails.paymentMethod,
      paymentAccountNumber: customDetails.paymentAccountNumber,
    };

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Failed to submit booking: " + errorData.error);
        return;
      }

      alert("Booking submitted successfully!");
      handleCloseCustomize();
    } catch (error) {
      alert("Error submitting booking: " + error.message);
    }
  };

  const handlePackageClick = (pkg) => {
    if (pkg.title === "Customize Package") {
      handleOpenCustomize();
    } else {
      router.push(`/packages/${pkg._id}`);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-pink-300 to-purple-300 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-5xl font-extrabold text-white mb-8">
          Our Service Packages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {packages
            .filter((pkg) => pkg.enabled === true || pkg._id === "customize")
            .map((pkg) => (
              <motion.div
                key={pkg._id}
                className={`bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg transition-transform transform hover:scale-105 cursor-pointer ${
                  pkg.title === "Customize Package"
                    ? "border-4 border-dashed border-pink-600"
                    : ""
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => handlePackageClick(pkg)}
              >
                <h3 className="text-3xl font-bold text-pink-600 dark:text-pink-300 mb-4">
                  {pkg.title}
                </h3>
                {(() => {
                  let descriptionHtml = "";
                  try {
                    if (
                      pkg.description &&
                      (pkg.description.trim().startsWith("{") ||
                        pkg.description.trim().startsWith("["))
                    ) {
                      const rawContent = JSON.parse(pkg.description);
                      if (
                        rawContent &&
                        rawContent.blocks &&
                        rawContent.entityMap !== undefined
                      ) {
                        descriptionHtml = draftToHtml(rawContent);
                      }
                    }
                  } catch (e) {
                    console.error("Error parsing package description:", e);
                    descriptionHtml = pkg.description || "";
                  }
                  return (
                    <p
                      className="text-gray-700 dark:text-gray-300 mb-6"
                      dangerouslySetInnerHTML={{
                        __html:
                          descriptionHtml ||
                          (pkg.title === "Customize Package"
                            ? "Click to customize your package"
                            : ""),
                      }}
                    />
                  );
                })()}
                <p className="text-2xl font-semibold text-pink-700 dark:text-pink-400">
                  {pkg.price} {pkg.title !== "Customize Package" ? "tk" : ""}
                </p>
              </motion.div>
            ))}
        </div>
      </div>
      {showCustomizeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-full w-full max-w-md sm:max-w-lg md:max-w-xl shadow-lg mx-auto relative"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              type="button"
              onClick={handleCloseCustomize}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Customize Your Package
            </h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 text-gray-900 dark:text-white"
            >
              <div>
                <label
                  htmlFor="selectedCategory"
                  className="block font-semibold mb-1"
                >
                  Select Category
                </label>
                <select
                  id="selectedCategory"
                  name="selectedCategory"
                  value={customDetails.selectedCategory}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
                  required
                >
                  <option value="" disabled>
                    -- Select a category --
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="selectedEventType"
                  className="block font-semibold mb-1"
                >
                  Select Event Type
                </label>
                <select
                  id="selectedEventType"
                  name="selectedEventType"
                  value={customDetails.selectedEventType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
                  required
                >
                  <option value="" disabled>
                    -- Select an event type --
                  </option>
                  {eventTypes.map((et) => (
                    <option key={et} value={et}>
                      {et}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-2 font-semibold">Category Description:</p>
                {(() => {
                  let descriptionHtml = "";
                  try {
                    if (
                      customDetails.categoryDescription &&
                      (customDetails.categoryDescription.trim().startsWith("{") ||
                        customDetails.categoryDescription.trim().startsWith("["))
                    ) {
                      const rawContent = JSON.parse(customDetails.categoryDescription);
                      if (
                        rawContent &&
                        rawContent.blocks &&
                        rawContent.entityMap !== undefined
                      ) {
                        descriptionHtml = draftToHtml(rawContent);
                      }
                    }
                  } catch (e) {
                    console.error("Error parsing categoryDescription:", e);
                    descriptionHtml = customDetails.categoryDescription || "";
                  }
                  return (
                    <p
                      className="mb-4"
                      dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                    />
                  );
                })()}
              </div>
              <div>
                <label
                  htmlFor="guestCount"
                  className="block font-semibold mb-1"
                >
                  Number of Guests
                </label>
                <input
                  type="number"
                  id="guestCount"
                  name="guestCount"
                  value={customDetails.guestCount}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
                />
              </div>
              <div>
                <label
                  htmlFor="ratePerGuest"
                  className="block font-semibold mb-1"
                >
                  Rate Per Guest (BDT)
                </label>
                <input
                  type="number"
                  id="ratePerGuest"
                  name="ratePerGuest"
                  value={customDetails.ratePerGuest}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="name" className="block font-semibold mb-1">
                  Name
                </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userDetails.name}
                onChange={handleUserDetailsChange}
                required
                disabled={isUserAuthenticated}
                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
              />
              </div>
              <div>
                <label htmlFor="email" className="block font-semibold mb-1">
                  Email
                </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userDetails.email}
                onChange={handleUserDetailsChange}
                required
                disabled={isUserAuthenticated}
                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
              />
              </div>
              <div>
                <label htmlFor="phone" className="block font-semibold mb-1">
                  Phone
                </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={userDetails.phone}
                onChange={handleUserDetailsChange}
                required
                disabled={isUserAuthenticated}
                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
              />
              </div>
              <div>
                <label htmlFor="eventDate" className="block font-semibold mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={userDetails.eventDate}
                  onChange={handleUserDetailsChange}
                  min={getTomorrowDateString()}
                  required
                  className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
                />
              </div>
              <div>
                <label
                  htmlFor="paymentAccountNumber"
                  className="block font-semibold mb-1 text-black dark:text-white"
                >
                  {customDetails.paymentMethod === "nogod" ||
                  customDetails.paymentMethod === "bkash"
                    ? "Number"
                    : "Account Number"}
                </label>
                <input
                  type="text"
                  id="paymentAccountNumber"
                  name="paymentAccountNumber"
                  value={customDetails.paymentAccountNumber}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white ${
                    customDetails.paymentAccountNumberError
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder={
                    customDetails.paymentMethod === "nogod" ||
                    customDetails.paymentMethod === "bkash"
                      ? "Enter your number"
                      : "Enter your account number"
                  }
                />
                {customDetails.paymentAccountNumberError && (
                  <p className="mt-1 text-sm text-red-600">
                    {customDetails.paymentAccountNumberError}
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
                  {[
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
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => handlePaymentMethodSelect(method.id)}
                      className={`border rounded p-2 cursor-pointer transition ${
                        customDetails.paymentMethod === method.id
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
                Submit
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ServicePackages;
