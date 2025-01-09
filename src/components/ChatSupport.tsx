import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatInput } from "./chat/ChatInput";

interface Message {
  content: string;
  isUser: boolean;
}

export const ChatSupport = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = input.trim();
    setInput("");
    
    // Create a new array with the user message
    const updatedMessages = [...messages, { content: userMessage, isUser: true }];
    setMessages(updatedMessages);

    try {
      const { data, error } = await supabase.functions.invoke('chat-support', {
        body: { 
          message: userMessage,
          // Pass the conversation history for context
          history: updatedMessages.slice(-6).map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          }))
        },
      });

      if (error) throw error;
      
      // Update messages with the AI response
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-4 right-4 h-12 w-auto px-4 rounded-full shadow-lg z-50 flex items-center gap-2"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="text-sm font-medium">Ask me</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[300px] p-0">
        <div className="flex flex-col h-[100dvh] sm:h-full">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle>Chat Support</SheetTitle>
          </SheetHeader>
          <div className="flex-1 flex flex-col">
            <ChatMessages messages={messages} />
            <div className="border-t p-3">
              <ChatInput
                input={input}
                isLoading={isLoading}
                onInputChange={setInput}
                onSend={sendMessage}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};