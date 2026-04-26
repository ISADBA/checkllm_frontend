import { z } from "zod";

import { supportedModelValues } from "@/lib/models";

export const submissionSchema = z.object({
  model: z.enum(supportedModelValues),
  baseUrl: z.string().url("请输入合法的 Base URL"),
  apiKey: z.string().min(8, "API Key 长度异常"),
  shareResult: z.boolean().default(true)
});

export function parseSubmission(input: {
  model: FormDataEntryValue | null;
  baseUrl: FormDataEntryValue | null;
  apiKey: FormDataEntryValue | null;
  shareResult: FormDataEntryValue | null;
}) {
  return submissionSchema.safeParse({
    model: stringify(input.model),
    baseUrl: stringify(input.baseUrl),
    apiKey: stringify(input.apiKey),
    shareResult: input.shareResult === "on"
  });
}

function stringify(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}
