import { useState, useRef, useEffect } from "react";
import { Button } from "#client/components/ui/button";
import { Input } from "#client/components/ui/input";
import { Card } from "#client/components/ui/card";
import { MessageCircle, X, Send, Loader2, ArrowRight } from "lucide-react";
import { sendChatMessage, type ChatMessage } from "#client/api/public/chatbot";
import { toast } from "sonner";
import { useAuth } from "#client/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { useMobileMenu } from "#client/contexts/mobile-menu-context";
import { useMediaQuery } from "#client/hooks/use-media-query";
import { Link } from "@tanstack/react-router";
import { fetchDiscoverProjects } from "#client/api/public/discover";
import { apiGet } from "#client/api/client";
import { MyAppRow } from "#client/api/types";
import { Badge } from "#client/components/ui/badge";

interface ChatMessageWithActions extends ChatMessage {
  actions?: Array<{
    label: string;
    type: "link" | "button";
    url?: string;
    action?: string;
  }>;
  projects?: Array<{
    id: string;
    title: string;
    category: string;
    organisation: string;
  }>;
  applications?: MyAppRow[];
}

export function Chatbot() {
  const { user } = useAuth();
  const { isMenuOpen } = useMobileMenu();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMobileOrTablet = useMediaQuery("(max-width: 775px)");
  const [messagesState, setMessages] = useState<ChatMessageWithActions[]>([
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasScrolledRef = useRef(false);

  const canUseChatbot =
    !user || (user && user.accountType === "student");

  useEffect(() => {
    // Only scroll to bottom when new messages are added (not on initial open)
    if (messagesState.length > 1 && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (messagesState.length === 1 && messagesContainerRef.current && !hasScrolledRef.current) {
      // On initial open with first message, scroll to top
      messagesContainerRef.current.scrollTop = 0;
      hasScrolledRef.current = true;
    }
  }, [messagesState]);

  useEffect(() => {
    // Reset scroll flag when chat closes
    if (!isOpen) {
      hasScrolledRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    // Only auto-focus on desktop, not on mobile/tablet
    if (isOpen && inputRef.current && !isMobileOrTablet) {
      inputRef.current.focus();
    }
  }, [isOpen, isMobileOrTablet]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !canUseChatbot) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        message: userMessage.content,
        conversationHistory: messagesState,
      });

      // Parse the response to extract actionable elements
      const assistantMessage: ChatMessageWithActions = {
        role: "assistant",
        content: response.message,
        actions: [],
        projects: [],
        applications: [],
      };

      const messageLower = userMessage.content.toLowerCase();
      
      // Detect application status requests - check FIRST before other actions
      const isStatusQuery = /status|application|applied|my.*application|check.*application|application.*status/i.test(messageLower);
      
      if (isStatusQuery && user) {
        try {
          const applications = await apiGet<MyAppRow[]>("/api/projects/applications");
          assistantMessage.applications = applications;
          
          if (applications.length === 0) {
            assistantMessage.content = "You haven't applied to any projects yet. Browse available projects to get started!";
            assistantMessage.actions = [
              { label: "Browse Projects", type: "link", url: "/discover" },
            ];
          } else {
            // Update the message to include actual status information
            const statusCounts = applications.reduce((acc, app) => {
              acc[app.status] = (acc[app.status] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);
            
            const statusSummary = Object.entries(statusCounts)
              .map(([status, count]) => `${count} ${status}`)
              .join(", ");
            
            assistantMessage.content = `You have ${applications.length} application${applications.length !== 1 ? 's' : ''}:\n\n${statusSummary}`;
            assistantMessage.actions = [
              { label: "View All Applications", type: "link", url: "/my-applications" },
            ];
          }
        } catch (error) {
          console.error("Error fetching applications:", error);
          assistantMessage.content = "I couldn't fetch your applications right now. Please try checking your dashboard.";
          assistantMessage.actions = [
            { label: "Go to Dashboard", type: "link", url: "/my-applications" },
          ];
        }
      }

      // Detect sign up / login requests
      if ((messageLower.includes("sign up") || messageLower.includes("signup") || messageLower.includes("register") || messageLower.includes("create account")) && !user) {
        assistantMessage.actions = [
          { label: "Sign Up", type: "link", url: "/auth/login" },
          { label: "Browse Projects", type: "link", url: "/discover" },
        ];
      } else if ((messageLower.includes("sign in") || messageLower.includes("login") || messageLower.includes("log in")) && !user) {
        assistantMessage.actions = [
          { label: "Sign In", type: "link", url: "/auth/login" },
        ];
      }

      // Detect project search requests
      const isProjectSearch = /find|show|search|looking for|recommend|suggest|want.*project|need.*project|any.*project|available.*project|environmental|community|mentoring|elderly|animal|arts|culture|sports|coding/i.test(messageLower);
      
      if (isProjectSearch) {
        try {
          const projects = await fetchDiscoverProjects();
          const searchTerms = messageLower.match(/(environmental|community|mentoring|elderly|animal|arts|culture|sports|coding|local|overseas)/gi) || [];
          
          let filteredProjects = projects;
          if (searchTerms.length > 0) {
            const categories = searchTerms.map(t => t.toLowerCase());
            filteredProjects = projects.filter((p: any) => 
              categories.some(cat => 
                p.category?.toLowerCase().includes(cat) || 
                p.title?.toLowerCase().includes(cat) ||
                p.description?.toLowerCase().includes(cat)
              )
            );
          }
          
          if (filteredProjects.length > 0) {
            assistantMessage.projects = filteredProjects.slice(0, 3).map((p: any) => ({
              id: p.id,
              title: p.title,
              category: p.category || "Community",
              organisation: p.organisation || "Unknown",
            }));
            assistantMessage.actions = [
              { label: "View All Projects", type: "link", url: "/discover" },
            ];
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }

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
    const userMessage: ChatMessage = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowSuggestions(false);
    setIsLoading(true);

    sendChatMessage({
      message: question,
      conversationHistory: messagesState,
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
        className="fixed bottom-6 right-6 z-50"
        animate={isOpen ? { scale: 1.1 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 rounded-full shadow-lg hover:shadow-xl transition-all relative overflow-hidden ${
            isHovered && !isOpen && !isMobileOrTablet 
              ? 'bg-white border-2 border-white text-primary hover:bg-white' 
              : ''
          }`}
          style={{ 
            width: isHovered && !isOpen && !isMobileOrTablet ? 'auto' : '3.5rem',
            minWidth: '3.5rem',
            paddingLeft: isHovered && !isOpen && !isMobileOrTablet ? '1rem' : '0',
            paddingRight: isHovered && !isOpen && !isMobileOrTablet ? '1rem' : '0',
            backgroundColor: isHovered && !isOpen && !isMobileOrTablet ? '#ffffff' : undefined,
          }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : isHovered && !isMobileOrTablet ? (
              <motion.div
                key="text"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 whitespace-nowrap relative z-10"
              >
                <span className="text-sm font-semibold text-primary">How can we help?</span>
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Gradient overlay on hover - matching Discover CSPs button */}
          {isHovered && !isOpen && !isMobileOrTablet && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
          {/* Gradient glow on hover - for the glow effect around the button */}
          {isHovered && !isOpen && !isMobileOrTablet && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 blur-xl -z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isMobileOrTablet ? { y: '100%', opacity: 0 } : { scale: 0, opacity: 0, y: 10 }}
            animate={isMobileOrTablet ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
            exit={isMobileOrTablet ? { y: '100%', opacity: 0 } : { scale: 0.3, opacity: 0, y: 10 }}
            transition={isMobileOrTablet ? {
              type: "spring",
              stiffness: 300,
              damping: 30,
            } : {
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.6,
            }}
            className={`fixed shadow-2xl z-50 ${
              isMobileOrTablet 
                ? 'bottom-0 left-0 right-0 w-full h-[80vh] max-h-[80vh] rounded-t-2xl' 
                : 'bottom-24 right-6 w-96 h-[480px] max-h-[calc(100vh-10rem)] max-w-[calc(100vw-3rem)] lg:max-w-none'
            }`}
            style={isMobileOrTablet ? {} : { originX: 1, originY: 1 }} 
          >
            <Card className="w-full h-full flex flex-col overflow-hidden !py-0" style={{ overflow: 'hidden' }}>
          <div className="p-4 bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                Hello! I'm SMUnity Assistant{" "}
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, -8, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                  style={{ display: "inline-block", transformOrigin: "70% 70%", fontSize: "1.2em" }}
                >
                  👋
                </motion.span>
              </h3>
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
            ref={messagesContainerRef}
            className="flex-1 min-h-0 overflow-y-auto"
            style={{ overscrollBehavior: "contain" }}
            onWheel={(e) => {
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="px-4 py-2 space-y-4">
              {messagesState.length === 1 && showSuggestions && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Try one of the suggested questions below, or type your own!
                  </p>
                </div>
              )}
              {messagesState.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    message.role === "user" ? "items-end" : "items-start"
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
                  
                  {/* Action buttons for assistant messages */}
                  {message.role === "assistant" && message.actions && message.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 max-w-[80%]">
                      {message.actions.map((action, actionIndex) => (
                        action.type === "link" && action.url ? (
                          <Link key={actionIndex} to={action.url}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8"
                              onClick={() => setIsOpen(false)}
                            >
                              {action.label}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                        ) : null
                      ))}
                    </div>
                  )}
                  
                  {/* Application status cards for assistant messages */}
                  {message.role === "assistant" && message.applications && message.applications.length > 0 && (
                    <div className="mt-2 space-y-2 max-w-[80%]">
                      {message.applications.slice(0, 5).map((app) => {
                        const getStatusColor = (status: string) => {
                          const colors: Record<string, string> = {
                            pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
                            accepted: "bg-green-500/10 text-green-700 border-green-500/20",
                            rejected: "bg-red-500/10 text-red-700 border-red-500/20",
                            waitlisted: "bg-blue-500/10 text-blue-700 border-blue-500/20",
                            withdrawn: "bg-gray-500/10 text-gray-700 border-gray-500/20",
                            cancelled: "bg-gray-500/10 text-gray-700 border-gray-500/20",
                          };
                          return colors[status] || colors.pending;
                        };
                        
                        const formatDate = (dateString: string) => {
                          const date = new Date(dateString);
                          return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        };
                        
                        return (
                          <Link
                            key={app.id}
                            to="/csp/$projectID"
                            params={{ projectID: String(app.projectId) }}
                            search={{ from: undefined, applicantProjectId: undefined, applicantId: undefined }}
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="bg-background border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-foreground">{app.title}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{app.organisation}</p>
                                  <p className="text-xs text-muted-foreground mt-1">Applied: {formatDate(app.appliedDate)}</p>
                                </div>
                                <Badge className={`text-xs border ${getStatusColor(app.status)}`}>
                                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                      {message.applications.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{message.applications.length - 5} more application{message.applications.length - 5 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Project cards for assistant messages */}
                  {message.role === "assistant" && message.projects && message.projects.length > 0 && (
                    <div className="mt-2 space-y-2 max-w-[80%]">
                      {message.projects.map((project) => (
                        <Link
                          key={project.id}
                          to="/csp/$projectID"
                          params={{ projectID: project.id }}
                          search={{ from: undefined, applicantProjectId: undefined, applicantId: undefined }}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="bg-background border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                            <p className="text-xs font-semibold text-foreground">{project.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {project.category} • {project.organisation}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
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
           {showSuggestions && messagesState.length <= 1 && (
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
                autoFocus={false}
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



