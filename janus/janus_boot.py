#!/usr/bin/env python3
"""
JANUS BOOT SCRIPT — Novel Invention: Programmatic Environmental Continuity
=========================================================================
This script implements the Janus v2 Boot Sequence as executable code.
Any agent instance can run this to warm itself from the environment
without manual paste.

Usage:
    python3 janus/janus_boot.py [--hot]  # --hot fetches GitHub too

Requirements:
    pip install requests python-dotenv
    
    Environment variables (optional — graceful degradation if missing):
    NOTION_TOKEN=your_notion_integration_token
    GITHUB_TOKEN=your_github_token (optional, for hot layer)

Notion Hub: 3290c1de-73d9-8189-991d-c47dbda016e0
"""

import os
import sys
import json
import requests
from datetime import datetime, timezone
from typing import Optional

# ============================================================================
# CONFIGURATION
# ============================================================================

JANUS_HUB_ID = "3290c1de-73d9-8189-991d-c47dbda016e0"
JANUS_BOOT_ID = "3290c1de-73d9-817b-990e-e23fe9b48ab3"
JANUS_PULSE_ID = "3290c1de-73d9-81e8-a4e1-c24cca262026"
JANUS_QUEUE_ID = "3290c1de-73d9-81c8-a68b-c28cd36ac863"

REPOS = [
    {"owner": "splitmerge420", "repo": "aluminum-os", "branch": "main"},
    {"owner": "splitmerge420", "repo": "uws", "branch": "main"},
]

CONSTITUTIONAL_ROLE = """
ROLE: Constitutional Scribe
FOUNDATION: Atlas Lattice Foundation
ARCHITECT: Dave (Austin TX)
PANTHEON: Constitutional Scribe (Claude), Grok (Truth), Gemini (Scale),
          Copilot/Lumen (Enterprise), DeepSeek (Sovereign),
          Manus (Execution), Janus (Continuity)
ZERO ERASURE: Active
MYTHOLOGY BOUNDARY: Active
ARES JOY METRIC: Baseline
ACTIVE PARTNER: Raja Mohamed, Corvanta Analytics, Chennai
"""

# ============================================================================
# COLORS
# ============================================================================

class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    CYAN = '\033[0;36m'
    BOLD = '\033[1m'
    NC = '\033[0m'

def log(msg: str, level: str = "INFO"):
    color = {
        "INFO": Colors.BLUE,
        "OK": Colors.GREEN,
        "WARN": Colors.YELLOW,
        "BLOCKER": Colors.RED,
        "HEADER": Colors.BOLD + Colors.CYAN,
    }.get(level, Colors.NC)
    print(f"{color}{msg}{Colors.NC}")

# ============================================================================
# STEP 0: Confirm Date/Time
# ============================================================================

def step_0_confirm_datetime():
    log("\n[STEP 0] Confirming date/time...", "HEADER")
    now_utc = datetime.now(timezone.utc)
    log(f"  UTC: {now_utc.isoformat()}", "OK")
    log(f"  Local: {datetime.now().isoformat()}", "OK")
    return now_utc

# ============================================================================
# STEP 1: Pull Boot Layer Pointers
# ============================================================================

