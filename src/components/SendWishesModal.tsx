"use client";
import React, { useState } from 'react';

interface SendWishesModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthdayPersonName: string;
  onSendWishes: () => void;
}

const SendWishesModal: React.FC<SendWishesModalProps> = ({ isOpen, onClose, birthdayPersonName, onSendWishes }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    // Here you would typically send the message to a server
    // For now, we'll just close the modal and trigger the confetti
    onSendWishes();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Send Wishes to {birthdayPersonName}</h2>
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          placeholder={`Write a birthday message for ${birthdayPersonName}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex justify-end mt-6 space-x-4">
          <button
            className="text-gray-600 hover:text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-md"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendWishesModal;
