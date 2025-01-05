import { ChatMessage } from "./ChatMessage";

interface Message {
  content: string;
  isUser: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Start a conversation with our AI support assistant
        </p>
      ) : (
        messages.map((msg, i) => <ChatMessage key={i} {...msg} />)
      )}
    </div>
  );
};