"use client";
import React from 'react';
import Image from 'next/image';

interface BirthdayCardProps {
  name: string;
  imageUrl: string;
  onSendWishes: () => void;
}

const BirthdayCard: React.FC<BirthdayCardProps> = ({ name, imageUrl, onSendWishes }) => {
  return (
    <div className="bg-gradient-to-br from-yellow-100 to-orange-200 rounded-2xl shadow-lg overflow-hidden text-center p-8 transform hover:scale-105 transition-transform duration-300">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <Image src={imageUrl} alt={name} layout="fill" objectFit="cover" className="rounded-full border-4 border-white shadow-md" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 font-serif mb-2">{name}</h2>
      <p className="text-gray-600 mb-6">wishes you a happy birthday!</p>
      <button
        className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        onClick={onSendWishes}
      >
        Send Birthday Wishes
      </button>
    </div>
  );
};

export default BirthdayCard;
