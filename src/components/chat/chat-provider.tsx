"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string | null;
  startedAt: string | null;
  endedAt: string | null;
  lastMessageAt: string | null;
  messageCount: number | null;
}

interface ChatContextType {
  // Overlay state
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;

  // Chat state
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  sendMessage: () => Promise<void>;
  isLoading: boolean;
  error: string | null;

  // Session management
  session: ChatSession | null;
  sessions: ChatSession[];
  loadSessions: () => Promise<void>;
  startNewSession: () => Promise<void>;
  switchSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;

  // View state
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChatOverlay() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatOverlay must be used within a ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial session when chat is opened
  const loadSession = useCallback(async () => {
    try {
      const response = await fetch("/api/chat");
      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
        setMessages(
          data.messages.map((m: { id: string; role: string; content: string }) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
          }))
        );
        setIsInitialized(true);
      }
    } catch (err) {
      console.error("Failed to load chat session:", err);
      setError("Failed to load chat session");
    }
  }, []);

  // Load sessions list
  const loadSessions = useCallback(async () => {
    try {
      const response = await fetch("/api/chat/sessions");
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  }, []);

  // Start a new session
  const startNewSession = useCallback(async () => {
    try {
      const response = await fetch("/api/chat/sessions", { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
        setMessages([]);
        setShowHistory(false);
      }
    } catch (err) {
      console.error("Failed to start new session:", err);
    }
  }, []);

  // Switch to a different session
  const switchSession = useCallback(
    async (targetSessionId: string) => {
      try {
        // End current session if it exists and is active
        if (session?.id && !session.endedAt) {
          await fetch(`/api/chat/sessions/${session.id}`, { method: "PATCH" });
        }

        // Load the target session
        const response = await fetch(`/api/chat?sessionId=${targetSessionId}`);
        if (response.ok) {
          const data = await response.json();
          setSession(data.session);
          setMessages(
            data.messages.map((m: { id: string; role: string; content: string }) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content,
            }))
          );
          setShowHistory(false);
        }
      } catch (err) {
        console.error("Failed to switch session:", err);
      }
    },
    [session]
  );

  // Delete a session
  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await fetch(`/api/chat/sessions/${sessionId}`, { method: "DELETE" });
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));

        // If we deleted the current session, start a new one
        if (session?.id === sessionId) {
          await startNewSession();
        }
      } catch (err) {
        console.error("Failed to delete session:", err);
      }
    },
    [session, startNewSession]
  );

  // Send a message
  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: session?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Create a placeholder for the assistant message
      const assistantMessage: Message = {
        id: `temp-assistant-${Date.now()}`,
        role: "assistant",
        content: "",
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Read the SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullContent += data.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: fullContent }
                      : m
                  )
                );
              }
            } catch {
              // Ignore parse errors for incomplete JSON
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again.");
      // Remove the user message if we failed
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, session?.id]);

  // Overlay controls
  const openChat = useCallback(() => {
    setIsOpen(true);
    if (!isInitialized) {
      loadSession();
    }
  }, [isInitialized, loadSession]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setShowHistory(false);
  }, []);

  const toggleChat = useCallback(() => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }, [isOpen, openChat, closeChat]);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleChat]);

  const value: ChatContextType = {
    isOpen,
    openChat,
    closeChat,
    toggleChat,
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
    error,
    session,
    sessions,
    loadSessions,
    startNewSession,
    switchSession,
    deleteSession,
    showHistory,
    setShowHistory,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
