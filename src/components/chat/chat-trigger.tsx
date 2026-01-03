"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChatOverlay } from "./chat-provider";
import { cn } from "@/lib/utils";

interface ChatTriggerProps {
  className?: string;
}

export function ChatTrigger({ className }: ChatTriggerProps) {
  const { toggleChat } = useChatOverlay();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleChat}
          className={cn("relative", className)}
        >
          <Sparkles className="h-5 w-5" />
          <span className="sr-only">Open Demeter AI</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>
          Demeter AI <kbd className="ml-1 text-xs opacity-60">Ctrl+K</kbd>
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
