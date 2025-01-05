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
    const userMessage = input;
    setInput("");
    
    setMessages(prev => [...prev, { content: userMessage, isUser: true }]);

    try {
      const { data, error } = await supabase.functions.invoke('chat-support', {
        body: { message: userMessage },
      });

      if (error) throw error;
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
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[80vw] sm:w-[300px]">
        <SheetHeader>
          <SheetTitle>Chat Support</SheetTitle>
        </SheetHeader>
        <div className="flex h-[calc(100vh-180px)] flex-col">
          <ChatMessages messages={messages} />
          <div className="border-t p-4">
            <ChatInput
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSend={sendMessage}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};