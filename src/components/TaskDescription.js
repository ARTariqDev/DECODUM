import { FaEye, FaEyeSlash } from "react-icons/fa";

const TaskDescription = ({ task, description, showDescription, onToggle }) => {
  return (
    <div className="flex justify-center w-full">
      <div
        className={`w-[75vw] sm:w-[60vw] rounded-lg p-6 pt-14 sm:pt-6 text-[#fff8de] backdrop-blur-sm border relative flex flex-col transition-all duration-700 ease-in-out`}
        style={{
          backgroundColor: "rgba(17, 17, 17, 0.9)",
          borderColor: "#fff8de",
          boxShadow: "0 0 8px #fff8de",
          fontFamily: "Anta-Regular, monospace",
          letterSpacing: "0.05em",
          minHeight: showDescription ? "25vh" : "8vh", // shrink when hidden
        }}
      >

        <button
          className="absolute top-4 right-4 sm:top-4 sm:right-4 px-3 py-1 rounded-md bg-[#fff8de]/20 text-[#fff8de] hover:bg-[#fff8de]/40 transition-colors flex items-center gap-1 text-sm sm:text-sm"
          onClick={onToggle}
        >
          {showDescription ? <FaEyeSlash /> : <FaEye />}
          {showDescription ? "Hide" : "Show"}
        </button>


        <h2
          className="text-lg md:text-xl text-center mb-2"
          style={{
            WebkitTextStroke: "1.5px #fff8de",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            textShadow: "0 0 8px #fff8de",
            animation: "glow 2s ease-in-out infinite alternate",
            letterSpacing: "0.1em",
          }}
        >
          {task}
        </h2>


        <hr
          className="border-t mb-3"
          style={{
            borderColor: "#fff8de",
            boxShadow: "0 0 4px #fff8de",
          }}
        />


        <div
          className={`overflow-hidden transition-[max-height,transform,opacity] duration-700 ease-in-out ${
            showDescription
              ? "max-h-[500px] opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2"
          }`}
        >
          <p className="text-sm md:text-base max-w-3xl leading-relaxed text-left">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDescription;
