import { createClient } from "@/lib/supabase/server";
import {
  getOrCreateActiveSession,
  getSessionMessages,
  addMessage,
} from "@/server/services/chat-service";
import { mastra } from "@/mastra";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * GET /api/chat - Load or create active session with messages
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

    const session = await getOrCreateActiveSession(user.id);
    const messages = await getSessionMessages(session.id);

    return Response.json({
      session,
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.created_at,
      })),
    });
  } catch (error) {
    console.error("Chat GET error:", error);
    return Response.json(
      { error: "Failed to load chat session" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat - Send a message and get AI response
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, sessionId } = await request.json();

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Get or validate session
    let session;
    if (sessionId) {
      const supabaseCheck = await createClient();
      const { data: existingSession } = await supabaseCheck
        .from("chat_sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .single();

      if (!existingSession) {
        return Response.json({ error: "Session not found" }, { status: 404 });
      }
      session = existingSession;
    } else {
      session = await getOrCreateActiveSession(user.id);
    }

    // Save user message
    await addMessage(session.id, "user", message);

    // Get conversation history for context
    const history = await getSessionMessages(session.id);
    const conversationMessages = history.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    // Get the Demeter agent and stream response
    const agent = mastra.getAgent("demeter");
    // Type assertion needed due to AI SDK version mismatch between project and Mastra's bundled version
    const result = await agent.stream(conversationMessages as Parameters<typeof agent.stream>[0]);

    // Collect the full response for saving
    let fullResponse = "";

    // Create a TransformStream to collect and forward chunks
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Process the stream in the background
    (async () => {
      try {
        for await (const chunk of result.textStream) {
          fullResponse += chunk;
          await writer.write(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
        }
        // Save assistant response to database after streaming completes
        await addMessage(session.id, "assistant", fullResponse);
        await writer.close();
      } catch (err) {
        console.error("Stream error:", err);
        await writer.abort(err);
      }
    })();

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat POST error:", error);
    return Response.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
