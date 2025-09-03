"use client";
import React, { useEffect, useState } from 'react';
import BirthdayCard from '@/components/BirthdayCard';
import SendWishesModal from '@/components/SendWishesModal';
import Confetti from 'react-confetti';

interface BirthdayMember {
  id: string;
  name: string;
  photo: string;
}

const BirthdaysPage = () => {
  const [birthdayMembers, setBirthdayMembers] = useState<BirthdayMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<BirthdayMember | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchBirthdayMembers = async () => {
      try {
        const res = await fetch('/api/birthdays');
        if (res.ok) {
          const data = await res.json();
          setBirthdayMembers(data);
          if (data.length > 0) {
            setShowConfetti(true);
          }
        } else {
          console.error('Failed to fetch birthday members:', res.statusText);
        }
      } catch (error) {
        console.error('Error fetching birthday members:', error);
      }
    };

    fetchBirthdayMembers();
  }, []);

  const handleSendWishes = (member: BirthdayMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 font-serif mb-4">Happy Birthday!</h1>
          <p className="text-gray-600 text-lg">Let's celebrate our church family!</p>
        </div>
        {birthdayMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {birthdayMembers.map((member) => (
              <BirthdayCard
                key={member.id}
                name={member.name}
                imageUrl={member.photo || '/images/default-avatar.png'}
                onSendWishes={() => handleSendWishes(member)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No birthdays today. Check back tomorrow!</p>
        )}
        {selectedMember && (
          <SendWishesModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            birthdayPersonName={selectedMember.name}
            onSendWishes={() => setShowConfetti(true)}
          />
        )}
      </div>
    </div>
  );
};

export default BirthdaysPage;
