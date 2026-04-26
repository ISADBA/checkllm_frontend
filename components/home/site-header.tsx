import Link from "next/link";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--line)] pb-4">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line-strong)] bg-white/70 text-sm font-semibold">
          CL
        </div>
        <div>
          <p className="text-base font-semibold tracking-tight">checkllm</p>
          {!compact ? <p className="text-sm text-[var(--muted)]">Model authenticity and fidelity check</p> : null}
        </div>
      </Link>
      <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] sm:flex">
        <a href="#submit" className="transition hover:text-[var(--foreground)]">
          提交检测
        </a>
        <a href="#recent-results" className="transition hover:text-[var(--foreground)]">
          共享结果
        </a>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/ISADBA/checkllm"
            target="_blank"
            rel="noreferrer"
            aria-label="Open checkllm on GitHub"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-white/82 px-3 py-2 text-[var(--foreground)] transition hover:bg-white"
          >
            <GitHubIcon />
            <span className="font-medium">ISADBA/checkllm</span>
          </a>
          <a
            href="https://github.com/ISADBA/checkllm"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#d7b25a] bg-[#f5d98f] px-4 py-2 font-medium text-[#4f3a12] shadow-[0_10px_24px_rgba(146,110,28,0.18)] transition hover:-translate-y-px hover:bg-[#f1d17a] hover:shadow-[0_14px_28px_rgba(146,110,28,0.24)]"
          >
            <StarIcon />
            <span>Star 支持项目</span>
          </a>
        </div>
      </nav>
    </header>
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

function StarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
    >
      <path d="m12 2.75 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 16.95 6.44 19.87l1.06-6.2L3 9.28l6.22-.9L12 2.75Z" />
    </svg>
  );
}
