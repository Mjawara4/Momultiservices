import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatInput } from "./chat/ChatInput";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[200px]">
              <p>Need help? Chat with our support assistant!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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