# checkllm_frontend

`checkllm_frontend` 是 `checkllm` 的 Web 前端，用于提交模型检测任务、查询异步结果、浏览共享检测案例，并展示 `checkllm_engine` 生成的原始 Markdown 报告。

## 相关仓库

- 当前 `checkllm_frontend/` 对应的前端仓库是：`https://github.com/ISADBA/checkllm_frontend`
- 配套的 engine 仓库是：`https://github.com/ISADBA/checkllm`
- `checkllm_engine` 负责实际的模型检测执行、报告生成和 baseline 管理，前端通过 worker 调用它完成任务处理

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

## Docker 打包

在 `checkllm_frontend/` 目录下执行：

```bash
make build
```

默认会构建：

```text
crpi-0vih3w2g8se3zbl8.cn-hangzhou.personal.cr.aliyuncs.com/isadba/checkllm-frontend:latest
```

说明：

- 打包过程会同时构建 `checkllm_frontend`
- 镜像内会包含 `checkllm_engine` 二进制
- Docker build context 使用仓库根目录，因此可以同时读取 `checkllm_engine/`

可选变量：

```bash
make build TAG=v0.1.0
```

## 容器运行

镜像启动后会：

1. 启动 Next.js Web 服务
2. 后台启动 worker
3. 由 worker 调用镜像内置的 `checkllm_engine`

默认数据目录：

```text
/data/checkllm
```

可通过环境变量覆盖：

```text
CHECKLLM_DATA_ROOT
CHECKLLM_ENGINE_BIN
CHECKLLM_BASELINES_DIR
CHECKLLM_WORKER_CONCURRENCY
PORT
```

说明：

- `CHECKLLM_WORKER_CONCURRENCY` 控制容器内并发消费任务数，默认值为 `4`

## S3 挂载存储

任务状态、检测结果、临时目录都基于 `CHECKLLM_DATA_ROOT` 存储。

推荐两种方式：

### 方式一：宿主机先挂载 S3，再 bind mount 给容器

这是更稳妥的方式。容器只把挂载后的本地目录当普通文件系统使用。

例如：

```bash
docker run \
  -p 3000:3000 \
  -e CHECKLLM_DATA_ROOT=/data/checkllm \
  -v /mnt/checkllm-s3:/data/checkllm \
  crpi-0vih3w2g8se3zbl8.cn-hangzhou.personal.cr.aliyuncs.com/isadba/checkllm-frontend:latest
```

### 方式二：容器内直接用 s3fs 挂载

镜像内已包含 `s3fs` 和挂载脚本。启用方式：

```bash
docker run \
  -p 3000:3000 \
  --cap-add SYS_ADMIN \
  --device /dev/fuse \
  --security-opt apparmor:unconfined \
  -e S3_MOUNT_ENABLED=true \
  -e S3_BUCKET=your-bucket \
  -e S3_REGION=ap-southeast-1 \
  -e AWS_ACCESS_KEY_ID=xxx \
  -e AWS_SECRET_ACCESS_KEY=yyy \
  crpi-0vih3w2g8se3zbl8.cn-hangzhou.personal.cr.aliyuncs.com/isadba/checkllm-frontend:latest
```

说明：

- 容器内挂载 S3 依赖 FUSE
- 需要容器运行时具备对应权限
- 如果你使用的是兼容 S3 的对象存储，还可以补 `S3_ENDPOINT`

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
