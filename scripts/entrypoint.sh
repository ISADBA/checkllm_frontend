#!/usr/bin/env sh
set -eu

APP_ROOT="/app/checkllm_frontend"
DATA_ROOT="${CHECKLLM_DATA_ROOT:-/data/checkllm}"

export CHECKLLM_DATA_ROOT="${DATA_ROOT}"
export CHECKLLM_ENGINE_BIN="${CHECKLLM_ENGINE_BIN:-/app/bin/checkllm}"
export CHECKLLM_BASELINES_DIR="${CHECKLLM_BASELINES_DIR:-/app/engine-docs/baselines}"
export PORT="${PORT:-3000}"

if [ "${S3_MOUNT_ENABLED:-false}" = "true" ]; then
  /app/checkllm_frontend/scripts/mount-s3.sh
fi

mkdir -p \
  "${CHECKLLM_DATA_ROOT}/jobs/queued" \
  "${CHECKLLM_DATA_ROOT}/jobs/running" \
  "${CHECKLLM_DATA_ROOT}/jobs/done" \
  "${CHECKLLM_DATA_ROOT}/jobs/failed" \
  "${CHECKLLM_DATA_ROOT}/results/public" \
  "${CHECKLLM_DATA_ROOT}/results/private" \
  "${CHECKLLM_DATA_ROOT}/tmp"

cd "${APP_ROOT}"

node_modules/.bin/tsx worker/run-worker.ts &
WORKER_PID=$!

cleanup() {
  kill "${WORKER_PID}" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

exec node_modules/.bin/next start -p "${PORT}"
