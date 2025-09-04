"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Confetti from 'react-confetti';

interface BirthdayWish {
  id: string;
  message: string;
  sender: {
    name: string;
    image: string;
  };
  createdAt: string;
}

const MyBirthdayPage = () => {
  const { data: session } = useSession();
  const [wishes, setWishes] = useState<BirthdayWish[]>([]);
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchWishes = async () => {
        try {
          const res = await fetch(`/api/birthday-wishes?userId=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            setWishes(data);
          } else {
            console.error('Failed to fetch birthday wishes:', res.statusText);
          }
        } catch (error) {
          console.error('Error fetching birthday wishes:', error);
        }
      };

      const checkBirthday = async () => {
        try {
          const res = await fetch('/api/birthdays');
          if (res.ok) {
            const data = await res.json();
            const isUserBirthday = data.some((member: any) => member.id === session.user.id);
            setIsBirthday(isUserBirthday);
            if (isUserBirthday) {
              fetchWishes();
            }
          } else {
            console.error('Failed to fetch birthdays:', res.statusText);
          }
        } catch (error) {
          console.error('Error fetching birthdays:', error);
        }
      };

      checkBirthday();
    }
  }, [session]);

  if (!isBirthday) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">It's not your birthday today!</h1>
          <p className="text-gray-600">Come back on your special day to see your birthday wishes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8">
      <Confetti width={window.innerWidth} height={window.innerHeight} />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 font-serif mb-4">Happy Birthday, {session?.user?.name}!</h1>
          <p className="text-gray-600 text-lg">Here are the lovely wishes from your church family.</p>
        </div>
        {wishes.length > 0 ? (
          <div className="space-y-6">
            {wishes.map((wish) => (
              <div key={wish.id} className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4">
                <img src={wish.sender.image || '/images/default-avatar.png'} alt={wish.sender.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-800">{wish.sender.name}</p>
                  <p className="text-gray-600">{wish.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(wish.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No birthday wishes yet. Check back later!</p>
        )}
      </div>
    </div>
  );
};

export default MyBirthdayPage;
