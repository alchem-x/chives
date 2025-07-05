#!/usr/bin/env bash
cd "$(dirname "$0")" || exit 1

git pull
pnpm install
rm -rf dist
pnpm run build
docker compose restart
