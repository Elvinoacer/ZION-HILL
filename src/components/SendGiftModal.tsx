"use client";
import React, { useState } from 'react';

interface SendGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthdayPersonName: string;
}

const SendGiftModal: React.FC<SendGiftModalProps> = ({ isOpen, onClose, birthdayPersonName }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Send a Gift to {birthdayPersonName}</h2>
        <textarea
          className="w-full h-32 border border-gray-300 rounded-md p-2 mb-4"
          placeholder="Write your birthday message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400 transition-colors duration-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
            Send Gift
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendGiftModal;
