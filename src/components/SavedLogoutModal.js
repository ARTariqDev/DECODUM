import React from "react";

const SavedLogoutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#181818] rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-[#fff8de]/30 text-center">
        <h2 className="text-2xl font-bold mb-4 text-[#fff8de]">Saved & Logged Out</h2>
        <p className="mb-6 text-[#fff8de]/80">
          Your Timer has ended ; your answers have been saved and you have been logged out.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg border border-[#fff8de]/50 text-[#fff8de] font-semibold hover:bg-[#fff8de]/10 hover:shadow-[0_0_10px_#fff8de] transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SavedLogoutModal;
