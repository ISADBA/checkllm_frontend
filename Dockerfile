FROM node:22-bookworm-slim AS frontend-builder

WORKDIR /app

RUN corepack enable

COPY checkllm_frontend/package.json checkllm_frontend/pnpm-lock.yaml ./checkllm_frontend/
WORKDIR /app/checkllm_frontend
RUN pnpm install --frozen-lockfile

COPY checkllm_frontend ./ 
RUN pnpm build

FROM golang:1.22-bookworm AS engine-builder

WORKDIR /app/checkllm_engine
COPY checkllm_engine ./
RUN go build -o /out/checkllm ./cmd/checkllm

FROM node:22-bookworm-slim AS runtime

WORKDIR /app/checkllm_frontend

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates fuse3 s3fs \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3000
ENV CHECKLLM_DATA_ROOT=/data/checkllm
ENV CHECKLLM_ENGINE_BIN=/app/bin/checkllm
ENV CHECKLLM_BASELINES_DIR=/app/engine-docs/baselines

COPY --from=frontend-builder /app/checkllm_frontend/.next ./.next
COPY --from=frontend-builder /app/checkllm_frontend/app ./app
COPY --from=frontend-builder /app/checkllm_frontend/components ./components
COPY --from=frontend-builder /app/checkllm_frontend/lib ./lib
COPY --from=frontend-builder /app/checkllm_frontend/public ./public
COPY --from=frontend-builder /app/checkllm_frontend/worker ./worker
COPY --from=frontend-builder /app/checkllm_frontend/scripts ./scripts
COPY --from=frontend-builder /app/checkllm_frontend/package.json ./package.json
COPY --from=frontend-builder /app/checkllm_frontend/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=frontend-builder /app/checkllm_frontend/next.config.ts ./next.config.ts
COPY --from=frontend-builder /app/checkllm_frontend/postcss.config.mjs ./postcss.config.mjs
COPY --from=frontend-builder /app/checkllm_frontend/tsconfig.json ./tsconfig.json
COPY --from=frontend-builder /app/checkllm_frontend/node_modules ./node_modules

COPY --from=engine-builder /out/checkllm /app/bin/checkllm
COPY checkllm_engine/docs/baselines /app/engine-docs/baselines

RUN chmod +x /app/bin/checkllm ./scripts/entrypoint.sh ./scripts/mount-s3.sh

VOLUME ["/data/checkllm"]

EXPOSE 3000

ENTRYPOINT ["./scripts/entrypoint.sh"]
