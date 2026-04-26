import type { Metadata } from "next";

import type { ResultSummary } from "@/lib/results";

export function buildResultMetadata(result: ResultSummary): Metadata {
  const title = `${result.model} 检测结果`;
  const description = `${result.model} 于 ${formatDate(result.runAt)} 完成检测，结论为 ${result.conclusion}，总体风险分 ${result.overallRiskScore}。`;

  return {
    title,
    description,
    alternates: {
      canonical: `/results/${result.resultId}`
    },
    openGraph: {
      title,
      description,
      type: "article"
    }
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium"
  }).format(new Date(value));
}
