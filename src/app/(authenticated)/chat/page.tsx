"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import io from 'socket.io-client';

interface Message {
  id: string;
  senderId: string;
  sender: { name: string };
  content: string;
  timestamp: string;
}

const socket = io(); // Connect to the Socket.IO server

const publicVapidKey = "BA5G7-42oUYg0AGcJ48b-S4TYEzCHqftMCwmwXinF-CUQHY11uGFZTwnNVy3EpMm4u6nsnyegwlmeGt8dIDrtkc"; // Replace with your actual public VAPID key

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const ChatPage = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    socket.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      // Native browser notification (fallback if push not enabled/supported)
      if (document.hidden && message.senderId !== session?.user?.id) {
        showNativeNotification(message);
      }
    });

    // Register service worker and subscribe for push notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker Registered', registration);
          return registration.pushManager.getSubscription();
        })
        .then(subscription => {
          if (subscription) {
            console.log('Already subscribed', subscription);
            // You might want to send this subscription to your backend if it's not already there
          } else {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                navigator.serviceWorker.ready.then(registration => {
                  registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
                  }).then(newSubscription => {
                    console.log('New Push Subscription', newSubscription);
                    // Send subscription to your backend
                    if (session?.user?.id) {
                      fetch('/api/subscribe', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          endpoint: newSubscription.endpoint,
                          expirationTime: newSubscription.expirationTime,
                          keys: newSubscription.toJSON().keys,
                          userId: session.user.id,
                        }),
                      });
                    }
                  }).catch(e => {
                    console.error('Failed to subscribe the user: ', e);
                  });
                });
              } else {
                console.warn('Notification permission denied.');
              }
            });
          }
        })
        .catch(e => {
          console.error('Service Worker Error', e);
        });
    }

    return () => {
      socket.off('receiveMessage');
    };
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showNativeNotification = (message: Message) => {
    if (Notification.permission === "granted") {
      new Notification(`New Message from ${message.sender.name}`, {
        body: message.content,
        icon: '/next.svg', // Replace with your church logo or a chat icon
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newMessage.trim() || !session?.user?.id) return;

    try {
      // Emit message via Socket.IO
      socket.emit('sendMessage', {
        senderId: session.user.id,
        content: newMessage,
      });

      setNewMessage('');
      // No need to fetch messages here, as socket.on('receiveMessage') will update state
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Community Chat</h1>
        <p className="text-lg text-gray-600">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Community Chat</h1>
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Community Chat</h1>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Live Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === session?.user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${msg.senderId === session?.user?.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  <p className="font-semibold">{msg.sender.name}</p>
                  <p>{msg.content}</p>
                  <p className="text-xs text-right mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No messages yet. Start the conversation!</p>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              disabled={!session?.user?.id}
            />
            <Button type="submit" disabled={!session?.user?.id}>
              Send
            </Button>
          </form>
          {!session?.user?.id && (
            <p className="text-red-500 text-sm mt-2">You must be logged in to send messages.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ChatPage;
