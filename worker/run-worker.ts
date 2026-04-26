import { promises as fs } from "node:fs";
import path from "node:path";

import type { JobRecord } from "@/lib/jobs";
import { doneJobsDir, failedJobsDir, queuedJobsDir, runningJobsDir } from "@/lib/paths";
import { sleep } from "@/lib/time";
import { executeJob } from "@/worker/execute-job";

async function main() {
  for (;;) {
    await processNextJob();
    await sleep(1500);
  }
}

async function processNextJob() {
  const queuedEntries = await fs.readdir(queuedJobsDir);
  const nextFile = queuedEntries.find((entry) => entry.endsWith(".json"));

  if (!nextFile) {
    return;
  }

  const queuedPath = path.join(queuedJobsDir, nextFile);
  const runningPath = path.join(runningJobsDir, nextFile);

  try {
    await fs.rename(queuedPath, runningPath);
    const content = await fs.readFile(runningPath, "utf8");
    const job = JSON.parse(content) as JobRecord;

    const execution = await executeJob(job);
    const completedJob: JobRecord = {
      ...job,
      status: "done",
      resultId: execution.resultId,
      visibility: execution.visibility
    };

    delete completedJob.apiKey;

    await fs.writeFile(path.join(doneJobsDir, nextFile), `${JSON.stringify(completedJob, null, 2)}\n`, "utf8");
    await fs.unlink(runningPath);
  } catch (error) {
    const existingJob = await readJobIfExists(runningPath);
    const failedJob: JobRecord = {
      ...(existingJob ?? {
        jobId: nextFile.replace(/\.json$/, ""),
        queryCode: nextFile.replace(/\.json$/, ""),
        createdAt: new Date().toISOString(),
        model: "",
        baseUrl: "",
        shareResult: false
      }),
      status: "failed",
      failedAt: new Date().toISOString(),
      failureMessage: sanitizeFailureMessage(error, existingJob?.apiKey)
    };

    delete failedJob.apiKey;

    await fs.writeFile(path.join(failedJobsDir, nextFile), `${JSON.stringify(failedJob, null, 2)}\n`, "utf8");

    try {
      await fs.unlink(runningPath);
    } catch {
      return;
    }
  }
}

main().catch((error) => {
  console.error("worker exited", error);
  process.exit(1);
});

async function readJobIfExists(filePath: string) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as JobRecord;
  } catch {
    return null;
  }
}

function sanitizeFailureMessage(error: unknown, apiKey?: string) {
  const message = error instanceof Error ? error.message : "unknown worker error";

  if (!apiKey) {
    return message;
  }

  return message.split(apiKey).join("[REDACTED_API_KEY]");
}
