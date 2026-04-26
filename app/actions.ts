"use server";

import { redirect } from "next/navigation";

import { createJob } from "@/lib/jobs";
import { parseSubmission } from "@/lib/validation";

export async function submitDetection(formData: FormData) {
  const parsed = parseSubmission({
    model: formData.get("model"),
    baseUrl: formData.get("baseUrl"),
    apiKey: formData.get("apiKey"),
    shareResult: formData.get("shareResult")
  });

  if (!parsed.success) {
    redirect("/?error=invalid_submission");
  }

  const job = await createJob(parsed.data);
  redirect(`/submit/success/${job.queryCode}`);
}
