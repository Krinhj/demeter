"use client";

import { useRef, useEffect } from "react";
import { Send, Loader2, Leaf } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatOverlay } from "./chat-provider";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  { label: "Plan my week", prompt: "Help me plan my meals for the week" },
  { label: "High protein ideas", prompt: "Suggest some high protein meal ideas" },
  { label: "Quick meals", prompt: "What are some quick 30-minute meals I can make?" },
  { label: "Grocery tips", prompt: "How should I organize my grocery shopping?" },
];

export function ChatPanel() {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
  } = useChatOverlay();

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    // Focus the textarea after setting input
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        sendMessage();
      }
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-1 font-medium">How can I help you today?</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Ask me about recipes, meal planning, or nutrition.
              </p>

              {/* Quick Actions */}
              <div className="grid w-full grid-cols-2 gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    className="h-auto justify-center whitespace-normal py-3 text-center text-xs"
                    onClick={() => handleQuickAction(action.prompt)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              const isStreamingMessage = isLoading && isLastMessage && message.role === "assistant";
              const showSpinner = isStreamingMessage && !message.content;

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.role === "user" ? "Y" : <Leaf className="h-4 w-4" />}
                  </div>
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm max-w-[85%]",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {showSpinner ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    ) : message.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Demeter anything..."
            className="min-h-[40px] max-h-[120px] resize-none"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="button"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="shrink-0"
            onClick={sendMessage}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Demeter can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
