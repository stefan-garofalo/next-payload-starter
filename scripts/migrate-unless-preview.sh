#!/bin/sh
# Vercel Preview builds share the production database (Neon), so only
# Production and local builds apply migrations. A Preview of a branch whose
# schema is not migrated yet fails its build instead of changing production
# (maintenance/2026-10-28-preview-migrated-production-db).
set -e
if [ "$VERCEL_ENV" = "preview" ]; then
  echo "Preview build: skipping payload migrate (shared production database)"
  exit 0
fi
exec payload migrate
