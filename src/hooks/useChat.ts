import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Message {
  content: string;
  isUser: boolean;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = input.trim();
    setInput("");
    
    // Add user message to chat
    const updatedMessages = [...messages, { content: userMessage, isUser: true }];
    setMessages(updatedMessages);

    try {
      const { data, error } = await supabase.functions.invoke('chat-support', {
        body: { 
          message: userMessage,
          history: updatedMessages.slice(-6).map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          }))
        },
      });

      if (error) throw error;
      
      // Add AI response to chat
      setMessages(prev => [...prev, { content: data.response, isUser: false }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    isLoading,
    setInput,
    sendMessage
  };
};