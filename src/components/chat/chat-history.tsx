"use client";

import { ChevronLeft, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatOverlay } from "./chat-provider";

export function ChatHistory() {
  const {
    sessions,
    setShowHistory,
    switchSession,
    closeChat,
  } = useChatOverlay();

  const handleBack = () => {
    setShowHistory(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "just now";
    if (diffHours < 24) return `about ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8 -ml-2"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <span className="font-semibold">Chat History</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeChat}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col py-2">
          {sessions.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No chat history yet
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => switchSession(session.id)}
                className="flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    switchSession(session.id);
                  }
                }}
              >
                <MessageSquare className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {session.title || "New Chat"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.messageCount || 0} message{session.messageCount !== 1 ? "s" : ""}
                    {" · "}
                    {formatDate(session.lastMessageAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
