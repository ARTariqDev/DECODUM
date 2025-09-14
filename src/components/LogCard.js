import React from "react";

const LogCard = ({ title, date, desc, onView }) => {
  console.log('[LogCard] Render:', title);
  
  const jumbleText = (str) => {
    const chars = str.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  };

  const processText = (text, showBlurred = false) => {
    if (!text) return '';
    
    let processedText = text.replace(/\[HIDDEN\].*?\[\/HIDDEN\]/g, '') //hides text
                          .replace(/\[SCRAMBLE\](.*?)\[\/SCRAMBLE\]/g, (match, content) => jumbleText(content)) //scrambles text
                          .replace(/\[IMAGE\s+SRC=\{.*?\}\]\[\/IMAGE\]/g, ''); //remove images from preview
    
    if (showBlurred) {
      // For titles, wrap blurred content in span
      processedText = processedText.replace(/\[BLUR\](.*?)\[\/BLUR\]/g, '<span class="blurred-content">$1</span>');
    } else {
      // For descriptions, remove blurred content in preview
      processedText = processedText.replace(/\[BLUR\].*?\[\/BLUR\]/g, ''); //remove blurred content in preview
    }
    
    return processedText;
  };

  const getPreviewText = (text) => {
    return processText(text, true); // Changed from false to true to show blurred content
  };

  const getTitleText = (text) => {
    return processText(text, true);
  };

  const hasBlueTags = (text) => {
    return /\[BLUR\].*?\[\/BLUR\]/g.test(text);
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
          className="text-xl font-bold tracking-wide text-center md:text-left break-words"
          style={{
            WebkitTextStroke: "1px #fff8de",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 6px #fff8de",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
          dangerouslySetInnerHTML={{ __html: getTitleText(title) }}
        />
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
          dangerouslySetInnerHTML={{ __html: getPreviewText(desc) }}
        />
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
