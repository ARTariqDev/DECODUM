"use client";
import { useState } from "react";
import LogCard from "@/components/LogCard";
import Log from "@/components/Log";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import logs from "./LogData.json"; // ✅ Import JSON

const LogPage = () => {
  const [selectedLog, setSelectedLog] = useState(null);

  return (
    <main className="min-h-screen flex flex-col bg-black/80 text-[#fff8de]">
      {/* Navbar stays at top */}
      <div className="mt-[5rem]">
        <Navbar />
      </div>

      {/* Page Content */}
      <div className="flex-grow flex flex-col items-center justify-start py-10 px-4">
        {selectedLog ? (
          <div className="w-full flex flex-col items-center max-w-4xl animate-fadeIn">
            <Log
              title={selectedLog.title}
              date={selectedLog.date}
              desc={selectedLog.desc}
            />
            <button
              onClick={() => setSelectedLog(null)}
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
                onClick={() => setSelectedLog(log)}
                className="cursor-pointer transform hover:scale-[1.02] transition duration-300"
              >
                <LogCard
                  title={log.title}
                  date={log.date}
                  desc={log.desc}
                  onView={() => setSelectedLog(log)} // ✅ for "View Log" button
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer stays at bottom */}
      <Footer />
    </main>
  );
};

export default LogPage;
