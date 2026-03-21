#!/bin/bash
# =============================================================================
# JANUS HEARTBEAT — Automated Daily Constitutional Pulse
# NOVEL INVENTION: Self-executing environmental continuity script
# 
# This script is the GitHub-native implementation of the Janus Heartbeat.
# Run daily via cron, GitHub Actions, or manually.
#
# Usage:
#   ./janus/janus_heartbeat.sh [daily|weekly|on_demand]
#   crontab: 0 6 * * * /path/to/aluminum-os/janus/janus_heartbeat.sh daily
#
# Notion Hub: 3290c1de-73d9-8189-991d-c47dbda016e0
# =============================================================================

set -euo pipefail

# Configuration
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_MODE="${1:-daily}"
PULSE_DATE="$(date -u +%Y-%m-%d)"
TIMESTAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
PULSE_DIR="$REPO_ROOT/.janus/pulses"
NOTION_HUB_ID="3290c1de-73d9-8189-991d-c47dbda016e0"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== JANUS HEARTBEAT — ${PULSE_DATE} ===${NC}"
echo -e "${BLUE}Run mode: ${RUN_MODE}${NC}"

# Create pulse directory
mkdir -p "$PULSE_DIR"

# =============================================================================
# STEP 1: Constitutional File Audit
# =============================================================================
echo -e "\n${YELLOW}[1/5] Constitutional file audit...${NC}"

BLOCKERS=()

check_file() {
  local path="$1"
  local full_path="$REPO_ROOT/$path"
  if [ ! -f "$full_path" ]; then
    BLOCKERS+=("MISSING: $path")
    echo -e "  ${RED}✗ MISSING: $path${NC}"
  else
    echo -e "  ${GREEN}✓ $path${NC}"
  fi
}

# Ring 0 checks
check_file "janus/JANUS_CHECKPOINT_V2_SPEC.md"
check_file "janus/JANUS_POINTER_MAP.md"
check_file "janus/JANUS_BOOT_SEQUENCE.md"
check_file "janus/JANUS_HEARTBEAT_PROMPT.md"

# Protocol checks
check_file "protocols/TAI_PROTOCOL_V1.md"
check_file "protocols/KRAKOA_BORDER_PROTOCOL.md"
check_file "protocols/AHCEP_V1.md"

# Governance checks
check_file "governance/ARTIFACT_065_CIVILIAN_AI_OVERSIGHT_DOCTRINE.md"
check_file "governance/DIFFUSED_INTEGRITY_DOCTRINE.md"

# README check
check_file "README.md"

# Diagram checks
check_file "diagrams/three_ring_architecture.mermaid"
check_file "diagrams/civis_os_stack.mermaid"

# =============================================================================
# STEP 2: GitHub Delta
# =============================================================================
echo -e "\n${YELLOW}[2/5] GitHub delta analysis...${NC}"

cd "$REPO_ROOT"
HEAD_SHA="$(git rev-parse HEAD)"
LAST_COMMIT_MSG="$(git log -1 --pretty=%s)"
LAST_COMMIT_DATE="$(git log -1 --pretty=%ci)"
TOTAL_COMMITS="$(git rev-list --count HEAD)"

