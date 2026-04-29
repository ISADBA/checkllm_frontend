import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import type { JobRecord } from "@/lib/jobs";
import { tempRoot } from "@/lib/paths";
import type { ResultSummary } from "@/lib/results";
import { redactBaseUrl } from "@/lib/redact";

const execFileAsync = promisify(execFile);

type EngineExecutionOutput = {
  resultId: string;
  visibility: "public" | "private";
  tempDir: string;
  summary: ResultSummary;
};

export async function runEngineForJob(job: JobRecord): Promise<EngineExecutionOutput> {
  const resultId = `res_${randomUUID()}`;
  const visibility = job.shareResult ? "public" : "private";
  const tempDir = path.join(tempRoot, job.jobId);
  const workDir = path.join(tempDir, "engine-workdir");

  await fs.mkdir(path.join(workDir, "docs", "runs"), { recursive: true });
  await fs.mkdir(path.join(workDir, "docs", "repos"), { recursive: true });

  const binaryPath = await resolveEngineBinary();
  const baselinePath = resolveBaselinePath(job.model);
  const archiveRelPath = path.join("docs", "runs", `${resultId}.md`);
  const args = [
    "run",
    "--provider",
    inferProvider(job.model),
    "--base-url",
    job.baseUrl,
    "--api-key",
    job.apiKey ?? "",
    "--model",
    job.model,
    "--baseline",
    baselinePath,
    "--output",
    archiveRelPath
  ];

  let stdout = "";
  let stderr = "";

  try {
    const output = await execFileAsync(binaryPath, args, {
      cwd: workDir,
      maxBuffer: 10 * 1024 * 1024
    });
    stdout = output.stdout;
    stderr = output.stderr;
  } catch (error) {
    throw new Error(sanitizeEngineError(error, job.apiKey ?? ""));
  }

  const archivePath = path.join(workDir, archiveRelPath);
  const reportPath = path.join(workDir, "docs", "repos", `${resultId}.md`);
  const [archiveMarkdown, reportMarkdown] = await Promise.all([
    fs.readFile(archivePath, "utf8"),
    fs.readFile(reportPath, "utf8")
  ]);

  assertNoAPIKeyLeak(job.apiKey ?? "", stdout, stderr, archiveMarkdown, reportMarkdown);

  const summary = buildSummary({
    resultId,
    visibility,
    job,
    stdout,
    archiveMarkdown,
    reportMarkdown
  });

  return {
    resultId,
    visibility,
    tempDir,
    summary
  };
}

async function resolveEngineBinary() {
  const candidates = [
    process.env.CHECKLLM_ENGINE_BIN,
    path.resolve(process.cwd(), "bin", binaryName("checkllm")),
    path.resolve(process.cwd(), "..", "checkllm_engine", "checkllm"),
    path.resolve(process.cwd(), "..", "checkllm_engine", "dist", currentPlatform(), binaryName("checkllm"))
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }

  throw new Error("checkllm_engine binary not found; expected ../checkllm_engine/checkllm or dist build");
}

function resolveBaselinePath(model: string) {
  const configuredBaselinesDir = process.env.CHECKLLM_BASELINES_DIR;

  return path.resolve(
    configuredBaselinesDir ?? path.resolve(process.cwd(), "engine-docs", "baselines"),
    `${inferProvider(model)}-${model}.md`
  );
}

