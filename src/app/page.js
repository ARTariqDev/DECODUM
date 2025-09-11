"use client";


import Hero from "@/components/Hero";
import { useEffect, useState } from "react";
import SavedLogoutModal from "@/components/SavedLogoutModal";

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.get("logout") === "1") {
        setShowModal(true);
        // Remove the param from the URL after showing
        url.searchParams.delete("logout");
        window.history.replaceState({}, document.title, url.pathname);
      }
    }
  }, []);

  return (
    <div className="film-grain-wrapper flex flex-col items-center justify-center space-y-4">
      <SavedLogoutModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <main
        className="min-h-screen"
        style={{
          backgroundColor: "#111111",
          backgroundImage: `radial-gradient(circle, rgba(255, 248, 222, 0.35) 0.8px, transparent 0.8px)`,
          backgroundSize: "22px 22px",
          backgroundPosition: "0 0",
          overflow: "hidden",
        }}
      >
        <div className="tv-turn-on-effect">
          <Hero />
        </div>
      </main>
    </div>
  );
}
