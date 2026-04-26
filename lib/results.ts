import { promises as fs } from "node:fs";
import path from "node:path";

import { privateResultsDir, publicResultsDir } from "@/lib/paths";

export type ResultSummary = {
  resultId: string;
  jobId: string;
  queryCode: string;
  visibility: "public" | "private";
  model: string;
  provider: string;
  apiStyle: string;
  baseUrl: string;
  sourceHost: string;
  createdAt: string;
  runAt: string;
  reportPath: string;
  archivePath: string;
  summary: string;
  conclusion: string;
  overallRiskScore: number;
  scores: Record<string, number>;
};

export type ResultDetailData = {
  summary: ResultSummary;
  reportMarkdown: string;
  archiveMarkdown: string;
};

export async function listPublicResults() {
  return listDirectory(publicResultsDir);
}

export async function getPublicResultById(resultId: string) {
  return getResultFromDirectory(publicResultsDir, resultId);
}

export async function getResultByQueryCode(queryCode: string) {
  const [publicResults, privateResults] = await Promise.all([
    listDirectory(publicResultsDir),
    listDirectory(privateResultsDir)
  ]);

  return [...publicResults, ...privateResults].find((item) => item.queryCode === queryCode) ?? null;
}

export async function getPrivateResultById(resultId: string) {
  return getResultFromDirectory(privateResultsDir, resultId);
}

async function getResultFromDirectory(root: string, resultId: string) {
  const resultDir = path.join(root, resultId);

  try {
    const summary = await readSummary(resultDir);
    const [reportMarkdown, archiveMarkdown] = await Promise.all([
      fs.readFile(path.join(resultDir, summary.reportPath), "utf8"),
      fs.readFile(path.join(resultDir, summary.archivePath), "utf8")
    ]);

    return {
      summary,
      reportMarkdown,
      archiveMarkdown
    } satisfies ResultDetailData;
  } catch {
    return null;
  }
}

async function listDirectory(directory: string) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const results = await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => readSummary(path.join(directory, entry.name)))
    );

    return results.sort((a, b) => {
      return new Date(b.runAt).getTime() - new Date(a.runAt).getTime();
    });
  } catch {
    return [] as ResultSummary[];
  }
}

async function readSummary(resultDir: string) {
  const content = await fs.readFile(path.join(resultDir, "summary.json"), "utf8");
  return JSON.parse(content) as ResultSummary;
}
