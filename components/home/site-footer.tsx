export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] pt-8 text-sm text-[var(--muted)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>checkllm 首期站点骨架。共享结果不包含 API Key 等敏感信息。</p>
        <p>SSR · File Queue · Public SEO</p>
      </div>
    </footer>
  );
}