function buildSummary(input: {
  resultId: string;
  visibility: "public" | "private";
  job: JobRecord;
  stdout: string;
  archiveMarkdown: string;
  reportMarkdown: string;
}): ResultSummary {
  const scoresBlock = parseYAMLBlock(input.archiveMarkdown, "Scores");
  const metadataBlock = parseYAMLBlock(input.archiveMarkdown, "Metadata");
  const interpretation = parseConclusion(input.archiveMarkdown);
  const reportSummary = parseHumanSummary(input.reportMarkdown);

  return {
    resultId: input.resultId,
    jobId: input.job.jobId,
    queryCode: input.job.queryCode,
    visibility: input.visibility,
    model: metadataBlock.model ?? input.job.model,
    provider: metadataBlock.provider ?? inferProvider(input.job.model),
    apiStyle: inferApiStyle(input.job.model),
    baseUrl: metadataBlock.base_url ?? input.job.baseUrl,
    sourceHost: redactBaseUrl(metadataBlock.base_url ?? input.job.baseUrl),
    createdAt: input.job.createdAt,
    runAt: metadataBlock.run_at ?? new Date().toISOString(),
    reportPath: "report.md",
    archivePath: "archive.md",
    summary: reportSummary ?? firstInterpretationSummary(input.archiveMarkdown) ?? "模型检测已完成。",
    conclusion: interpretation ?? parseConclusionFromStdout(input.stdout) ?? "unknown",
    overallRiskScore: toNumber(scoresBlock.overall_risk_score),
    scores: {
      protocol_conformity_score: toNumber(scoresBlock.protocol_conformity_score),
      stream_conformity_score: toNumber(scoresBlock.stream_conformity_score),
      usage_consistency_score: toNumber(scoresBlock.usage_consistency_score),
      behavior_fingerprint_score: toNumber(scoresBlock.behavior_fingerprint_score),
      capability_tool_score: toNumber(scoresBlock.capability_tool_score),
      tier_fidelity_score: toNumber(scoresBlock.tier_fidelity_score),
      route_integrity_score: toNumber(scoresBlock.route_integrity_score)
    }
  };
}

function parseYAMLBlock(markdown: string, section: string) {
  const pattern = new RegExp(`## ${escapeRegExp(section)}\\n\\n\\\`\\\`\\\`yaml\\n([\\s\\S]*?)\\n\\\`\\\`\\\``, "m");
  const match = markdown.match(pattern);

  if (!match) {
    return {} as Record<string, string>;
  }

  return Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const index = line.indexOf(":");
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim().replace(/^"(.*)"$/, "$1");
        return [key, value];
      })
  );
}

function parseConclusion(markdown: string) {
  const match = markdown.match(/- Conclusion: `([^`]+)`/);
  return match?.[1] ?? null;
}

function firstInterpretationSummary(markdown: string) {
  const match = markdown.match(/## Interpretation[\s\S]*?\n- Conclusion: `[^\n]+`\n- ([^\n]+)/);
  return match?.[1]?.trim() ?? null;
}

function parseHumanSummary(markdown: string) {
  const match = markdown.match(/## 一句话结论\s+([\s\S]*?)\n## /);
  return match?.[1]?.trim() ?? null;
}

function parseConclusionFromStdout(stdout: string) {
  const match = stdout.match(/conclusion=([a-z0-9_]+)/i);
  return match?.[1] ?? null;
}

function toNumber(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function inferProvider(model: string) {
  return model.startsWith("claude") ? "anthropic" : "openai";
}

function inferApiStyle(model: string) {
  return model.startsWith("claude") ? "messages" : "responses";
}

function currentPlatform() {
  return `${process.platform}-${process.arch}`;
}

function binaryName(name: string) {
  return process.platform === "win32" ? `${name}.exe` : name;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertNoAPIKeyLeak(apiKey: string, ...contents: string[]) {
  if (!apiKey) {
    return;
  }

  for (const content of contents) {
    if (content.includes(apiKey)) {
      throw new Error("engine output leaked api_key; aborting result persistence");
    }
  }
}

function sanitizeEngineError(error: unknown, apiKey: string) {
  const message = error instanceof Error ? error.message : "unknown engine execution error";
  return sanitizeText(message, apiKey);
}

function sanitizeText(value: string, apiKey: string) {
  if (!apiKey) {
    return value;
  }

  return value.split(apiKey).join("[REDACTED_API_KEY]");
}