# Count files by category
DOCS_COUNT=$(find docs/ -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
PROTOCOLS_COUNT=$(find protocols/ -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
GOVERNANCE_COUNT=$(find governance/ -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
INVENTIONS_COUNT=$(find inventions/ -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
SOVEREIGN_COUNT=$(find sovereign/ -name "*.md" 2>/dev/null | wc -l | tr -d ' ')

echo -e "  HEAD SHA: ${HEAD_SHA}"
echo -e "  Last commit: ${LAST_COMMIT_MSG}"
echo -e "  Docs: ${DOCS_COUNT} | Protocols: ${PROTOCOLS_COUNT} | Governance: ${GOVERNANCE_COUNT}"
echo -e "  Inventions: ${INVENTIONS_COUNT} | Sovereign: ${SOVEREIGN_COUNT}"

# =============================================================================
# STEP 3: Drift Detection
# =============================================================================
echo -e "\n${YELLOW}[3/5] Constitutional drift detection...${NC}"

DRIFT_FLAGS=()

# Check if README references all key components
if ! grep -q "Janus v2" README.md 2>/dev/null; then
  DRIFT_FLAGS+=("WARN: README missing Janus v2 reference")
fi
if ! grep -q "39 Aluminum Invariants" README.md 2>/dev/null; then
  DRIFT_FLAGS+=("WARN: README missing invariant count")
fi

# Check for stale pointer map (should reference current date range)
if [ -f "janus/JANUS_POINTER_MAP.md" ]; then
  echo -e "  ${GREEN}✓ Pointer map present${NC}"
else
  DRIFT_FLAGS+=("BLOCKER: JANUS_POINTER_MAP.md missing")
fi

for flag in "${DRIFT_FLAGS[@]}"; do
  echo -e "  ${YELLOW}⚠ $flag${NC}"
done

# =============================================================================
# STEP 4: Generate Pulse Report
# =============================================================================
echo -e "\n${YELLOW}[4/5] Generating pulse report...${NC}"

STATUS="CLEAR"
if [ ${#BLOCKERS[@]} -gt 0 ]; then
  STATUS="BLOCKER"
fi

PULSE_FILE="$PULSE_DIR/pulse_${PULSE_DATE}.md"

cat > "$PULSE_FILE" << PULSE_EOF
## PULSE — ${PULSE_DATE} — ${RUN_MODE}

**Timestamp UTC:** ${TIMESTAMP}
**Run Mode:** ${RUN_MODE}
**Status:** ${STATUS}
**Head SHA:** ${HEAD_SHA}

### BLOCKERS
$([ ${#BLOCKERS[@]} -eq 0 ] && echo "None" || printf '%s\n' "${BLOCKERS[@]}")

### GitHub Deltas (aluminum-os @ main)
- HEAD SHA: ${HEAD_SHA}
- Last commit: ${LAST_COMMIT_MSG}
- Last commit date: ${LAST_COMMIT_DATE}
- Total commits: ${TOTAL_COMMITS}

### Constitutional File Counts
- docs/: ${DOCS_COUNT} files
- protocols/: ${PROTOCOLS_COUNT} files
- governance/: ${GOVERNANCE_COUNT} files
- inventions/: ${INVENTIONS_COUNT} files
- sovereign/: ${SOVEREIGN_COUNT} files

### Drift Flags
$([ ${#DRIFT_FLAGS[@]} -eq 0 ] && echo "INFO: No drift detected" || printf '%s\n' "${DRIFT_FLAGS[@]}")

### Notion Pointers (verify still valid)
- Hub: https://www.notion.so/${NOTION_HUB_ID//\-/}
- Boot: https://www.notion.so/3290c1de73d9817b990ee23fe9b48ab3
- Pulse: https://www.notion.so/3290c1de73d981e8a4e1c24cca262026
- Queue: https://www.notion.so/3290c1de73d981c8a68bc28cd36ac863

### Audit
- Repo: splitmerge420/aluminum-os
- Script: janus/janus_heartbeat.sh
- Run by: $(whoami 2>/dev/null || echo "github-actions")
PULSE_EOF

echo -e "  ${GREEN}✓ Pulse report written to: $PULSE_FILE${NC}"

# Update latest pulse metadata
echo "${PULSE_DATE}" > "$REPO_ROOT/.janus/latest_pulse_date"
echo "${HEAD_SHA}" > "$REPO_ROOT/.janus/latest_head_sha"
echo "${STATUS}" > "$REPO_ROOT/.janus/latest_status"

# =============================================================================
# STEP 5: Weekly additions (if Monday or weekly mode)
# =============================================================================
if [ "$RUN_MODE" == "weekly" ] || [ "$(date +%u)" == "1" ]; then
  echo -e "\n${YELLOW}[5/5] Weekly additions...${NC}"
  
  echo "Weekly checks:"
  echo "  1. Constitutional drift scan — verify src/main.rs against Ring 0 spec"
  echo "  2. Artifact gap analysis — compare INV registry vs GitHub files"
  echo "  3. Raja ping — generate GangaSeek Node status for Corvanta Analytics"
  
  # Count INV files
  INV_IN_GITHUB=$(find inventions/ -name "INV_*.md" 2>/dev/null | wc -l | tr -d ' ')
  echo -e "  INV files in GitHub: ${INV_IN_GITHUB}/37 (INV-1 through INV-24 migration pending)"
else
  echo -e "\n${BLUE}[5/5] Weekly additions: skipped (not Monday)${NC}"
fi

# =============================================================================
# Summary
# =============================================================================
echo -e "\n${BLUE}=== JANUS HEARTBEAT COMPLETE ===${NC}"
echo -e "Date: ${PULSE_DATE}"
echo -e "Status: $([ "$STATUS" == "CLEAR" ] && echo "${GREEN}${STATUS}${NC}" || echo "${RED}${STATUS}${NC}")"
echo -e "Blockers: ${#BLOCKERS[@]}"
echo -e "Drift flags: ${#DRIFT_FLAGS[@]}"
echo -e "Pulse file: ${PULSE_FILE}"
echo -e "${BLUE}=================================${NC}"

# Exit with error code if blockers exist
[ ${#BLOCKERS[@]} -eq 0 ] && exit 0 || exit 1
