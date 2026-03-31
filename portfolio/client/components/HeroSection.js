import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";
import { convertFromRaw, EditorState } from "draft-js";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

const HeroSection = ({ heroData }) => {
  const [heroTitleEditorState, setHeroTitleEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  const [heroSubtitleEditorState, setHeroSubtitleEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  const [heroCTA, setHeroCTA] = React.useState("");
  const [backgroundVideoPath, setBackgroundVideoPath] = React.useState("");

  React.useEffect(() => {
    if (heroData) {
      if (heroData.heroTitle) {
        try {
          const contentState = convertFromRaw(JSON.parse(heroData.heroTitle));
          setHeroTitleEditorState(EditorState.createWithContent(contentState));
        } catch {
          setHeroTitleEditorState(EditorState.createEmpty());
        }
      } else {
        setHeroTitleEditorState(EditorState.createEmpty());
      }

      if (heroData.heroSubtitle) {
        try {
          const contentState = convertFromRaw(JSON.parse(heroData.heroSubtitle));
          setHeroSubtitleEditorState(EditorState.createWithContent(contentState));
        } catch {
          setHeroSubtitleEditorState(EditorState.createEmpty());
        }
      } else {
        setHeroSubtitleEditorState(EditorState.createEmpty());
      }

      setHeroCTA(heroData.heroCTA || "Explore Our Services");
      const baseUrl = "http://localhost:5000";
      setBackgroundVideoPath(heroData.backgroundVideoPath ? baseUrl + heroData.backgroundVideoPath : "");
    }
  }, [heroData]);

  return (
    <section className="relative py-20">
      {/* Background video */}
      {backgroundVideoPath && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
        >
          <source src={backgroundVideoPath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      <motion.div
        className="relative max-w-7xl mx-auto px-4 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-pink-400 dark:via-red-400 dark:to-yellow-400 mb-4">
          <Editor
            editorState={heroTitleEditorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            toolbarHidden
            readOnly
          />
        </h1>
        <p className="text-xl text-pink-800 dark:text-pink-200 mb-8">
          <Editor
            editorState={heroSubtitleEditorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            toolbarHidden
            readOnly
          />
        </p>
        <button
          onClick={() => window.location.href = "/services"}
          className="inline-block bg-gradient-to-r from-pink-600 via-red-600 to-yellow-600 hover:from-pink-700 hover:via-red-700 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition"
        >
          {heroCTA}
        </button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
