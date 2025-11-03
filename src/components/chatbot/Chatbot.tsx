// src/components/chatbot/Chatbot.tsx
import { useState, useRef, useEffect } from "react";
import { Button } from "#client/components/ui/button";
import { Input } from "#client/components/ui/input";
import { Card } from "#client/components/ui/card";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { sendChatMessage, type ChatMessage } from "#client/api/public/chatbot";
import { toast } from "sonner";
import { useAuth } from "#client/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { useMobileMenu } from "#client/contexts/mobile-menu-context";

export function Chatbot() {
  const { user } = useAuth();
  const { isMenuOpen } = useMobileMenu();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your SMUnity assistant. How can I help you today?",
    },
  ]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const suggestedQuestions = [
    "Find me an environmental project",
    "What is the status of my application?",
    "How do I apply for a CSP?",
    "Show me community service projects",
    "What projects are available?",
  ];
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if user is student or not logged in
  const canUseChatbot =
    !user || (user && user.accountType === "student");

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !canUseChatbot) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        message: userMessage.content,
        conversationHistory: messages,
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error(error.message || "Failed to send message");
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    // Create a user message directly
    const userMessage: ChatMessage = {
      role: "user",
      content: question,
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setShowSuggestions(false);
    setIsLoading(true);

    // Send the message
    sendChatMessage({
      message: question,
      conversationHistory: messages,
    })
      .then((response) => {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.message,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      })
      .catch((error: any) => {
        console.error("Chat error:", error);
        toast.error(error.message || "Failed to send message");
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again later.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!canUseChatbot || isMenuOpen) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-20 sm:right-24 z-50"
        animate={isOpen ? { scale: 1.1 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
          size="icon"
        >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.3, opacity: 0, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.6,
            }}
            className="fixed bottom-24 right-20 sm:right-24 w-96 h-[500px] max-h-[calc(100vh-10rem)] shadow-2xl z-50 max-w-[calc(100vw-3rem)] sm:max-w-none"
            style={{ originX: 1, originY: 1 }} // Scale from bottom-right corner
          >
            <Card className="w-full h-full flex flex-col overflow-hidden !py-0" style={{ overflow: 'hidden' }}>
          <div className="p-4 bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">SMUnity Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-primary-foreground/80 mt-1">
              Ask me anything about CSPs and applications
            </p>
          </div>

          <div 
            className="flex-1 min-h-0 overflow-y-auto"
            style={{ overscrollBehavior: "contain" }}
            onWheel={(e) => {
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="px-4 py-0 space-y-4">
              {messages.length === 1 && showSuggestions && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Try one of the suggested questions below, or type your own!
                  </p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 break-words ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                    style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words" style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

           {/* Suggested Questions */}
           {showSuggestions && messages.length <= 1 && (
             <div className="px-4 pt-2 border-t overflow-hidden" style={{ paddingBottom: 0, marginBottom: 0 }}>
               <div className="flex flex-wrap overflow-hidden" style={{ marginBottom: 0, paddingBottom: 0, gap: '0.375rem', rowGap: '0.375rem' }}>
                 {suggestedQuestions.map((question, index) => (
                   <Button
                     key={index}
                     variant="outline"
                     size="sm"
                     className="text-xs h-auto py-1 px-2.5 whitespace-normal break-words"
                     style={{ marginBottom: 0, marginTop: 0 }}
                     onClick={() => handleSuggestedQuestion(question)}
                   >
                     {question}
                   </Button>
                 ))}
               </div>
             </div>
           )}

          <div className="px-4 pb-4 pt-3 border-t overflow-hidden">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}



