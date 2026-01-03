import { createClient } from "@/lib/supabase/server";
import { getUserSessions } from "@/server/services/chat-service";

/**
 * GET /api/chat/sessions - List all chat sessions for the user
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await getUserSessions(user.id);

    return Response.json({
      sessions: sessions.map((s) => ({
        id: s.id,
        title: s.title || "New Chat",
        startedAt: s.started_at,
        endedAt: s.ended_at,
        lastMessageAt: s.last_message_at,
        messageCount: s.message_count,
      })),
    });
  } catch (error) {
    console.error("Sessions GET error:", error);
    return Response.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/sessions - Create a new chat session
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: session, error } = await supabase
      .from("chat_sessions")
      .insert({ user_id: user.id })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({ session });
  } catch (error) {
    console.error("Sessions POST error:", error);
    return Response.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
