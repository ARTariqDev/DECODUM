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
          <li>Rule 1: Placeholder rule goes here.</li>
          <li>Rule 2: Another placeholder rule.</li>
          <li>Tip: we can add tips here e.g: ensure that you are solving tasks on one device only</li>
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
