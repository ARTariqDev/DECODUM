import { useRef, useState } from "react";

const Button = ({
  text,
  glowColor = "#fff8de",
  onClick,
}) => {
  const btnRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleMouseMove = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btnRef.current.style.setProperty("--x", `${x}px`);
    btnRef.current.style.setProperty("--y", `${y}px`);
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => {
    btnRef.current.style.setProperty("--x", `0px`);
    btnRef.current.style.setProperty("--y", `0px`);
    setHovered(false);
  };

  const handleClick = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    onClick && onClick();

    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 500);
  };

  return (
    <>
      <button
        ref={btnRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`relative px-10 py-4 rounded-xl text-white font-bold overflow-hidden transition duration-150 active:scale-95 border border-[#fff8de]/30 backdrop-blur-md cursor-pointer !bg-transparent appearance-none hover:animate-glitch`}
      >

        <span
          className="absolute inset-0 pointer-events-none rounded-xl border z-10 transition-opacity duration-300 ease-out"
          style={{
            borderColor: glowColor,
            borderWidth: "3px",
            opacity: hovered ? 1 : 0,
            maskImage: `radial-gradient(150px at var(--x, 0px) var(--y, 0px), white 0%, transparent 70%)`,
            WebkitMaskImage: `radial-gradient(150px at var(--x, 0px) var(--y, 0px), white 0%, transparent 70%)`,
            transition: "mask-position 0.05s linear, opacity 0.3s ease-out",
            boxShadow: hovered ? `0 0 20px ${glowColor}` : "none",
          }}
        />


        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/20 animate-ripple"
            style={{
              left: ripple.x - 60,
              top: ripple.y - 60,
              width: 120,
              height: 120,
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        ))}


        <span className="relative z-20 text-xl uppercase tracking-widest">
          {text}
        </span>
      </button>

    </>
  );
};

export default Button;
