import { promises as fs } from "node:fs";
import path from "node:path";

import { runEngineForJob } from "@/lib/engine";
import type { JobRecord } from "@/lib/jobs";
import { privateResultsDir, publicResultsDir } from "@/lib/paths";

export async function executeJob(job: JobRecord) {
  const execution = await runEngineForJob(job);
  const targetRoot = execution.visibility === "public" ? publicResultsDir : privateResultsDir;
  const targetDir = path.join(targetRoot, execution.resultId);

  await fs.mkdir(targetDir, { recursive: true });
  await fs.copyFile(path.join(execution.tempDir, "engine-workdir", "docs", "repos", `${execution.resultId}.md`), path.join(targetDir, "report.md"));
  await fs.copyFile(path.join(execution.tempDir, "engine-workdir", "docs", "runs", `${execution.resultId}.md`), path.join(targetDir, "archive.md"));
  await fs.writeFile(path.join(targetDir, "summary.json"), `${JSON.stringify(execution.summary, null, 2)}\n`, "utf8");
  await fs.rm(execution.tempDir, { recursive: true, force: true });

  return {
    resultId: execution.resultId,
    visibility: execution.visibility
  };
}
