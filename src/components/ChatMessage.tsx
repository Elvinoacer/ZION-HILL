import React from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import RichMessageContent from "@/components/RichMessageContent";

interface Message {
  id: string;
  senderId: string;
  sender: { name: string; image?: string };
  content: string;
  imageUrl?: string;
  linkPreview?: any;
  createdAt: string;
}

interface ChatMessageProps {
  msg: Message;
  onDelete: (messageId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ msg, onDelete }) => {
  const { data: session } = useSession();
  const isOwnMessage = msg.senderId === session?.user?.id;

  return (
    <div
      className={`flex group ${
        isOwnMessage ? "justify-end" : "justify-start"
      } mb-4 px-2`}
    >
      <div
        className={`max-w-[90%] sm:max-w-[80%] md:max-w-[70%] p-4 rounded-3xl shadow-md transition-shadow duration-200 group-hover:shadow-lg relative ${
          isOwnMessage
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
            : "bg-white text-gray-800 border border-gray-100"
        }`}
      >
        {/* Options menu (only for own messages) */}
        {isOwnMessage && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`absolute ${
                  isOwnMessage ? "top-1 right-1" : "top-1 left-1"
                } h-8 w-8 p-0 rounded-full opacity-70 hover:opacity-100 hover:bg-white/20 transition-colors`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-40 p-1 rounded-lg shadow-lg"
              align={isOwnMessage ? "end" : "start"}
              side="top"
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 text-base px-2 py-1 h-8 hover:bg-red-50 transition-colors"
                onClick={() => onDelete(msg.id)}
              >
                Delete
              </Button>
            </PopoverContent>
          </Popover>
        )}

        {/* Sender info */}
        <div className="flex items-center space-x-3 mb-2">
          {msg.sender.image ? (
            <img
              src={msg.sender.image}
              alt={msg.sender.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm uppercase flex-shrink-0 shadow-sm">
              {msg.sender.name ? msg.sender.name.charAt(0) : "?"}
            </div>
          )}
          <span
            className={`text-sm font-semibold truncate ${
              isOwnMessage ? "text-blue-100" : "text-blue-600"
            }`}
          >
            {isOwnMessage ? "You" : msg.sender.name}
          </span>
        </div>

        {/* Message content */}
        <div className="mt-2 text-sm">
          <RichMessageContent content={msg.content} />
        </div>

        {/* Timestamp */}
        <p
          className={`text-xs mt-2 text-right ${
            isOwnMessage ? "text-blue-200" : "text-gray-500"
          }`}
        >
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
