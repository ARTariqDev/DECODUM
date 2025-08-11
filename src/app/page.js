"use client";

import Hero from "@/components/Hero";

export default function LandingPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: "#111111",
        backgroundImage: `radial-gradient(circle, rgba(255, 248, 222, 0.35) 0.8px, transparent 0.8px)`,
        backgroundSize: "22px 22px",
        backgroundPosition: "0 0"
      }}
    >
      <Hero />
    </main>
  );
}
