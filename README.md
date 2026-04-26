# checkllm_frontend

`checkllm_frontend` 是 `checkllm` 的 Web 前端，用于提交模型检测任务、查询异步结果、浏览共享检测案例，并展示 `checkllm_engine` 生成的原始 Markdown 报告。

## 功能

- 首页提交模型检测任务
- 支持选择模型、输入 `base_url` 和 `api_key`
- 默认支持共享评测结果
- 异步任务队列与本地 worker 执行
- 公开结果列表与详情页
- 结果详情页直接渲染 `checkllm_engine` 输出的 Markdown 报告
- 基础 SEO 支持：SSR、`sitemap.xml`、`robots.txt`

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- react-markdown
- remark-gfm

## 目录

```text
app/          Next.js App Router 页面
components/   UI 组件
lib/          任务、结果、engine 集成逻辑
worker/       后台任务消费与 engine 调用
data/         本地任务队列、结果目录、临时目录
```

## 本地启动

安装依赖：

```bash
pnpm install
```

启动前端：

```bash
pnpm dev
```

默认访问：

```text
http://localhost:3000
```

启动 worker：

```bash
pnpm worker
```

说明：

- `pnpm dev` 只启动前端页面
- `pnpm worker` 才会消费 `data/jobs/queued/` 里的任务

## engine 对接

当前 worker 会优先查找以下二进制：

1. `../checkllm_engine/checkllm`
2. `../checkllm_engine/dist/<platform>/checkllm`

执行时会：

1. 为每个任务创建临时工作目录
2. 调用 `checkllm_engine run`
3. 生成 `report.md`、`archive.md`、`summary.json`
4. 将公开结果和私有结果分目录存储

## 安全约束

- `api_key` 只用于任务执行阶段
- `api_key` 不写入最终结果文件
- `api_key` 不写入完成态 job 文件
- 共享结果与私有结果分目录存储

## 当前状态

当前版本已经打通：

- 任务提交
- worker 消费
- `checkllm_engine` CLI 调用
- 原始 Markdown 报告展示
- 首页共享结果列表

后续仍可继续增强：

- 结论标签的人类可读翻译
- 更丰富的结果筛选和分页
- engine 机器可读 JSON 输出
