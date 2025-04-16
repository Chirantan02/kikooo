"use client";

import { useState, useEffect } from "react";
import IntroAnimation from "@/components/IntroAnimation";
import SimpleGallery from "../components/SimpleGallery";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  // Auto-hide intro after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 8000); // 8 seconds for the intro animation

    return () => clearTimeout(timer);
  }, []);

  // Handle manual skip
  const handleSkipIntro = () => {
    setShowIntro(false);
  };

  return (
    <main className="relative w-full bg-black">
      {showIntro ? (
        <>
          <IntroAnimation />
          <button
            onClick={handleSkipIntro}
            className="fixed bottom-4 right-4 bg-white bg-opacity-20 text-white px-4 py-2 rounded-md z-50 hover:bg-opacity-30 transition-all"
          >
            Skip Intro
          </button>
        </>
      ) : (
        <SimpleGallery />
      )}
    </main>
  );
}
