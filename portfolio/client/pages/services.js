import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

import { FaPaintBrush, FaUtensils, FaCamera, FaMusic } from "react-icons/fa";

import { Editor, EditorState, convertFromRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

const iconMap = {
  FaPaintBrush: (
    <FaPaintBrush className="w-12 h-12 text-pink-500 mb-4 mx-auto" />
  ),
  FaUtensils: <FaUtensils className="w-12 h-12 text-pink-500 mb-4 mx-auto" />,
  FaCamera: <FaCamera className="w-12 h-12 text-pink-500 mb-4 mx-auto" />,
  FaMusic: <FaMusic className="w-12 h-12 text-pink-500 mb-4 mx-auto" />,
};


const eventTypes = ["WEDDING", "reception", "Engagement", "OTHER"];

// Rate per guest based on event type
const ratePerGuestByEventType = {
  WEDDING: 500,
  reception: 400,
  Engagement: 300,
  OTHER: 200,
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/services");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchClientTextContent = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/clientTextContent"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch client text content");
        }
        const data = await response.json();
        if (data.content) {
          const rawContent = JSON.parse(data.content);
          const contentState = convertFromRaw(rawContent);
          setEditorState(EditorState.createWithContent(contentState));
        }
      } catch (error) {
        console.error("Error fetching client text content:", error);
      }
    };

    fetchClientTextContent();
  }, []);

  const handleServiceClick = (id) => {
    window.location.href = `/services/${id}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <motion.main
        className="flex-grow max-w-full md:max-w-7xl lg:max-w-6xl xl:max-w-5xl mx-auto p-4 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-6 text-center">Our Services</h1>
        <div className="text-lg leading-relaxed mb-12 max-w-3xl">
          <Editor
            editorState={editorState}
            readOnly={true}
            onChange={() => {}}
          />
        </div>
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div
              className="flex space-x-6 overflow-x-scroll pb-4 scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              whileTap={{ cursor: "grabbing" }}
              onMouseMove={(e) => {
                const container = e.currentTarget;
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the container
                const scrollWidth =
                  container.scrollWidth - container.clientWidth;
                const scrollPos = (x / container.clientWidth) * scrollWidth;
                container.scrollLeft = scrollPos;
              }}
            >
              {services.map((service) => {
                let descriptionHtml = "";
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
                      descriptionHtml = draftToHtml(rawContent);
                    }
                  }
                } catch (e) {
                  console.error("Error parsing service description:", e);
                  descriptionHtml = service.description || "";
                }
                return (
                  <motion.div
                    key={service._id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center text-center w-[300px] flex-shrink-0 cursor-grab mt-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => handleServiceClick(service._id)}
                  >
                    <div className="flex justify-center">
                      {(service.iconName && (service.iconName.startsWith("http://") || service.iconName.startsWith("https://"))) ? (
                        <img
                          src={service.iconName}
                          alt={service.title + " icon"}
                          className="w-12 h-12 mb-4 mx-auto object-contain"
                        />
                      ) : (
                        <FaPaintBrush className="w-12 h-12 text-pink-500 mb-4 mx-auto" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {service.title}
                    </h3>
                    <p
                      className="text-gray-700 dark:text-gray-300 mb-2"
                      dangerouslySetInnerHTML={{ __html: descriptionHtml || "" }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Services;
