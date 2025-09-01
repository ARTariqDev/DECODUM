import React from "react";

const LogCard = ({ title, date, desc, onView }) => {
 
  const getPreviewText = (text) => {
    const jumbleText = (str) => {
      const chars = str.split('');
      for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      return chars.join('');
    };

    // Literally had to create our own templating language for this 🥀
    return text.replace(/\[HIDDEN\].*?\[\/HIDDEN\]/g, '') //hides text
               .replace(/\[BLUR\].*?\[\/BLUR\]/g, '') //blurs text (if ever needed)
               .replace(/\[SCRAMBLE\](.*?)\[\/SCRAMBLE\]/g, (match, content) => jumbleText(content)); //scrambles text
  };

  return (
    <div
      className="w-[90%] max-w-3xl border border-[#fff8de]/30 rounded-2xl p-5 mb-6
      backdrop-blur-sm text-[#fff8de] flex flex-col justify-between hover:shadow-[0_0_12px_#fff8de] 
      transition-all"
      style={{
        fontFamily: "Anta-Regular, monospace",
        height: "275px", // changed the height to 15rem cause they were too big before
      }}
    >

      <div>
        <h2
          className="text-xl font-bold tracking-wide text-center md:text-left"
          style={{
            WebkitTextStroke: "1px #fff8de",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 6px #fff8de",
          }}
        >
          {title}
        </h2>
        <span className="text-sm text-[#fff8de]/70">{date}</span>


        <div className="border-t border-[#fff8de]/30 my-2"></div>


        <div
          className="text-sm md:text-base leading-relaxed text-justify"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3, // only show 3 lines
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {getPreviewText(desc)}
        </div>
      </div>

      <button
        onClick={onView}
        className="mt-4 px-4 py-2 rounded-lg border border-[#fff8de]/50 text-[#fff8de] 
        hover:bg-[#fff8de]/10 hover:shadow-[0_0_10px_#fff8de] transition-all duration-300"
      >
        View Log →
      </button>
    </div>
  );
};

export default LogCard;
