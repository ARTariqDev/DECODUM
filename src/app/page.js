"use client";

import Hero from "@/components/Hero";

export default function LandingPage() {
  return (
    <div className="film-grain-wrapper flex flex-col items-center justify-center space-y-4">
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
