"use client";

import { useState } from "react";

type Props = {
  queryPath: string;
};

export function CopyQueryButton({ queryPath }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const fullUrl = typeof window === "undefined" ? queryPath : `${window.location.origin}${queryPath}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-[var(--line-strong)] bg-white px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-elevated)]"
    >
      {copied ? "已复制完整查询地址" : "复制查询地址"}
    </button>
  );
}
