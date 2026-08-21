#!/usr/bin/env bash
# Package the Synchrony hackathon submission as a single named ZIP.
# All submitted files are named using ONLY the roll number (SE23UCSE065).
# Usage: bash build-submission.sh
set -euo pipefail

ROLL="SE23UCSE065"
ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="$ROOT/submission"
SRC="$OUT/$ROLL"
ZIP="$OUT/$ROLL.zip"

echo "==> Building submission bundle for $ROLL"

# 1) Refresh the README into the named folder (the rest of the written
#    companion docs are maintained directly in submission/$ROLL/).
mkdir -p "$SRC"
cp "$ROOT/README.md" "$SRC/$ROLL-readme.md"

# 2) Place the recorded demo video here if present (name it exactly):
#    submission/SE23UCSE065/SE23UCSE065-demo.mp4
if [ -f "$SRC/$ROLL-demo.mp4" ]; then
  echo "    found demo video: $ROLL-demo.mp4"
else
  echo "    NOTE: add your recording as $SRC/$ROLL-demo.mp4 before zipping"
fi

# 3) Build the repo snapshot (exclude build/node_modules/.git/.env)
echo "==> Creating repo snapshot (excluding build artifacts)"
TMP="$(mktemp -d)"
SNAP="$TMP/$ROLL-code"
mkdir -p "$SNAP"
rsync -a --exclude='.git' --exclude='node_modules' --exclude='build' \
      --exclude='target' --exclude='.env' --exclude='*.class' \
      "$ROOT/" "$SNAP/"

# 4) Zip: the demo video + sources + code snapshot
echo "==> Writing $ZIP"
rm -f "$ZIP"
zip -r -q "$ZIP" -C "$SRC" .
cd "$TMP" && zip -r -q "$ZIP" "$ROLL-code"
cd "$ROOT"

echo "==> Done: $ZIP"
echo "    Submit this single ZIP to Technologyinterns@syf.com before 12:00 PM IST."
echo "    Reminder: also email the PDF (export $ROLL.pdf-source.md -> $ROLL.pdf)."
