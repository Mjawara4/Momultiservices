import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle } from "lucide-react";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatInput } from "./chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ChatSupport = () => {
  const { messages, input, isLoading, setInput, sendMessage } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  // Send conversation when chat is closed and there are messages
  const handleOpenChange = async (open: boolean) => {
    if (!open && messages.length > 0) {
      try {
        const { error } = await supabase.functions.invoke('chat-support', {
          body: {
            type: 'conversation_end',
            history: messages
          },
        });

        if (error) throw error;
      } catch (error) {
        console.error('Error sending conversation:', error);
      }
    }
    setIsOpen(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
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