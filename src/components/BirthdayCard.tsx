"use client";
import React from 'react';
import Image from 'next/image';

interface BirthdayCardProps {
  name: string;
  imageUrl: string;
  message: string;
  onSendGift: () => void;
}

const BirthdayCard: React.FC<BirthdayCardProps> = ({ name, imageUrl, message, onSendGift }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48">
        <Image src={imageUrl} alt={name} layout="fill" objectFit="cover" />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{name}</h2>
        <p className="text-gray-700">{message}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 transition-colors duration-300"
          onClick={onSendGift}
        >
          Send a Gift
        </button>
      </div>
    </div>
  );
};

export default BirthdayCard;
