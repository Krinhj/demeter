import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert } from "@/lib/supabase/database.types";

export type ChatSession = Tables<"chat_sessions">;
export type ChatMessage = Tables<"chat_messages">;

/**
 * Get or create an active chat session for the user
 */
export async function getOrCreateActiveSession(userId: string): Promise<ChatSession> {
  const supabase = await createClient();

  // Try to find an active session (no ended_at)
  const { data: existingSession } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", userId)
    .is("ended_at", null)
    .order("last_message_at", { ascending: false })
    .limit(1)
    .single();

  if (existingSession) {
    return existingSession;
  }

  // Create a new session
  const { data: newSession, error } = await supabase
    .from("chat_sessions")
    .insert({ user_id: userId })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create chat session: ${error.message}`);
  }

  return newSession;
}

/**
 * Get a chat session by ID
 */
export async function getSessionById(sessionId: string): Promise<ChatSession | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Get all sessions for a user
 */
export async function getUserSessions(userId: string): Promise<ChatSession[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("last_message_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch sessions: ${error.message}`);
  }

  return data || [];
}

/**
 * Get messages for a session
 */
export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  return data || [];
}

/**
 * Add a message to a session
 */
export async function addMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string
): Promise<ChatMessage> {
  const supabase = await createClient();

  const message: TablesInsert<"chat_messages"> = {
    session_id: sessionId,
    role,
    content,
  };

  const { data, error } = await supabase
    .from("chat_messages")
    .insert(message)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add message: ${error.message}`);
  }

  return data;
}

/**
 * End a chat session
 */
export async function endSession(sessionId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("chat_sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (error) {
    throw new Error(`Failed to end session: ${error.message}`);
  }
}

/**
 * Delete a chat session and all its messages
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("id", sessionId);

  if (error) {
    throw new Error(`Failed to delete session: ${error.message}`);
  }
}

/**
 * Update session title
 */
export async function updateSessionTitle(
  sessionId: string,
  title: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("chat_sessions")
    .update({ title })
    .eq("id", sessionId);

  if (error) {
    throw new Error(`Failed to update session title: ${error.message}`);
  }
}
