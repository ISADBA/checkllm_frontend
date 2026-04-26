import { submitDetection } from "@/app/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { supportedModels } from "@/lib/models";

export function SubmissionForm() {
  return (
    <section id="submit" className="outline-card surface p-6 sm:p-8">
      <div className="space-y-2">
        <p className="eyebrow">Launch Check</p>
        <h2 className="text-3xl font-semibold tracking-tight">提交一次模型检测</h2>
        <p className="text-base leading-7 text-[var(--muted)]">
          API Key 只会用于本次检测请求，不会存储在系统中。默认共享的内容不包含任何敏感信息。
        </p>
      </div>
      <form action={submitDetection} className="mt-8 space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-medium">目标模型</span>
          <select
            name="model"
            defaultValue={supportedModels[0]?.value}
            className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-white/80 px-4 py-3 text-base outline-none transition focus:border-[var(--accent)]"
          >
            {supportedModels.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Base URL</span>
          <input
            type="url"
            name="baseUrl"
            placeholder="https://api.openai.com/v1"
            required
            className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-white/80 px-4 py-3 text-base outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">API Key</span>
          <input
            type="password"
            name="apiKey"
            placeholder="sk-..."
            required
            className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-white/80 px-4 py-3 text-base outline-none transition focus:border-[var(--accent)]"
          />
          <span className="block text-sm leading-6 text-[var(--muted)]">
            该密钥仅在任务执行阶段短暂使用，不会出现在结果页，也不会进入公开共享目录。
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-white/55 p-4">
          <input
            type="checkbox"
            name="shareResult"
            defaultChecked
            className="mt-1 h-4 w-4 rounded border-[var(--line)] text-[var(--accent)]"
          />
          <span className="space-y-1">
            <span className="block text-sm font-medium">共享评测结果</span>
            <span className="block text-sm leading-6 text-[var(--muted)]">
              默认参与共享。共享内容仅包括模型、脱敏后的来源信息、评分和结论摘要，不包含 API Key。
            </span>
          </span>
        </label>
        <SubmitButton />
      </form>
    </section>
  );
}
