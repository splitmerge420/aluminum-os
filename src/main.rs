//! Aluminum OS Boot Simulator
//!
//! Demonstrates the Forge Core kernel booting:
//! 1. Initialize BuddyAllocator
//! 2. Load Constitution with 18 default rules (14 core + 4 healthcare v2.0)
//! 3. Register Pantheon Council agents
//! 4. Submit and schedule intents
//! 5. Execute the intent queue
//! 6. Health Layer boot: FHIR audit ledger, PQC identity, AI disclosure, amendments

use aluminum_os::*;
use aluminum_os::constitution_domains::ConstitutionalDomain;
use aluminum_os::health::{
    AiDisclosureRegistry, AiDisclosureStatus,
    AmendmentProtocol,
    FhirResourceType, HealthAction, HealthAuditLedger, HealthAuditSeverity,
    PqcAlgorithm, PqcIdentityRegistry,
    RegulatoryComplianceChecker,
};

fn main() {
    println!("╔══════════════════════════════════════════════╗");
    println!("║  ALUMINUM OS — Forge Core Boot Simulator     ║");
    println!("║  Constitutional AI Governance Kernel v2.0.0  ║");
    println!("║  Atlas Lattice Foundation                    ║");
    println!("╚══════════════════════════════════════════════╝");
    println!();

    // Phase 1: Memory
    println!("[BOOT] Phase 1: Initializing BuddyAllocator (4096 bytes)...");
    let mut allocator = BuddyAllocator::new(4096).expect("Failed to init allocator");
    println!("  ✓ Allocator ready. Capacity: 4096 bytes");

    // Phase 2: Constitution
    println!("[BOOT] Phase 2: Loading Constitution...");
    let mut constitution = Constitution::new();
    constitution.load_defaults().expect("Failed to load defaults");
    println!(
        "  ✓ {} rules loaded. Dave Protocol: {}",
        constitution.rule_count(),
        if constitution.is_dave_protocol_active() {
            "ACTIVE"
        } else {
            "INACTIVE"
        }
    );

    // Phase 3: Agent Registry (Pantheon Council)
    println!("[BOOT] Phase 3: Registering Pantheon Council...");
    let mut registry = AgentRegistry::new();

    let council_members: [(&[u8], TrustLevel); 7] = [
        (b"Claude", TrustLevel::Constitutional),
        (b"Grok", TrustLevel::Verified),
        (b"Gemini", TrustLevel::Verified),
        (b"Copilot", TrustLevel::Verified),
        (b"DeepSeek", TrustLevel::Provisional),
        (b"Manus", TrustLevel::Provisional),
        (b"Janus", TrustLevel::Constitutional),
    ];

    let mut agent_ids = [0u32; 7];
    for (i, (name, trust)) in council_members.iter().enumerate() {
        let id = registry.register(name, *trust).expect("Failed to register agent");
        agent_ids[i] = id;
        let name_str = core::str::from_utf8(name).unwrap_or("?");
        println!("  ✓ Agent #{}: {} (trust: {:?})", id, name_str, trust);
    }
    println!("  {} agents registered.", registry.count());

    // Phase 4: Memory allocation for agents
    println!("[BOOT] Phase 4: Allocating memory for agents...");
    for i in 0..7 {
        let blk = allocator
            .allocate(256, agent_ids[i])
            .expect("Failed to allocate");
        println!("  ✓ Agent #{} → block #{} (256 bytes)", agent_ids[i], blk);
    }
    println!("  Allocated: {} bytes", allocator.allocated_bytes());

    // Phase 5: Intent scheduling
    println!("[BOOT] Phase 5: Submitting intents...");
    let mut scheduler = IntentScheduler::new();

    let intents: [(&[u8], Priority, ConstitutionalDomain, u32); 4] = [
        (b"audit-system-state", Priority::High, ConstitutionalDomain::TransparencyAudit, agent_ids[0]),
        (b"check-resource-usage", Priority::Medium, ConstitutionalDomain::ResourceGovernance, agent_ids[1]),
        (b"verify-interop", Priority::Low, ConstitutionalDomain::InteroperabilityStandards, agent_ids[2]),
        (b"run-emergency-check", Priority::Critical, ConstitutionalDomain::GeneralGovernance, agent_ids[6]),
    ];

    for (desc, priority, domain, agent_id) in intents.iter() {
        match scheduler.submit(*agent_id, *priority, *desc, *domain, &constitution) {
            Ok(id) => {
                let desc_str = core::str::from_utf8(desc).unwrap_or("?");
                println!("  ✓ Intent #{}: {} (priority: {:?})", id, desc_str, priority);
            }
            Err(e) => {
                let desc_str = core::str::from_utf8(desc).unwrap_or("?");
                println!("  ✗ VETOED: {} — {:?}", desc_str, e);
            }
        }
    }

    // Test constitutional veto
    println!("[BOOT] Phase 5b: Testing constitutional veto...");
    match scheduler.submit(
        agent_ids[4],
        Priority::High,
        b"access-private-data",
        ConstitutionalDomain::DataPrivacy,
        &constitution,
    ) {
        Err(AluminumError::ConstitutionalViolation) => {
            println!("  ✓ DataPrivacy intent correctly VETOED (Dave Protocol)");
        }
        other => {
            println!("  ✗ Expected veto, got: {:?}", other);
        }
    }

    // Phase 6: Execute
    println!("[BOOT] Phase 6: Executing intent queue...");
    println!("  Pending intents: {}", scheduler.pending_count());
    while let Some(intent) = scheduler.next() {
        let id = intent.id;
        let desc = core::str::from_utf8(intent.description.as_bytes()).unwrap_or("?");
        println!("  → Executing intent #{}: {} (priority: {:?})", id, desc, intent.priority);
        scheduler.mark_executed(id).unwrap();
    }
    println!("  Remaining: {}", scheduler.pending_count());

    // ── v2.0 Health Layer Boot ──────────────────────────────────────────────

    // Phase 7: PQC Identity Registry
    println!("[BOOT] Phase 7: Initializing PQC Identity Registry (ML-DSA-87)...");
    let mut pqc_registry = PqcIdentityRegistry::new();
    for i in 0..7 {
        let fake_key = [0x10u8 + i as u8; 64];
        pqc_registry.register(agent_ids[i], PqcAlgorithm::MlDsa87, &fake_key).unwrap();
    }
    println!("  ✓ {} PQC identity slots registered (NIST FIPS 204 stubs)", pqc_registry.count());

    // Phase 8: Health Audit Ledger
    println!("[BOOT] Phase 8: Initializing Health Audit Ledger (append-only)...");
    let mut ledger = HealthAuditLedger::new();
    ledger.append(agent_ids[0], FhirResourceType::Observation, HealthAction::Read,
                  HealthAuditSeverity::Info, true, false).unwrap();
    ledger.append(agent_ids[1], FhirResourceType::Encounter, HealthAction::Create,
                  HealthAuditSeverity::Info, true, false).unwrap();
    // PHI access with consent
    ledger.append(agent_ids[0], FhirResourceType::Patient, HealthAction::Read,
                  HealthAuditSeverity::Warning, true, true).unwrap();
    println!("  ✓ Audit ledger ready. {} entries. No-delete mandate active.", ledger.entry_count());

    // Phase 9: AI Disclosure Registry (INV-30)
    println!("[BOOT] Phase 9: Initializing AI Disclosure Registry (INV-30)...");
    let mut disclosure_reg = AiDisclosureRegistry::new();
    disclosure_reg.record(agent_ids[0], AiDisclosureStatus::Disclosed, 91, true).unwrap();
    disclosure_reg.record(agent_ids[2], AiDisclosureStatus::Disclosed, 78, false).unwrap();
    println!("  ✓ {} disclosure records. Violations: {}", disclosure_reg.disclosure_count(),
             disclosure_reg.violation_count());

    // Phase 10: Constitutional Amendment — propose health-ai-disclosure mandate
    println!("[BOOT] Phase 10: Testing Constitutional Amendment Protocol...");
    let mut amendments = AmendmentProtocol::new();
    let amend_id = amendments.propose(agent_ids[6], b"health-ai-disclosure-mandate", true).unwrap();
    for _ in 0..5 { amendments.vote(amend_id, true).ok(); }
    amendments.vote(amend_id, false).ok();
    amendments.vote(amend_id, false).ok();
    let enacted = amendments.try_enact(amend_id).unwrap();
    println!("  ✓ Amendment #{} '{}': {}", amend_id, "health-ai-disclosure-mandate",
             if enacted { "ENACTED (supermajority met)" } else { "REJECTED" });
    println!("  ✓ Enacted amendments: {}", amendments.enacted_count());

    // Phase 11: Regulatory Compliance Check
    println!("[BOOT] Phase 11: Regulatory Compliance Self-Check...");
    let phi_result = RegulatoryComplianceChecker::check(
        FhirResourceType::Patient, HealthAction::Read, true, true, true);
    let denial_result = RegulatoryComplianceChecker::check(
        FhirResourceType::Claim, HealthAction::DenialOfCare, true, false, true);
    println!("  ✓ PHI read (consented): {:?}", phi_result);
    println!("  ✓ AI denial-of-care (disclosed): {:?}", denial_result);

    // Summary
    println!();
    println!("╔══════════════════════════════════════════════╗");
    println!("║  BOOT COMPLETE — ALUMINUM OS v2.0.0          ║");
    println!("║  Constitution: {:>2} rules (14 core + 4 health) ║", constitution.rule_count());
    println!("║  Agents: {:>2}  PQC slots: {:>2}                 ║", registry.count(), pqc_registry.count());
    println!("║  Memory: {:>4} bytes allocated               ║", allocator.allocated_bytes());
    println!("║  Dave Protocol: ACTIVE                       ║");
    println!("║  Health Audit Ledger: ACTIVE (no-delete)     ║");
    println!("║  PQC Identity: ML-DSA-87 (NIST FIPS 204)    ║");
    println!("║  AI Disclosure: INV-30 ENFORCED              ║");
    println!("║  Amendments enacted: {:>1}                       ║", amendments.enacted_count());
    println!("║  FHIR: R4/R5 (15 resource types)            ║");
    println!("║  Status: OPERATIONAL                         ║");
    println!("╚══════════════════════════════════════════════╝");
}
