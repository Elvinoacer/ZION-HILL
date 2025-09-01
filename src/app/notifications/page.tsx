// src/app/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getFCMToken } from '@/lib/firebase';
import { useSession } from 'next-auth/react';

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsAllowed(Notification.permission === 'granted');
    }
  }, []);

  const handleToggle = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('Push notifications not supported');
      return;
    }

    if (notificationsAllowed) {
      // Logic to unsubscribe (optional, for now just toggle off UI)
      setNotificationsAllowed(false);
      setStatus('Notifications turned off');
      // In a real app, you'd send a request to your server to delete the token
    } else {
      try {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
          const token = await getFCMToken();
          if (token) {
            const res = await fetch('/api/register-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token, userId: session?.user?.id || null }),
            });

            if (res.ok) {
              setNotificationsAllowed(true);
              setStatus('Notifications allowed and subscribed!');
            } else {
              setStatus('Failed to register token');
            }
          } else {
            setStatus('Failed to get token');
          }
        } else {
          setNotificationsAllowed(false);
          setStatus('Permission denied');
        }
      } catch (error) {
        console.error(error);
        setStatus('Error subscribing');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
          Notification Settings
        </h1>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Allow Notifications</span>
          <label htmlFor="toggle" className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                id="toggle"
                className="sr-only"
                checked={notificationsAllowed}
                onChange={handleToggle}
              />
              <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
            </div>
          </label>
        </div>
        {status && (
          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Status:</span> {status}
          </p>
        )}
      </div>
    </div>
  );
}