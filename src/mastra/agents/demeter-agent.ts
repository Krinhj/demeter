import { Agent } from "@mastra/core/agent";
import { DEMETER_SYSTEM_PROMPT } from "@/lib/ai/demeter-system-prompt";

export const demeterAgent = new Agent({
  name: "Demeter",
  instructions: DEMETER_SYSTEM_PROMPT,
  model: "openai/gpt-4o",
});
