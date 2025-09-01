"use client";
import React, { useEffect, useState } from 'react';
import BirthdayCard from '@/components/BirthdayCard';
import SendGiftModal from '@/components/SendGiftModal';

interface BirthdayMember {
  id: string;
  name: string;
  photo: string;
}

const BirthdaysPage = () => {
  const [birthdayMembers, setBirthdayMembers] = useState<BirthdayMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<BirthdayMember | null>(null);

  useEffect(() => {
    const fetchBirthdayMembers = async () => {
      try {
        const res = await fetch('/api/birthdays');
        if (res.ok) {
          const data = await res.json();
          setBirthdayMembers(data);
        } else {
          console.error('Failed to fetch birthday members:', res.statusText);
        }
      } catch (error) {
        console.error('Error fetching birthday members:', error);
      }
    };

    fetchBirthdayMembers();
  }, []);

  const handleSendGift = (member: BirthdayMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Happy Birthday!</h1>
      {birthdayMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {birthdayMembers.map((member) => (
            <BirthdayCard
              key={member.id}
              name={member.name}
              imageUrl={member.photo || '/images/default-avatar.png'}
              message="Wishing you a very happy birthday!"
              onSendGift={() => handleSendGift(member)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center">No birthdays today. Check back tomorrow!</p>
      )}
      {selectedMember && (
        <SendGiftModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          birthdayPersonName={selectedMember.name}
        />
      )}
    </div>
  );
};

export default BirthdaysPage;
