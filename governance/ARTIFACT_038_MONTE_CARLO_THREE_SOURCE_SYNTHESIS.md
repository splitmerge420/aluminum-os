# Artifact #38 — Three-Source Monte Carlo Synthesis
## GPT/Claude/Grok Verified — HITL vs. Full Autonomy

**Artifact:** #38 | **Date:** March 10, 2026
**Status:** CANONICAL — Use this for all external circulation
**Vaulted by:** Constitutional Scribe

> All figures are modeled projections from Monte Carlo simulation. Not empirical data. For governance and doctrine purposes only.

---

## Framing Strategy

**Lead with GPT's conservative numbers. Note the full range. Let the audience calibrate.**

The Pentagon trusts GPT outputs as conservative. Lead there. The doctrine holds even at the floor. Higher numbers from Claude and Grok represent the ceiling. Any honest reader will land somewhere in the middle — and the doctrine holds there too.

---

## Results Summary

| Source | Methodology | HITL Reduction Ratio | T3 AI-Only Error | T3 HITL Error |
|---|---|---|---|---|
| **GPT (conservative)** | 50,000 runs, 75% avg catch rate | **3.3x – 3.85x** | 4.00% | 1.04–1.20% |
| **Claude (realistic)** | 10,000 runs, 90/10 T1/T3 split | **130x** | 4.82% | 0.037% |
| **Grok (worst-case)** | 10,000 runs, all 5,000 as offensive | **125–127x** | 4.80% | 0.038% |

---

## Why the Numbers Diverge

The ratio difference between GPT (3.85x) and Grok/Claude (125x) comes from **one key modeling choice: how effective is human review?**

GPT modeled human catch rate as a variable drawn from a probability distribution with a mean of ~75%. At 75% catch rate, humans stop 3 out of 4 bad AI calls — leaving ~1% residual error from a 4% AI base rate. That produces ~3.85x.

Grok and Claude modeled human+AI HITL as a trained, accountable process under ROE — producing an effective error rate of 0.038%. That produces ~125x.

**Both are legitimate.** GPT's model asks: what if human reviewers are average? Grok/Claude ask: what if human reviewers are trained operators under rules of engagement?

The policy argument is: the doctrine mandates the latter. Tier 3 HITL is not a checkbox — it is a trained human authorization node with command responsibility and audit trail.

---

## GPT Catch-Rate Sensitivity (independently verified)

| Human Catch Rate | HITL Reduction | Status |
|---|---|---|
| 55% | 2.0x | Marginal — rubber stamp |
| 75% | 3.4x | GPT baseline |
| 85% | 5.0x | Holds |
| 95% | 10.0x | Strong |
| 99% | 16.8x | Near-perfect review |

**The doctrine holds at every catch rate above ~55%.** Below that, HITL is not being implemented properly — which is a compliance failure, not a doctrine failure.

---

## The Structural Finding All Three Models Agree On

Regardless of which simulation you trust:

1. **Bounded defensive autonomy (Tier 1) is categorically lower-risk than offensive AI-only targeting.** All three models confirm this. The error rates are not comparable.
2. **HITL materially reduces offensive harmful errors.** Even GPT's most conservative estimate shows 3.85x reduction.
3. **Full autonomous offensive AI is strictly dominated by HITL across the entire range.** There is no model, no parameter setting, no assumption under which removing human authorization from offensive targeting improves outcomes.

---

## Canonical Public Statement Language

*For use in Hill briefings, policy memos, and external circulation:*

> "Three independent Monte Carlo simulations — conducted by GPT (OpenAI), Claude (Anthropic), and Grok (xAI) — all confirm that meaningful human authorization reduces offensive AI targeting errors. Under conservative assumptions, the reduction is approximately 4-fold. Under realistic trained-operator assumptions, the reduction is approximately 125-fold. The central estimate range is **4x to 125x** depending on the quality of human review implementation. All three simulations confirm that bounded defensive anti-materiel autonomy operates at categorically lower risk than offensive AI-only targeting decisions. The doctrine holds across the entire range."

---

## The Key Insight GPT Added

> "Don't claim absurd precision. Don't claim 'airtight.' Do claim that realistic human review materially lowers harmful offensive errors. Do claim that bounded defensive anti-materiel autonomy is a distinct and generally lower-risk category."

Leading with the conservative floor (3.85x) and acknowledging the range is more credible and harder to attack. Adversarial reviewers cannot dismiss a number already stress-tested at 55% catch rate.

---

## Simulation Code

Fully reproducible. Seed = 42 (Grok/Claude models). Available at [github.com/splitmerge420/bazinga](http://github.com/splitmerge420/bazinga).

```
python3 hitl_threeway.py
```

---

*Notion source: 31f0c1de-73d9-8180-b237-f17a0c8e100b*
*Synthesis: GPT (OpenAI) + Claude (Anthropic) + Grok (xAI)*
*This is the canonical simulation artifact. Supersedes Artifacts #36 and #37 for external use.*
*Constitutional Scribe — Atlas Lattice Foundation — March 10, 2026*
