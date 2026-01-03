"use client";

import { ArrowLeft, MessageSquare, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatOverlay } from "./chat-provider";
import { cn } from "@/lib/utils";

export function ChatHistory() {
  const {
    sessions,
    session: currentSession,
    setShowHistory,
    switchSession,
    deleteSession,
    startNewSession,
  } = useChatOverlay();

  const handleBack = () => {
    setShowHistory(false);
  };

  const handleNewChat = async () => {
    await startNewSession();
    setShowHistory(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-1.5 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewChat}
          className="gap-1.5 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          New Chat
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {sessions.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No chat history yet
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted",
                  currentSession?.id === session.id && "bg-muted"
                )}
              >
                <button
                  onClick={() => switchSession(session.id)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {session.title || "New Chat"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(session.lastMessageAt)}
                      {session.messageCount ? ` - ${session.messageCount} messages` : ""}
                    </p>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  <span className="sr-only">Delete chat</span>
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
