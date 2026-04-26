"use client";

import Link from "next/link";
import { useState } from "react";

import type { ResultSummary } from "@/lib/results";

const PAGE_SIZE = 20;

type Props = {
  results: ResultSummary[];
};

export function PublicResultsList({ results }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleResults = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;

  return (
    <section id="recent-results" className="space-y-6 pb-16">
      <div className="space-y-2">
        <p className="eyebrow">Shared Reports</p>
        <h2 className="text-3xl font-semibold tracking-tight">最近共享的检测结果</h2>
        <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
          越新的结果越靠前。公开详情页可被搜索引擎索引，私有结果不会出现在这里。
        </p>
      </div>
      {results.length === 0 ? (
        <div className="outline-card surface p-8 text-[var(--muted)]">
          当前还没有共享结果。首个公开检测完成后，这里会开始积累样本。
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {visibleResults.map((result) => (
              <Link
                key={result.resultId}
                href={`/results/${result.resultId}`}
                target="_blank"
                rel="noreferrer"
                className="outline-card surface block p-6 transition hover:-translate-y-0.5 hover:border-[var(--line-strong)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
                        {result.model}
                      </span>
                      <span className="text-sm text-[var(--muted)]">{formatDate(result.runAt)}</span>
                    </div>
                    <p className="text-sm break-all text-[var(--muted)]">base_url: {result.baseUrl}</p>
                    <h3 className="text-2xl font-semibold tracking-tight">{result.summary}</h3>
                    <p className="max-w-2xl text-[var(--muted)]">{result.conclusion}</p>
                  </div>
                  <div className="min-w-36 rounded-[var(--radius-md)] border border-[var(--line)] bg-white/55 p-4 text-right">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Overall Risk</p>
                    <p className="mt-2 text-3xl font-semibold">{result.overallRiskScore}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {hasMore ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="rounded-full border border-[var(--line-strong)] bg-white px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-elevated)]"
              >
                加载更多
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
