import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { Message } from "@/hooks/useChat";

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4 min-h-0">
      {messages.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Start a conversation with our AI support assistant
        </p>
      ) : (
        <>
          {messages.map((msg, i) => (
            <ChatMessage key={i} {...msg} />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};