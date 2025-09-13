import React from "react";

const RulesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#181818] rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-[#fff8de]/30">
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: "Anta-Regular, monospace" }}>
          Rules and Tips
        </h2>
        <ul className="mb-6 list-disc pl-6 space-y-2 text-[#fff8de]">
          <li>DO NOT share your password or teamID with anyone.</li>
          <li>Write your answers in the task answer fields. You will be provided with pages to write your answers on as well (in case of connectivity issues)</li>
          <li>The Sprite/Character in the Maze only shows your progress . The Sprite progressing does not mean your submission/answers are correct. Answers will be saved and sent to category heads for checking</li>
          <li>There are a total of 11 tasks and associated &quot;logs&quot; , each log detailing a larger part of the overall story (yes theres a story as well). More Logs will be revealed as you complete tasks but it might take a second or two for them to load </li>
          <li>If you want to skip a task, just enter and submit a &quot;.&quot; to proceed to the next task </li>
          <li>DO NOT CLOSE THIS POPUP UNTIL CATEGORY HEADS TELL YOU TO. DOING SO WILL START YOUR TIMER IMMEDIATELY</li>
          <li>DO NOT SOLVE YOUR TASKS ON MORE THAN ONE DEVICE. ONLY KEEP THE WEBSITE OPEN ON YOUR CURRENT DEVICE</li>
        </ul>
        <p className="mb-6 text-[#fff8de]/80 text-center">
          When u close this modal, your timer will start
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg border border-[#fff8de]/50 text-[#fff8de] font-semibold hover:bg-[#fff8de]/10 hover:shadow-[0_0_10px_#fff8de] transition-all duration-300"
        >
          Close modal and start timer
        </button>
      </div>
    </div>
  );
};

export default RulesModal;
