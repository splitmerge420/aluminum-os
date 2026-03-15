# Layer 5: Unified UI Synthesis

## Phase 1: Read current state
- [ ] Read HealthcareApp to understand existing medical UI
- [ ] Read Desktop.tsx for registration pattern

## Phase 2: Build UnifiedMedicalShell
- [ ] Create UnifiedMedicalApp.tsx — single interface wrapping One Medical, MyChart, Teams
- [ ] Pandora-style flow: unified patient timeline, provider-agnostic
- [ ] Constitutional Abstraction Layer: every data access logged to Audit Ledger
- [ ] Provider cards: Amazon Health (One Medical), Epic (MyChart), Microsoft (Teams)
- [ ] Unified patient view: vitals, appointments, messages, records across all providers
- [ ] Constitutional consent gate on every cross-provider data access

## Phase 3: Register everywhere
- [ ] Desktop.tsx: import + appComponents
- [ ] Boot sequence: add Layer 5 line
- [ ] Window.tsx: icon mapping
- [ ] AppLauncher: add entry
- [ ] ContextMenu: add entry

## Phase 4: Test + checkpoint
