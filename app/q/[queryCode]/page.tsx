import { redirect } from "next/navigation";

import { ResultDetail } from "@/components/result/result-detail";
import { SiteHeader } from "@/components/home/site-header";
import { getJobStateByQueryCode } from "@/lib/jobs";
import { getPrivateResultById, getResultByQueryCode } from "@/lib/results";

type Props = {
  params: Promise<{ queryCode: string }>;
};

export default async function QueryCodePage({ params }: Props) {
  const { queryCode } = await params;
  const jobState = await getJobStateByQueryCode(queryCode);
  const result = await getResultByQueryCode(queryCode);

  if (jobState?.status === "failed") {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 pb-10 pt-6 sm:px-8">
        <SiteHeader compact />
        <section className="outline-card surface mt-12 space-y-5 p-8 sm:p-10">
          <p className="eyebrow">Task Failed</p>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight">检测任务执行失败。</h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
            当前这次检测没有成功完成。你可以检查目标接口参数后重新提交。
          </p>
          <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white/60 p-5">
            <p className="text-sm text-[var(--muted)]">失败原因</p>
            <p className="mt-2 break-words text-base font-medium">
              {jobState.job.failureMessage ?? "未提供具体错误信息"}
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 pb-10 pt-6 sm:px-8">
        <SiteHeader compact />
        <section className="outline-card surface mt-12 space-y-4 p-8 sm:p-10">
          <p className="eyebrow">{jobState?.status === "running" ? "Task Running" : "Task Pending"}</p>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight">
            {jobState?.status === "running" ? "检测任务正在执行中。" : "任务仍在排队中。"}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
            当前还没有可读取的结果文件。正常情况下，完整检测通常会在约 5 分钟内完成。请稍后刷新当前页面。
          </p>
        </section>
      </main>
    );
  }

  if (result.visibility === "public") {
    redirect(`/results/${result.resultId}`);
  }

  const privateResult = await getPrivateResultById(result.resultId);

  if (!privateResult) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 pb-10 pt-6 sm:px-8">
        <SiteHeader compact />
        <section className="outline-card surface mt-12 space-y-4 p-8 sm:p-10">
          <p className="eyebrow">Result Missing</p>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight">检测结果索引存在，但正文文件尚未就绪。</h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">请稍后刷新当前页面。</p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 pb-10 pt-6 sm:px-8">
      <SiteHeader compact />
      <ResultDetail result={privateResult} privateView />
    </main>
  );
}
