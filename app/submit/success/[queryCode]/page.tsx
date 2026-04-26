import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/home/site-header";
import { CopyQueryButton } from "@/components/ui/copy-query-button";
import { getJobByQueryCode } from "@/lib/jobs";

type Props = {
  params: Promise<{ queryCode: string }>;
};

export default async function SubmitSuccessPage({ params }: Props) {
  const { queryCode } = await params;
  const job = await getJobByQueryCode(queryCode);

  if (!job) {
    notFound();
  }

  const queryPath = `/q/${job.queryCode}`;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 pb-10 pt-6 sm:px-8">
      <SiteHeader compact />
      <section className="outline-card surface mt-12 space-y-6 p-8 sm:p-10">
        <p className="eyebrow">Task Submitted</p>
        <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance">
          检测任务已进入队列。
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          这是一个异步任务，通常会在约 5 分钟内完成。你可以保存下面的查询链接，稍后回来查看结果。
        </p>
        <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white/60 p-5">
          <p className="text-sm text-[var(--muted)]">查询码</p>
          <p className="mt-2 break-all text-lg font-medium">{job.queryCode}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <CopyQueryButton queryPath={queryPath} />
          <a
            href={queryPath}
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-92"
          >
            打开查询页
          </a>
          <Link
            href="/"
            className="rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-medium transition hover:bg-black/3"
          >
            返回首页
          </Link>
        </div>
      </section>
    </main>
  );
}
