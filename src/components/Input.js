"use client";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Input({
  type = "text",
  placeholder,
  name,
  textColor = "#fff8de",
  icon,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  return (
    <div className="w-full relative pt-[8px] pb-[7px] px-6 mt-6 flex items-end border border-gray-300/50 rounded-4xl backdrop-blur-sm bg-white/2 focus-within:border-gray-400 hover:border-gray-400 tracking-wide transition-all duration-200 h-11.5 group">
      <span
        className={`text-gray-400 inline-block absolute transition-all duration-250 ease-in-out ${
          isFocused
            ? "top-0.5 text-[11px] opacity-100"
            : "top-1/2 -translate-y-1/2 opacity-70"
        }`}
      >
        {placeholder}
      </span>
      <input
        ref={inputRef}
        type={type}
        name={name}
        className="flex-1 focus:outline-none border-none placeholder:text-gray-400 !bg-transparent"
        style={{
          color: textColor,
          fontFamily: "anta-regular, monospace",
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => !inputRef.current?.value && setIsFocused(false)}
        autoComplete="off"
      />
      {icon && (
        <div className="ml-3 mb-[1px] text-white">
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
    </div>
  );
}

export default Input;
