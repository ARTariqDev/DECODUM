import React from "react";

const Log = ({ title, date, desc }) => {
  return (
    <article
      className="w-[95%] max-w-4xl border border-[#fff8de]/30 rounded-2xl p-6 mb-8
      backdrop-blur-md text-[#fff8de] shadow-lg"
      style={{
        fontFamily: "Anta-Regular, monospace",
      }}
    >

      <h1
        className="text-3xl md:text-5xl font-bold mb-2 text-center md:text-left"
        style={{
          WebkitTextStroke: "1.5px #fff8de",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 8px #fff8de",
        }}
      >
        {title}
      </h1>


      <p className="text-sm md:text-base text-[#fff8de]/70 mb-6 text-center md:text-left">
        {date}
      </p>


      <div className="prose prose-invert max-w-none text-justify text-base md:text-lg leading-relaxed">
        {desc}
      </div>
    </article>
  );
};

export default Log;
