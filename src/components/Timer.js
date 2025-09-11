import React, { useEffect, useState } from "react";

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const Timer = ({ secondsLeft, onExpire }) => {
  const [time, setTime] = useState(secondsLeft);

  useEffect(() => {
    setTime(secondsLeft);
  }, [secondsLeft]);

  useEffect(() => {
    if (time <= 0) {
      onExpire && onExpire();
      return;
    }
    const interval = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [time, onExpire]);

  return (
    <div className="fixed right-4 top-2 w-24 bg-[#181818] border border-[#fff8de]/30 rounded-xl px-2 py-1 text-[#fff8de] font-mono shadow-lg z-[100] flex items-center justify-center text-lg">
      {formatTime(time)}
    </div>
  );
};

export default Timer;
