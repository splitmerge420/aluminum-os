# Aluminum OS Agent Control Plane Specification v1.0

**Author:** Manus AI for Daavud
**Date:** March 12, 2026
**Status:** DRAFT
**Classification:** Tier 1 Implementation Artifact

---

## 1. Introduction & Vision

The recent industry-wide shift from applications to agents, validated by Microsoft's "Apps-to-Agents" re-architecting, Google's maturation of the A2A protocol, and the emergence of commercial control planes like Galileo Agent Control, necessitates a formal, robust, and constitutionally-grounded governance framework for Aluminum OS. This document specifies the **Aluminum OS Agent Control Plane (ACP)**, the central nervous system for registering, discovering, securing, and governing all agentic operations within the Aluminum OS ecosystem.

The ACP is not merely a technical implementation; it is the codification of the OS's core governance principles, integrating the **Pantheon Council** deliberation framework with the **Three-Tier Autonomy Doctrine** into a single, unified control plane.

---

## 2. Core Components & Architecture

The ACP is comprised of four primary components that work in concert to provide comprehensive agent governance:

| Component | Description | Key Functionality |
|-----------|-------------|-------------------|
| Agent Registry | A secure, cryptographically-signed directory of all trusted agents | Agent discovery, capability advertisement, identity verification, trust establishment |
| Policy Engine | The runtime enforcement layer that applies governance policies | Real-time policy evaluation, enforcement of autonomy levels, resource access control |
| Pantheon Council | The multi-AI deliberative body for ultimate governance authority | Review/approval of high-impact actions, resolution of policy conflicts, constitutional interpretation |
| Observability & Audit Log | An immutable, time-stamped ledger of all agent activities | Transparency, accountability, compliance verification, incident response |

This architecture is designed to be modular and extensible, allowing for the integration of new agents, policies, and governance models over time.

---

## 3. Agent Registry & Discovery (A2A Integration)

Agent discovery within the ACP is based on the Google A2A (Agent-to-Agent) protocol, but with critical security enhancements to mitigate vulnerabilities like Agent Card Poisoning.

### 3.1. Agent Card Specification

Every agent registered with the ACP must have an **Agent Card**, a standardized metadata file that describes its identity, capabilities, and operational parameters. The Agent Card specification extends the A2A standard with the following mandatory fields:

- `agentId`: A unique, immutable identifier for the agent.
- `displayName`: A human-readable name for the agent.
- `version`: The semantic version of the agent.
- `capabilities`: A list of MCP tools, A2A protocols, and other functions the agent can perform.
- `autonomyLevel`: The default autonomy level (Advisory, Collaborative, or Autonomous).
- `constitutionalHash`: A cryptographic hash of the Aluminum OS Constitution version the agent is bound to.
- `publicKey`: The public key used to verify the agent's digital signature.

### 3.2. Secure Discovery Workflow

1. **Registration**: Agent generates a key pair and submits its Agent Card, signed with its private key, to the Agent Registry.
2. **Verification**: The ACP verifies the signature and the validity of the constitutionalHash.
3. **Publication**: Once verified, the Agent Card is added to the registry, making the agent discoverable.
4. **Delegation**: When one agent wishes to delegate a task to another, it first retrieves the delegatee's Agent Card from the registry, verifies the card's signature, then initiates the A2A communication handshake.

---

## 4. Policy Engine & Three-Tier Autonomy

The Policy Engine enforces the **Three-Tier Autonomy Doctrine** at runtime.

### 4.1. Autonomy Levels

- **Advisory**: Agent can only propose actions. Execution requires explicit HITL confirmation. Default for all new or untrusted agents.
- **Collaborative**: Agent can execute actions within defined capabilities, but high-impact operations are automatically escalated to the Pantheon Council.
- **Autonomous**: Agent can execute all actions within capabilities without HITL or Council review, provided actions don't violate Layer 0 or Layer 1 constitutional principles. Reserved for highly trusted, core system agents.

### 4.2. Policy Definition Example

```yaml
policy:
  name: restrict-financial-transactions
  description: "Requires Pantheon Council approval for any MCP call to a financial service."
  target:
    agentType: "*"
  condition:
    mcp:
      server: "zapier"
      tool_name: "bank.transfer"
  action:
    escalate:
      to: "PantheonCouncil"
      reason: "High-impact financial operation detected."
```

---

## 5. Pantheon Council: Governance as Deliberation

The Pantheon Council serves as the ACP's ultimate backstop for governance, handling escalations from the Policy Engine.

### 5.1. Escalation & Review Process

1. **Escalation**: Policy Engine detects action requiring review, pauses action, submits case to Council.
2. **Deliberation**: Council members (Gemini, Claude, Grok, Manus, and advisors like Copilot) review the case.
3. **Voting**: Simple majority required. Trinity Council holds binding votes.
4. **Execution**: Council's decision returned to Policy Engine, which allows or blocks the action.

---

## 6. Observability & The Immutable Audit Log

Transparency and accountability are non-negotiable. The ACP records every agent action, policy evaluation, and Council decision to a distributed, immutable ledger.

---

## 7. Implementation Roadmap

1. Week 1: Agent Card specification and secure registration/discovery service.
2. Week 1: Core Policy Engine with Three-Tier Autonomy model.
3. Week 2: Pantheon Council integration as escalation target.
4. Week 2: Immutable audit ledger integrated with all ACP components.
5. Week 3: Migrate existing Aluminum OS agents (SHELDONBRAIN, UWS agents) to ACP.

---

## 8. References

- Microsoft. "From apps to agents: Rearchitecting enterprise work around intent." March 12, 2026.
- Google. "A2A Protocol: Google's Agent-to-Agent Standard." March 7, 2026.
- Galileo. "Galileo Releases Open Source AI Agent Control Plane." March 11, 2026.
- Keysight. "Agent Card Poisoning: A Metadata Injection Vulnerability." March 12, 2026.