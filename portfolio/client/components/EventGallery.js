import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const EventGallery = () => {
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [events, setEvents] = useState([]);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxCurrentIndex, setLightboxCurrentIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState("");
  const [lightboxDescription, setLightboxDescription] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    // Fetch PortfolioEvents from API
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);

        // Extract unique categories from events
        const uniqueCategories = Array.from(new Set(data.map(event => event.category)));
        setCategories(["All", ...uniqueCategories]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
  }, []);

  // Filter events by selected category
  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter(event => event.category === selectedCategory);

  // Display one card per event using the first image of each event
  const filteredImages = filteredEvents.map(event => ({
    id: event._id,
    src: event.images.length > 0 ? event.images[0] : "", // use first image or empty string
    category: event.category,
    title: event.title,
    description: event.description,
    images: event.images,
  }));

  useEffect(() => {
    const el = containerRef.current;
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

  // Auto slide lightbox images every 2 seconds
  useEffect(() => {
    if (lightboxImages.length === 0) return;
    const interval = setInterval(() => {
      setLightboxCurrentIndex((prevIndex) => (prevIndex + 1) % lightboxImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [lightboxImages]);

  return (
    <section id="portfolio" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-pink-700 dark:text-pink-300 mb-8">
          Event Gallery
        </h2>
        <div className="mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`mx-2 px-4 py-2 rounded-full font-semibold transition ${
                selectedCategory === cat
                  ? "bg-pink-600 text-white"
                  : "bg-pink-200 dark:bg-pink-700 text-pink-700 dark:text-pink-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <motion.div
          ref={containerRef}
          className="flex flex-wrap gap-6 overflow-x-scroll pb-4 scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          whileTap={{ cursor: "grabbing" }}
        >
          {filteredImages.slice(0, 8).map((img) => (
            <motion.img
              key={img.id}
              src={img.src}
              alt={img.category}
              className="rounded-lg cursor-pointer shadow-lg w-[calc(25%-1.5rem)]"
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                // Find the event for this image
                const event = filteredEvents.find(ev =>
                  ev.images.includes(img.src)
                );
                if (event && event.images.length > 0) {
                  setLightboxImages(event.images);
                  setLightboxCurrentIndex(0);
                  setLightboxTitle(event.title);
                  setLightboxDescription(event.description);
                } else {
                  setLightboxImages([img.src]);
                  setLightboxCurrentIndex(0);
                  setLightboxTitle("");
                  setLightboxDescription("");
                }
              }}
            />
          ))}
        </motion.div>
      </div>

      {lightboxImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => {
            setLightboxImages([]);
            setLightboxCurrentIndex(0);
          }}
        >
          <div className="max-w-4xl mx-auto text-center text-white">
            <h3 className="text-2xl font-bold mb-2">{lightboxTitle}</h3>
            <p className="mb-4 whitespace-pre-wrap">
              {(() => {
                try {
                  const rawContent = JSON.parse(lightboxDescription);
                  if (rawContent && rawContent.blocks) {
                    return rawContent.blocks.map(block => block.text).join('\n');
                  }
                  return lightboxDescription;
                } catch (e) {
                  return lightboxDescription;
                }
              })()}
            </p>
            <img
              src={lightboxImages[lightboxCurrentIndex]}
              alt="Lightbox"
              className="w-full h-[500px] object-contain rounded-lg mx-auto"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default EventGallery;
