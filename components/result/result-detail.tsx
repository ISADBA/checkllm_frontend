import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { ResultDetailData } from "@/lib/results";

type Props = {
  result: ResultDetailData;
  privateView?: boolean;
};

export function ResultDetail({ result, privateView = false }: Props) {
  const { summary } = result;
  const riskTone = getRiskTone(summary.overallRiskScore);

  return (
    <section className="mt-12 space-y-6">
      <div className="outline-card surface p-8 sm:p-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_340px] xl:items-start">
          <div className="space-y-3">
            <div className="space-y-3">
              <p className="eyebrow">{privateView ? "Private Result" : "Shared Result"}</p>
              <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">{summary.model}</h1>
              <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">{summary.summary}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className={`rounded-[var(--radius-md)] border p-6 sm:p-7 ${riskTone.cardClass}`}>
              <p className="text-xs uppercase tracking-[0.18em] opacity-75">Overall Risk</p>
              <p className="mt-3 text-5xl font-semibold">
                {summary.overallRiskScore}
                <span className="ml-1 text-2xl font-medium opacity-70">/100</span>
              </p>
              <p className="mt-3 text-sm font-medium">{riskTone.label}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 rounded-[var(--radius-md)] border border-[var(--line)] bg-white/60 p-5">
          <p className="eyebrow">Run Metadata</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Provider" value={summary.provider} />
            <InfoCard label="API Style" value={summary.apiStyle} />
            <InfoCard label="Source" value={summary.sourceHost} />
            <InfoCard label="Run At" value={formatDate(summary.runAt)} />
          </div>
        </div>
      </div>

      <div className="outline-card surface p-8 sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Dimension Scores</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">分项维度</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
            分数越高表示该维度越接近期望表现，风险判断会结合这些分项与最终结论一起给出。
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Object.entries(summary.scores).map(([label, value]) => (
            <div key={label} className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white/60 p-5">
              <p className="text-sm text-[var(--muted)]">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="outline-card surface min-w-0 p-8 sm:p-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Markdown Report</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">检测报告正文</h2>
          </div>
          <p className="text-sm text-[var(--muted)]">以下内容直接来自 engine 生成的原始 Markdown 报告。</p>
        </div>
        <div className="markdown-report mt-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.reportMarkdown}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white/60 p-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-base font-medium break-all">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function getRiskTone(score: number) {
  if (score <= 15) {
    return {
      label: "Low Risk",
      cardClass: "border-[#7cab8e] bg-[#e8f4ea] text-[#1d5b3a]"
    };
  }
  if (score <= 40) {
    return {
      label: "Guarded",
      cardClass: "border-[#d2ba67] bg-[#f8f0cf] text-[#6f5610]"
    };
  }
  if (score <= 69) {
    return {
      label: "Elevated",
      cardClass: "border-[#d39a5e] bg-[#f8e6d7] text-[#8f4b1c]"
    };
  }
  return {
    label: "High Risk",
    cardClass: "border-[#cf7d72] bg-[#f7dfdb] text-[#8b2f24]"
  };
}
