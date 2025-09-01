// src/components/NotificationPermissionModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { getFCMToken } from '@/lib/firebase';
import { useSession } from 'next-auth/react';

interface NotificationPermissionModalProps {
  onClose: () => void;
}

export default function NotificationPermissionModal({ onClose }: NotificationPermissionModalProps) {
  const { data: session } = useSession();
  const [status, setStatus] = useState('');

  const handleAllow = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('Push notifications not supported');
      return;
    }

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
            setStatus('Subscribed successfully!');
            onClose(); // Close modal on success
          } else {
            setStatus('Failed to register token');
          }
        } else {
          setStatus('Failed to get token');
        }
      } else {
        setStatus('Permission denied');
      }
    } catch (error) {
      console.error(error);
      setStatus('Error subscribing');
    }
  };

  const handleNoThanks = () => {
    // User explicitly denied, so we won't ask again (unless they clear site data)
    // We don't need to do anything here other than close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-end justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-t-lg shadow-lg w-full max-w-md animate-slideUp">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Allow Notifications?</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Stay updated with important church announcements and events.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleNoThanks}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            No Thanks
          </button>
          <button
            onClick={handleAllow}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Allow
          </button>
        </div>
        {status && (
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Status:</span> {status}
          </p>
        )}
      </div>
    </div>
  );
}
