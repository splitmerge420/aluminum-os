//! Constitutional Domains — 15 governance domains extracted from
//! 40 empty AI governance repos in the splitmerge420 GitHub org.
//!
//! Each repo's intent was analyzed, categorized, and collapsed into
//! typed enum variants. This is the repo shred's first concrete output:
//! 40 placeholder repos → 15 domain types → 14 default rules.

/// The 15 constitutional governance domains.
/// Extracted from: ai-ethics-*, responsible-ai-*, ai-governance-*,
/// ai-safety-*, ai-fairness-*, ai-transparency-*, ai-accountability-*,
/// and related repos.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ConstitutionalDomain {
    /// General governance and administration
    GeneralGovernance,
    /// Data privacy, consent, and PII handling
    DataPrivacy,
    /// Transparency and audit trail requirements
    TransparencyAudit,
    /// Human oversight and override capabilities (HITL)
    HumanOversight,
    /// Fairness, bias detection, and mitigation
    FairnessBias,
    /// AI safety and alignment constraints
    SafetyAlignment,
    /// Model and decision explainability
    Explainability,
    /// Accountability and liability frameworks
    AccountabilityLiability,
    /// Resource allocation and compute governance
    ResourceGovernance,
    /// Cross-border data and regulatory compliance
    CrossBorderCompliance,
    /// Environmental impact assessment
    EnvironmentalImpact,
    /// Interoperability standards (MCP, A2A, etc.)
    InteroperabilityStandards,
    /// Dispute resolution and arbitration
    DisputeResolution,
    /// Digital sovereignty and jurisdictional autonomy
    DigitalSovereignty,
    /// Emergency protocols and circuit breakers
    EmergencyProtocols,
}

impl ConstitutionalDomain {
    /// All 15 domains as a static array
    pub const ALL: [ConstitutionalDomain; 15] = [
        Self::GeneralGovernance,
        Self::DataPrivacy,
        Self::TransparencyAudit,
        Self::HumanOversight,
        Self::FairnessBias,
        Self::SafetyAlignment,
        Self::Explainability,
        Self::AccountabilityLiability,
        Self::ResourceGovernance,
        Self::CrossBorderCompliance,
        Self::EnvironmentalImpact,
        Self::InteroperabilityStandards,
        Self::DisputeResolution,
        Self::DigitalSovereignty,
        Self::EmergencyProtocols,
    ];

    /// Human-readable name
    pub fn name(&self) -> &'static str {
        match self {
            Self::GeneralGovernance => "General Governance",
            Self::DataPrivacy => "Data Privacy",
            Self::TransparencyAudit => "Transparency & Audit",
            Self::HumanOversight => "Human Oversight (HITL)",
            Self::FairnessBias => "Fairness & Bias",
            Self::SafetyAlignment => "Safety & Alignment",
            Self::Explainability => "Explainability",
            Self::AccountabilityLiability => "Accountability & Liability",
            Self::ResourceGovernance => "Resource Governance",
            Self::CrossBorderCompliance => "Cross-Border Compliance",
            Self::EnvironmentalImpact => "Environmental Impact",
            Self::InteroperabilityStandards => "Interoperability Standards",
            Self::DisputeResolution => "Dispute Resolution",
            Self::DigitalSovereignty => "Digital Sovereignty",
            Self::EmergencyProtocols => "Emergency Protocols",
        }
    }

    /// Source repos this domain was extracted from (representative examples)
    pub fn source_repos(&self) -> &'static [&'static str] {
        match self {
            Self::GeneralGovernance => &["ai-governance-framework", "ai-governance-toolkit"],
            Self::DataPrivacy => &["ai-privacy-framework", "data-privacy-toolkit"],
            Self::TransparencyAudit => &["ai-transparency-report", "ai-audit-framework"],
            Self::HumanOversight => &["human-in-the-loop-ai", "ai-oversight-board"],
            Self::FairnessBias => &["ai-fairness-toolkit", "ai-bias-detection"],
            Self::SafetyAlignment => &["ai-safety-framework", "ai-alignment-research"],
            Self::Explainability => &["ai-explainability-toolkit", "xai-framework"],
            Self::AccountabilityLiability => &["ai-accountability-framework", "ai-liability-model"],
            Self::ResourceGovernance => &["ai-resource-management", "compute-governance"],
            Self::CrossBorderCompliance => &["ai-cross-border-compliance", "gdpr-ai-toolkit"],
            Self::EnvironmentalImpact => &["ai-environmental-impact", "green-ai-framework"],
            Self::InteroperabilityStandards => &["ai-interop-standards", "mcp-compliance"],
            Self::DisputeResolution => &["ai-dispute-resolution", "ai-arbitration-protocol"],
            Self::DigitalSovereignty => &["digital-sovereignty-ai", "sovereign-ai-framework"],
            Self::EmergencyProtocols => &["ai-emergency-protocols", "ai-circuit-breaker"],
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_domain_count() {
        assert_eq!(ConstitutionalDomain::ALL.len(), 15);
    }

    #[test]
    fn test_all_domains_have_names() {
        for domain in ConstitutionalDomain::ALL.iter() {
            assert!(!domain.name().is_empty());
        }
    }

    #[test]
    fn test_all_domains_have_source_repos() {
        for domain in ConstitutionalDomain::ALL.iter() {
            assert!(!domain.source_repos().is_empty());
        }
    }

    #[test]
    fn test_domain_equality() {
        assert_eq!(ConstitutionalDomain::DataPrivacy, ConstitutionalDomain::DataPrivacy);
        assert_ne!(ConstitutionalDomain::DataPrivacy, ConstitutionalDomain::SafetyAlignment);
    }

    #[test]
    fn test_domains_unique() {
        // Verify all 15 domains are distinct
        for i in 0..ConstitutionalDomain::ALL.len() {
            for j in (i + 1)..ConstitutionalDomain::ALL.len() {
                assert_ne!(ConstitutionalDomain::ALL[i], ConstitutionalDomain::ALL[j]);
            }
        }
    }

    #[test]
    fn test_specific_domain_names() {
        assert_eq!(ConstitutionalDomain::DataPrivacy.name(), "Data Privacy");
        assert_eq!(ConstitutionalDomain::HumanOversight.name(), "Human Oversight (HITL)");
        assert_eq!(ConstitutionalDomain::EmergencyProtocols.name(), "Emergency Protocols");
    }
}
