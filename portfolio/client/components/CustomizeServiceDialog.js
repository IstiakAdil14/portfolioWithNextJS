import React, { useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';

const CustomizeServiceDialog = ({ isOpen, onClose, onSave }) => {
  const [categories, setCategories] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    categoryDescription: "",
    eventType: "",
    ratePerGuest: 0,
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchEventTypes();
      setFormData({
        category: "",
        categoryDescription: "",
        eventType: "",
        ratePerGuest: 0,
      });
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchEventTypes = async () => {
    try {
      const res = await fetch("/api/eventTypes");
      if (res.ok) {
        const data = await res.json();
        setEventTypes(data);
      }
    } catch (error) {
      console.error("Failed to fetch event types:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === "category") {
      const selectedCategory = categories.find((cat) => cat._id === value);
      updatedData.categoryDescription = selectedCategory ? selectedCategory.description : "";
    }

    if (name === "ratePerGuest") {
      updatedData.ratePerGuest = parseFloat(value) || 0;
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/customizeServices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert("Failed to save customize service: " + errorData.error);
        return;
      }
      alert("Customize service saved successfully!");
      onSave();
      onClose();
    } catch (error) {
      alert("Error saving customize service: " + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-lg mx-auto relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Add Customize Service
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-900 dark:text-white">
          <div>
            <label htmlFor="category" className="block font-semibold mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="mb-2 font-semibold">Category Description:</p>
            <p className="mb-4">{formData.categoryDescription}</p>
          </div>
          <div>
            <label htmlFor="eventType" className="block font-semibold mb-1">
              Event Type
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
            >
              <option value="">Select Event Type</option>
              {eventTypes.map((et) => (
                <option key={et._id} value={et.name}>
                  {et.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ratePerGuest" className="block font-semibold mb-1">
              Rate Per Guest (BDT)
            </label>
            <input
              type="number"
              id="ratePerGuest"
              name="ratePerGuest"
              value={formData.ratePerGuest}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomizeServiceDialog;
