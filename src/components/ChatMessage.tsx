import React from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import RichMessageContent from "@/components/RichMessageContent";

interface Message {
  id: string;
  senderId: string;
  sender: { name: string; image?: string };
  content: string;
  imageUrl?: string; // Keep this for type safety, even if not used directly for rendering
  linkPreview?: any;
  createdAt: string;
}

interface ChatMessageProps {
  msg: Message;
  onDelete: (messageId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ msg, onDelete }) => {
  const { data: session } = useSession();

  return (
    <div
      key={msg.id}
      className={`flex ${
        msg.senderId === session?.user?.id ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] p-4 rounded-2xl shadow-md relative ${
          msg.senderId === session?.user?.id
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto"
            : "bg-white text-gray-800 border border-gray-200 mr-auto"
        }`}
      >
        {msg.senderId === session?.user?.id && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
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
            <PopoverContent className="w-auto p-0">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500"
                onClick={() => onDelete(msg.id)}
              >
                Delete
              </Button>
            </PopoverContent>
          </Popover>
        )}
        <div
          className={`font-semibold mb-1 ${
            msg.senderId === session?.user?.id ? "text-blue-100" : "text-blue-600"
          }`}
        >
          <div className="flex items-center space-x-2">
            {msg.sender.image ? (
              <img
                src={msg.sender.image}
                alt={msg.sender.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm uppercase">
                {msg.sender.name ? msg.sender.name.charAt(0) : "?"}
              </div>
            )}
            <span>{msg.sender.name}</span>
          </div>
        </div>
        <div className="mt-1 text-sm md:text-base">
          {msg.linkPreview ? (
            <a
              href={msg.linkPreview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border rounded-md p-2"
            >
              <p className="font-bold">{msg.linkPreview.title}</p>
              <p>{msg.linkPreview.description}</p>
              {msg.linkPreview.images && msg.linkPreview.images.length > 0 && (
                <img
                  src={msg.linkPreview.images[0]}
                  alt={msg.linkPreview.title}
                  className="max-w-xs rounded-md"
                />
              )}
            </a>
          ) : (
            <RichMessageContent content={msg.content} />
          )}
        </div>
        <p
          className={`text-xs mt-2 text-right ${
            msg.senderId === session?.user?.id ? "text-blue-200" : "text-gray-500"
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