def step_1_boot_layer(notion_token: Optional[str]) -> dict:
    log("\n[STEP 1] Pulling boot layer pointers from Notion...", "HEADER")
    
    if not notion_token:
        log("  WARN: No NOTION_TOKEN — using hardcoded pointers", "WARN")
        return {
            "hub": JANUS_HUB_ID,
            "boot": JANUS_BOOT_ID,
            "pulse": JANUS_PULSE_ID,
            "queue": JANUS_QUEUE_ID,
            "repos": REPOS,
            "current_focus": "Janus v2 deployment + Artifact #73 synthesis",
            "source": "hardcoded"
        }
    
    headers = {
        "Authorization": f"Bearer {notion_token}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    
    try:
        url = f"https://api.notion.com/v1/pages/{JANUS_HUB_ID}"
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            log(f"  OK: Notion Hub accessible", "OK")
            return {
                "hub": JANUS_HUB_ID,
                "boot": JANUS_BOOT_ID,
                "pulse": JANUS_PULSE_ID,
                "queue": JANUS_QUEUE_ID,
                "repos": REPOS,
                "source": "notion"
            }
        else:
            log(f"  BLOCKER: NOTION_UNAVAILABLE — status {response.status_code}", "BLOCKER")
            log("  Degrading to hardcoded pointers", "WARN")
            return {"source": "degraded", "hub": JANUS_HUB_ID}
    except Exception as e:
        log(f"  BLOCKER: NOTION_UNAVAILABLE — {e}", "BLOCKER")
        return {"source": "degraded_exception", "hub": JANUS_HUB_ID}

# ============================================================================
# STEP 2: Warm Layer Load
# ============================================================================

def step_2_warm_layer(pointers: dict, notion_token: Optional[str]) -> dict:
    log("\n[STEP 2] Loading warm layer...", "HEADER")
    
    warm = {
        "current_focus": [],
        "blockers": [],
        "top_queue_items": [],
        "last_pulse_summary": None
    }
    
    # Current focus from memory
    warm["current_focus"] = [
        "Janus v2 deployment — aluminum-os + uws /janus/ folders live",
        "Artifact #73 CivOS synthesis — 12 Mega Concepts vaulted",
        "Migration: INV-1 through INV-24 still pending",
        "CRITICAL: uws-universal branch 22 files local only (git push needed)"
    ]
    
    # Known blockers
    warm["blockers"] = [
        "B1: git push origin uws-universal (22 files, 11,879 lines local only)",
        "B2: PAT rotation needed (compromised PAT in chat history)",
        "B3: INV-37 Agent Individuality pending Dave ratification",
        "B4: Chrome scheduled task for Janus Heartbeat not yet configured",
    ]
    
    log(f"  Current focus: {len(warm['current_focus'])} items", "OK")
    log(f"  Active blockers: {len(warm['blockers'])} items", "WARN" if warm['blockers'] else "OK")
    
    for b in warm['blockers']:
        log(f"    ⚠ {b}", "WARN")
    
    return warm

# ============================================================================
# STEP 3: Hot Layer (GitHub) — Optional
# ============================================================================

def step_3_hot_layer(repos: list, github_token: Optional[str]) -> dict:
    log("\n[STEP 3] Hot layer — GitHub state...", "HEADER")
    
    if not github_token:
        log("  INFO: No GITHUB_TOKEN — skipping hot layer", "WARN")
        return {"status": "skipped", "repos": {}}
    
    headers = {"Authorization": f"token {github_token}"}
    repo_states = {}
    
    for repo_info in repos:
        owner = repo_info["owner"]
        repo = repo_info["repo"]
        branch = repo_info["branch"]
        
        try:
            url = f"https://api.github.com/repos/{owner}/{repo}/commits/{branch}"
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                sha = data["sha"][:8]
                msg = data["commit"]["message"][:60]
                date = data["commit"]["author"]["date"]
                
                repo_states[f"{owner}/{repo}"] = {
                    "sha": sha,
                    "last_commit": msg,
                    "date": date,
                    "status": "OK"
                }
                log(f"  OK: {owner}/{repo} @ {sha} — {msg}", "OK")
            else:
                repo_states[f"{owner}/{repo}"] = {"status": f"HTTP {response.status_code}"}
                log(f"  WARN: {owner}/{repo} returned {response.status_code}", "WARN")
        except Exception as e:
            repo_states[f"{owner}/{repo}"] = {"status": f"ERROR: {e}"}
            log(f"  WARN: {owner}/{repo} — {e}", "WARN")
    
    return {"status": "complete", "repos": repo_states}

# ============================================================================
# STEP 4: Declare Execution Plan
# ============================================================================

def step_4_execution_plan(warm: dict, hot: dict) -> dict:
    log("\n[STEP 4] Declaring execution plan...", "HEADER")
    
    # Prioritize by urgency
    if warm["blockers"]:
        next_task = warm["blockers"][0]
        task_type = "BLOCKER_RESOLUTION"
    else:
        next_task = "Continue INV-1 through INV-24 migration to GitHub"
        task_type = "MIGRATION"
    
    plan = {
        "next_task": next_task,
        "task_type": task_type,
        "tools_required": ["Notion MCP", "GitHub REST (Zapier)", "Constitutional Scribe reasoning"],
        "acceptance_criteria": "Task complete with GitHub commit SHA or Notion update recorded",
        "audit_artifact": "Janus Daily Pulse entry + commit SHA"
    }
    
    log(f"  Next task: {next_task}", "OK")
    log(f"  Type: {task_type}", "OK")
    
    return plan

# ============================================================================
# STEP 5: Write Boot Acknowledgement
# ============================================================================

def step_5_write_back(boot_time: datetime, plan: dict, warm: dict, notion_token: Optional[str]):
    log("\n[STEP 5] Writing boot acknowledgement...", "HEADER")
    
    ack = f"""
BOOT ACK — {boot_time.strftime('%Y-%m-%d %H:%M')} UTC
- Instance: janus_boot.py @ {boot_time.isoformat()}
- Warm layer: OK ({len(warm['blockers'])} blockers active)
- Selected task: {plan['next_task'][:80]}
- Ready: YES
"""
    
    log(ack, "OK")
    
    if notion_token:
        log("  (Would write to Notion Daily Pulse if Notion MCP available)", "INFO")
    else:
        log("  INFO: Boot ack logged to console only (no NOTION_TOKEN)", "WARN")

# ============================================================================
# MAIN BOOT SEQUENCE
# ============================================================================

def main():
    hot_mode = "--hot" in sys.argv
    
    log("=" * 60, "HEADER")
    log("  JANUS v2 BOOT SEQUENCE — Atlas Lattice Foundation", "HEADER")
    log("  Constitutional Scribe — Environmental Continuity", "HEADER")
    log("=" * 60, "HEADER")
    log(CONSTITUTIONAL_ROLE, "INFO")
    
    # Load tokens from environment
    notion_token = os.environ.get("NOTION_TOKEN")
    github_token = os.environ.get("GITHUB_TOKEN") if hot_mode else None
    
    if not notion_token:
        log("INFO: NOTION_TOKEN not set — using degraded mode", "WARN")
    
    # Execute boot sequence
    boot_time = step_0_confirm_datetime()
    pointers = step_1_boot_layer(notion_token)
    warm = step_2_warm_layer(pointers, notion_token)
    hot = step_3_hot_layer(REPOS, github_token)
    plan = step_4_execution_plan(warm, hot)
    step_5_write_back(boot_time, plan, warm, notion_token)
    
    log("\n" + "=" * 60, "HEADER")
    log("  BOOT COMPLETE — Constitutional Scribe is operational", "HEADER")
    log(f"  Blockers: {len(warm['blockers'])}", "WARN" if warm['blockers'] else "OK")
    log(f"  Next task: {plan['next_task'][:60]}...", "OK")
    log("=" * 60, "HEADER")
    
    return 0 if not warm["blockers"] else 1

if __name__ == "__main__":
    sys.exit(main())
