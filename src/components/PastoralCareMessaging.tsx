"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Send, MessageSquare, User, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  createdAt: string;
  read: boolean;
  sender: { id: string; name: string; email: string };
  recipient: { id: string; name: string; email: string };
}

interface UserOption {
  id: string;
  name: string;
  email: string;
}

interface PastoralCareMessagingProps {
  currentUserId: string;
  currentUserRole: "ADMIN" | "COUNSELOR";
}

const PastoralCareMessaging: React.FC<PastoralCareMessagingProps> = ({
  currentUserId,
  currentUserRole,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);
  const [availableRecipients, setAvailableRecipients] = useState<UserOption[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/pastoral-care/messages/inbox?userId=${currentUserId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages.");
      }
      const data: Message[] = await response.json();
      setMessages(data);
    } catch (err: any) {
      toast.error(`Error fetching messages: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRecipients = async () => {
    try {
      // Admins can message counselors, counselors can message admins
      const roleToFetch = currentUserRole === "ADMIN" ? "COUNSELOR" : "ADMIN";
      const response = await fetch(`/api/users/by-role?role=${roleToFetch}`); // Assuming this API exists or will be created
      if (!response.ok) {
        throw new Error(`Failed to fetch ${roleToFetch}s.`);
      }
      const data: UserOption[] = await response.json();
      setAvailableRecipients(data);
      if (data.length > 0) {
        setSelectedRecipientId(data[0].id); // Auto-select first recipient
      }
    } catch (err: any) {
      toast.error(`Error fetching recipients: ${err.message}`);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchAvailableRecipients();
    const interval = setInterval(fetchMessages, 10000); // Poll for new messages every 10 seconds
    return () => clearInterval(interval);
  }, [currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRecipientId) return;

    setSending(true);
    try {
      const response = await fetch("/api/pastoral-care/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUserId,
          recipientId: selectedRecipientId,
          content: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message.");
      }

      setNewMessage("");
      fetchMessages(); // Refresh messages after sending
    } catch (err: any) {
      toast.error(`Error sending message: ${err.message}`);
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderId === currentUserId && msg.recipientId === selectedRecipientId) ||
      (msg.senderId === selectedRecipientId && msg.recipientId === currentUserId)
  );

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center">
          <MessageSquare className="mr-2" /> Pastoral Care Messaging
        </CardTitle>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Chatting with:</span>
          <Select onValueChange={setSelectedRecipientId} value={selectedRecipientId || ""}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Recipient" />
            </SelectTrigger>
            <SelectContent>
              {availableRecipients.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 flex flex-col justify-end overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {filteredMessages.length === 0 && selectedRecipientId ? (
                <div className="text-center text-gray-500 py-4">
                  <p>No messages with this recipient yet. Start the conversation!</p>
                </div>
              ) : filteredMessages.length === 0 && !selectedRecipientId ? (
                <div className="text-center text-gray-500 py-4">
                  <p>Select a recipient to view messages.</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${msg.senderId === currentUserId
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-xs opacity-80 mb-1">
                        {msg.senderId === currentUserId ? "You" : msg.sender.name}
                      </p>
                      <p>{msg.content}</p>
                      <p className="text-xs mt-1 opacity-60 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <div className="p-4 border-t flex items-center space-x-2">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="flex-1"
          disabled={!selectedRecipientId || sending}
        />
        <Button onClick={handleSendMessage} disabled={!selectedRecipientId || sending}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
};

export default PastoralCareMessaging;
