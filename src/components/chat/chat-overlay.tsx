"use client";

import { Plus, History, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChatOverlay } from "./chat-provider";
import { ChatPanel } from "./chat-panel";
import { ChatHistory } from "./chat-history";

export function ChatOverlay() {
  const {
    isOpen,
    closeChat,
    showHistory,
    setShowHistory,
    loadSessions,
    startNewSession,
  } = useChatOverlay();

  const handleHistoryClick = () => {
    loadSessions();
    setShowHistory(true);
  };

  const handleNewChat = () => {
    startNewSession();
    setShowHistory(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeChat()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-md [&>button:last-child]:hidden"
      >
        <SheetHeader className="flex-row items-center justify-between border-b px-4 py-3">
          <SheetTitle className="flex items-center gap-2">
            <span className="text-lg font-semibold">Demeter AI</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-normal text-primary">
              Beta
            </span>
          </SheetTitle>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleNewChat}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New Chat</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Chat</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleHistoryClick}
                >
                  <History className="h-4 w-4" />
                  <span className="sr-only">History</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>History</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={closeChat}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Close</TooltipContent>
            </Tooltip>
          </div>
        </SheetHeader>

        {showHistory ? <ChatHistory /> : <ChatPanel />}
      </SheetContent>
    </Sheet>
  );
}
