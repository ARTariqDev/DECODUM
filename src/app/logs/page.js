"use client";
import { useState, useRef, useEffect } from "react";
import LogCard from "@/components/LogCard";
import Log from "@/components/Log";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import logs from "./LogData.json";

const LogPage = () => {
  const [selectedLog, setSelectedLog] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedLogIndex, setSelectedLogIndex] = useState(null);
  const scrollContainerRef = useRef(null);
  const logRefs = useRef([]);

  // Effect to handle scroll restoration when returning to logs list
  useEffect(() => {
    if (!selectedLog && selectedLogIndex !== null && scrollContainerRef.current) {
      // Wait for the DOM to fully render, then scroll to the log that was clicked
      setTimeout(() => {
        if (logRefs.current[selectedLogIndex]) {
          logRefs.current[selectedLogIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
    }
  }, [selectedLog, selectedLogIndex]);

  const handleLogSelect = (log, index) => {
    // Save which log was clicked
    setSelectedLogIndex(index);
    // Also save scroll position as backup
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollTop);
    }
    setSelectedLog(log);
  };

  const handleBackToLogs = () => {
    setSelectedLog(null);
    // The useEffect will handle scrolling back to the selected log
  };

  return (
    <main className="min-h-screen flex flex-col bg-black/80 text-[#fff8de] ">

      <div className="mt-[5rem]">
        <Navbar />
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-grow flex flex-col items-center justify-start py-10 px-10 overflow-y-auto"
      >
        {selectedLog ? (
          <div className="w-full flex flex-col items-center max-w-4xl animate-fadeIn">
            <Log
              title={selectedLog.title}
              date={selectedLog.date}
              desc={selectedLog.desc}
            />
            <button
              onClick={handleBackToLogs}
              className="mt-8 px-6 py-2 rounded-lg border border-[#fff8de]/50 
              text-[#fff8de] hover:bg-[#fff8de]/10 hover:shadow-[0_0_12px_#fff8de]
              transition-all duration-300"
            >
              ← Back to Logs
            </button>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl animate-fadeIn">
            {logs.map((log, idx) => (
              <div
                key={idx}
                ref={(el) => (logRefs.current[idx] = el)}
                onClick={() => handleLogSelect(log, idx)}
                className="cursor-pointer transform hover:scale-[1.02] transition duration-300"
              >
                <LogCard
                  title={log.title}
                  date={log.date}
                  desc={log.desc}
                  onView={() => handleLogSelect(log, idx)} 
                />
              </div>
            ))}
          </div>
        )}
      </div>

 
      <Footer />
    </main>
  );
};

export default LogPage;
