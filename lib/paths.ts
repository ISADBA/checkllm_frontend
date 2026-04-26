import path from "node:path";

const root = process.cwd();

export const dataRoot = path.join(root, "data");
export const jobsRoot = path.join(dataRoot, "jobs");
export const queuedJobsDir = path.join(jobsRoot, "queued");
export const runningJobsDir = path.join(jobsRoot, "running");
export const doneJobsDir = path.join(jobsRoot, "done");
export const failedJobsDir = path.join(jobsRoot, "failed");
export const resultsRoot = path.join(dataRoot, "results");
export const publicResultsDir = path.join(resultsRoot, "public");
export const privateResultsDir = path.join(resultsRoot, "private");
export const tempRoot = path.join(dataRoot, "tmp");
