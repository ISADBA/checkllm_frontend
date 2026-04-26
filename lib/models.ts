export const supportedModels = [
  { value: "gpt-5.4", label: "OpenAI · gpt-5.4" },
  { value: "gpt-5.5", label: "OpenAI · gpt-5.5" },
  { value: "claude-opus-4-6", label: "Anthropic · claude-opus-4-6" },
  { value: "claude-opus-4-7", label: "Anthropic · claude-opus-4-7" }
] as const;

export const supportedModelValues = [
  "gpt-5.4",
  "gpt-5.5",
  "claude-opus-4-6",
  "claude-opus-4-7"
] as const;
