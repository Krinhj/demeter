import { Mastra } from "@mastra/core";
import { demeterAgent } from "./agents/demeter-agent";

export const mastra = new Mastra({
  agents: {
    demeter: demeterAgent,
  },
});
