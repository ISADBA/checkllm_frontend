#!/usr/bin/env sh
set -eu

if [ -z "${S3_BUCKET:-}" ]; then
  echo "S3_MOUNT_ENABLED=true but S3_BUCKET is not set" >&2
  exit 1
fi

if [ -z "${AWS_ACCESS_KEY_ID:-}" ] || [ -z "${AWS_SECRET_ACCESS_KEY:-}" ]; then
  echo "S3 mount requires AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY" >&2
  exit 1
fi

MOUNT_ROOT="${CHECKLLM_DATA_ROOT:-/data/checkllm}"
mkdir -p "${MOUNT_ROOT}"

PASSWD_FILE="/tmp/.passwd-s3fs"
printf "%s:%s" "${AWS_ACCESS_KEY_ID}" "${AWS_SECRET_ACCESS_KEY}" > "${PASSWD_FILE}"
chmod 600 "${PASSWD_FILE}"

S3FS_ARGS="-o allow_other -o passwd_file=${PASSWD_FILE} -o use_path_request_style"

if [ -n "${S3_ENDPOINT:-}" ]; then
  S3FS_ARGS="${S3FS_ARGS} -o url=${S3_ENDPOINT}"
fi

if [ -n "${S3_REGION:-}" ]; then
  S3FS_ARGS="${S3FS_ARGS} -o endpoint=${S3_REGION}"
fi

if mountpoint -q "${MOUNT_ROOT}"; then
  exit 0
fi

s3fs "${S3_BUCKET}" "${MOUNT_ROOT}" ${S3FS_ARGS}
