import { PublicResultsList } from "@/components/home/public-results-list";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { SubmissionForm } from "@/components/form/submission-form";
import { listPublicResults } from "@/lib/results";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const results = await listPublicResults();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-10 pt-6 sm:px-8 lg:px-10">
      <SiteHeader />
      <section className="grid gap-8 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="eyebrow">Detect Model Laundering</p>
            <h1 className="max-w-3xl text-5xl leading-tight font-semibold tracking-tight text-balance sm:text-6xl">
              模型纯度检测
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
              检测三方 MaaS 平台有没有灌水，用低端模型包壳冒充高端模型
            </p>
            <ul className="grid max-w-2xl gap-3 text-base text-[var(--muted)] sm:grid-cols-2">
              <li className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white/45 px-4 py-3">
                识别高端模型名义销售、低端模型实际出货
              </li>
              <li className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white/45 px-4 py-3">
                检查协议、usage、工具调用和行为指纹异常
              </li>
            </ul>
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                href="https://github.com/ISADBA/checkllm"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-white px-5 py-3 font-medium text-[var(--foreground)] transition hover:bg-[var(--background-elevated)]"
              >
                <GitHubIcon />
                在 GitHub 上 Star 项目
              </a>
              <a
                href="#submit"
                className="rounded-full border border-[var(--line-strong)] px-5 py-3 font-medium transition hover:bg-black/3"
              >
                立即发起检测
              </a>
            </div>
          </div>
          <div className="grid gap-4 text-sm text-[var(--muted)] sm:grid-cols-3">
            <div className="outline-card surface p-5">
              <p className="font-medium text-[var(--foreground)]">识别套壳冒充</p>
              <p className="mt-2 leading-6">检查高端模型名义下，是否实际返回低端模型或包装层结果。</p>
            </div>
            <div className="outline-card surface p-5">
              <p className="font-medium text-[var(--foreground)]">识别 MaaS 灌水</p>
              <p className="mt-2 leading-6">检查三方平台是否通过降级、替换、改写等方式稀释模型质量。</p>
            </div>
            <div className="outline-card surface p-5">
              <p className="font-medium text-[var(--foreground)]">沉淀公开案例</p>
              <p className="mt-2 leading-6">默认共享无敏感信息的检测摘要，便于横向比较与检索。</p>
            </div>
          </div>
        </div>
        <SubmissionForm />
      </section>
      <PublicResultsList results={results} />
      <SiteFooter />
    </main>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
    >
      <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.09 3.3 9.4 7.87 10.92.58.1.79-.25.79-.56 0-.28-.01-1.2-.02-2.17-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.03 1.78 2.7 1.27 3.36.97.1-.75.4-1.27.72-1.56-2.56-.29-5.25-1.29-5.25-5.72 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.5.11-3.13 0 0 .97-.31 3.19 1.18a11 11 0 0 1 5.81 0c2.22-1.49 3.18-1.18 3.18-1.18.64 1.63.24 2.83.12 3.13.74.81 1.19 1.84 1.19 3.1 0 4.44-2.7 5.42-5.28 5.71.41.36.77 1.06.77 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.56A11.53 11.53 0 0 0 23.5 12C23.5 5.66 18.35.5 12 .5Z" />
    </svg>
  );
}
