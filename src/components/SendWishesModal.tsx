"use client";
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

interface SendWishesModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthdayPersonName: string;
  recipientId: string;
  onSendWishes: () => void;
}

const SendWishesModal: React.FC<SendWishesModalProps> = ({ isOpen, onClose, birthdayPersonName, recipientId, onSendWishes }) => {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!session) {
      setError("You must be logged in to send wishes.");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const res = await fetch('/api/birthday-wishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, recipientId }),
      });

      if (res.ok) {
        onSendWishes();
        onClose();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to send wishes.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSending(false);
    }
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
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendWishesModal;
