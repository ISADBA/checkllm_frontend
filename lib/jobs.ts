import { randomBytes, randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";

import { doneJobsDir, failedJobsDir, queuedJobsDir, runningJobsDir } from "@/lib/paths";
import { submissionSchema } from "@/lib/validation";

export type SubmissionInput = z.infer<typeof submissionSchema>;

export type JobRecord = {
  jobId: string;
  queryCode: string;
  createdAt: string;
  status: "queued" | "running" | "done" | "failed";
  model: string;
  baseUrl: string;
  apiKey?: string;
  shareResult: boolean;
  resultId?: string;
  visibility?: "public" | "private";
  failedAt?: string;
  failureMessage?: string;
};

export async function createJob(input: SubmissionInput) {
  const job: JobRecord = {
    jobId: `job_${randomUUID()}`,
    queryCode: createQueryCode(),
    createdAt: new Date().toISOString(),
    status: "queued",
    model: input.model,
    baseUrl: input.baseUrl,
    apiKey: input.apiKey,
    shareResult: input.shareResult
  };

  const target = path.join(queuedJobsDir, `${job.queryCode}.json`);
  await fs.writeFile(target, `${JSON.stringify(job, null, 2)}\n`, "utf8");
  return job;
}

export async function getJobByQueryCode(queryCode: string) {
  const locations = [queuedJobsDir, runningJobsDir, doneJobsDir, failedJobsDir];

  for (const location of locations) {
    const filePath = path.join(location, `${queryCode}.json`);
    try {
      const content = await fs.readFile(filePath, "utf8");
      return JSON.parse(content) as JobRecord;
    } catch {
      continue;
    }
  }

  return null;
}

export async function getJobStateByQueryCode(queryCode: string) {
  const locations = [
    { status: "queued", dir: queuedJobsDir },
    { status: "running", dir: runningJobsDir },
    { status: "done", dir: doneJobsDir },
    { status: "failed", dir: failedJobsDir }
  ] as const;

  for (const location of locations) {
    const filePath = path.join(location.dir, `${queryCode}.json`);
    try {
      const content = await fs.readFile(filePath, "utf8");
      return {
        status: location.status,
        job: JSON.parse(content) as JobRecord
      };
    } catch {
      continue;
    }
  }

  return null;
}

function createQueryCode() {
  return `q_${randomBytes(16).toString("base64url")}`;
}
