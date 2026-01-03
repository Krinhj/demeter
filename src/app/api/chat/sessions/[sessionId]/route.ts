import { createClient } from "@/lib/supabase/server";
import {
  endSession,
  deleteSession,
  getSessionById,
} from "@/server/services/chat-service";

interface RouteParams {
  params: Promise<{ sessionId: string }>;
}

/**
 * DELETE /api/chat/sessions/[sessionId] - Delete a chat session
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { sessionId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const session = await getSessionById(sessionId);
    if (!session || session.user_id !== user.id) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    await deleteSession(sessionId);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Session DELETE error:", error);
    return Response.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/chat/sessions/[sessionId] - End a chat session
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { sessionId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const session = await getSessionById(sessionId);
    if (!session || session.user_id !== user.id) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    await endSession(sessionId);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Session PATCH error:", error);
    return Response.json({ error: "Failed to end session" }, { status: 500 });
  }
}
