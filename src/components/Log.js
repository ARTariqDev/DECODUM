import React from "react";

const Log = ({ title, date, desc }) => {

  const jumbleText = (str) => {
    const chars = str.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  };

  const parseDescription = (text) => {
    if (!text) return '';

    return text.replace(/\[HIDDEN\](.*?)\[\/HIDDEN\]/g, '<span class="hidden-content">$1</span>')
               .replace(/\[SCRAMBLE\](.*?)\[\/SCRAMBLE\]/g, (match, content) => `<span class="scrambled-content">${jumbleText(content)}</span>`)
               .replace(/\[BLUR\](.*?)\[\/BLUR\]/g, '<span class="blurred-content">$1</span>');
  };

  const parseTitle = (text) => {
    if (!text) return '';
    

    return text.replace(/\[HIDDEN\].*?\[\/HIDDEN\]/g, '') // Remove hidden content from titles
               .replace(/\[SCRAMBLE\](.*?)\[\/SCRAMBLE\]/g, (match, content) => jumbleText(content)) // Scramble content
               .replace(/\[BLUR\](.*?)\[\/BLUR\]/g, '<span class="blurred-content">$1</span>'); // Wrap blur content in span
  };

  const hasBlueTags = (text) => {
    return /\[BLUR\].*?\[\/BLUR\]/g.test(text);
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
        dangerouslySetInnerHTML={{ __html: parseTitle(title) }}
      />

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
