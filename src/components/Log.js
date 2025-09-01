import React from "react";

const Log = ({ title, date, desc }) => {

  const parseDescription = (text) => {
    if (!text) return '';

    const jumbleText = (str) => {
      const chars = str.split('');
      for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      return chars.join('');
    };
    
    // Replace [HIDDEN]content[/HIDDEN] tags with just the content wrapped in transparent span
    // This removes the tag whitespace while keeping the content (cause the white space made it way too obvious)
    return text.replace(/\[HIDDEN\](.*?)\[\/HIDDEN\]/g, '<span class="hidden-content">$1</span>')
               .replace(/\[SCRAMBLE\](.*?)\[\/SCRAMBLE\]/g, (match, content) => `<span class="scrambled-content">${jumbleText(content)}</span>`);
  };

  return (
    <article
      className="w-[75%] max-w-4xl border border-[#fff8de]/30 rounded-2xl p-6 mb-8
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

      <div 
        className="prose prose-invert max-w-none text-justify text-base md:text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: parseDescription(desc) }}
      />
    </article>
  );
};

export default Log;
