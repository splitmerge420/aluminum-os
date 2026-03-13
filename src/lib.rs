//! Aluminum OS — Forge Core Kernel (Ring 0)
//!
//! Constitutional AI governance substrate. Compiles in both std and no_std.
//! No heap allocations — fixed-size arrays throughout.
//!
//! Components:
//! - BuddyAllocator: Power-of-two memory block management
//! - AgentIdentity: Agent registration with trust + constitutional compliance
//! - IntentScheduler: Priority queue for agent intents with constitutional veto
//! - Constitution: Rule engine with severity levels and Dave Protocol veto
//!
//! Atlas Lattice Foundation — March 2026

#![cfg_attr(not(feature = "std"), no_std)]

pub mod constitution_domains;

// ============================================================================
// Constants
// ============================================================================

/// Maximum number of memory blocks in the buddy allocator
pub const MAX_BLOCKS: usize = 64;
/// Maximum number of registered agents
pub const MAX_AGENTS: usize = 32;
/// Maximum number of pending intents in the scheduler
pub const MAX_INTENTS: usize = 128;
/// Maximum number of constitutional rules
pub const MAX_RULES: usize = 64;
/// Maximum length for string fields (names, descriptions)
pub const MAX_NAME_LEN: usize = 64;

// ============================================================================
// Error Types
// ============================================================================

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AluminumError {
    OutOfMemory,
    InvalidBlockSize,
    AgentRegistryFull,
    AgentNotFound,
    IntentQueueFull,
    ConstitutionalViolation,
    RuleRegistryFull,
    DaveProtocolVeto,
    InvalidInput,
}

// ============================================================================
// Fixed-Size String
// ============================================================================

/// Fixed-size string buffer — no heap allocation
#[derive(Clone, Copy)]
pub struct FixedStr {
    buf: [u8; MAX_NAME_LEN],
    len: usize,
}

impl FixedStr {
    pub const fn empty() -> Self {
        Self {
            buf: [0u8; MAX_NAME_LEN],
            len: 0,
        }
    }

    pub fn from_bytes(src: &[u8]) -> Self {
        let mut s = Self::empty();
        let copy_len = if src.len() < MAX_NAME_LEN {
            src.len()
        } else {
            MAX_NAME_LEN
        };
        let mut i = 0;
        while i < copy_len {
            s.buf[i] = src[i];
            i += 1;
        }
        s.len = copy_len;
        s
    }

    pub fn as_bytes(&self) -> &[u8] {
        &self.buf[..self.len]
    }

    pub fn len(&self) -> usize {
        self.len
    }

    pub fn is_empty(&self) -> bool {
        self.len == 0
    }
}

impl PartialEq for FixedStr {
    fn eq(&self, other: &Self) -> bool {
        self.as_bytes() == other.as_bytes()
    }
}

impl core::fmt::Debug for FixedStr {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        if let Ok(s) = core::str::from_utf8(self.as_bytes()) {
            write!(f, "\"{}\"", s)
        } else {
            write!(f, "<{} bytes>", self.len)
        }
    }
}

// ============================================================================
// BuddyAllocator
// ============================================================================

/// Memory block state
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum BlockState {
    Free,
    Allocated,
    Split,
}

/// A single memory block
#[derive(Debug, Clone, Copy)]
pub struct Block {
    pub offset: usize,
    pub size: usize,
    pub state: BlockState,
    pub owner_agent_id: u32,
}

/// Power-of-two buddy allocator with fixed-size block array.
/// No heap. No Vec. No HashMap. Just arrays.
pub struct BuddyAllocator {
    blocks: [Block; MAX_BLOCKS],
    count: usize,
    pub total_capacity: usize,
}

impl core::fmt::Debug for BuddyAllocator {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        write!(f, "BuddyAllocator(capacity={}, blocks={})", self.total_capacity, self.count)
    }
}

impl BuddyAllocator {
    /// Create a new allocator with the given total capacity (must be power of 2)
    pub fn new(capacity: usize) -> Result<Self, AluminumError> {
        if capacity == 0 || (capacity & (capacity - 1)) != 0 {
            return Err(AluminumError::InvalidBlockSize);
        }
        let mut alloc = Self {
            blocks: [Block {
                offset: 0,
                size: 0,
                state: BlockState::Free,
                owner_agent_id: 0,
            }; MAX_BLOCKS],
            count: 1,
            total_capacity: capacity,
        };
        alloc.blocks[0] = Block {
            offset: 0,
            size: capacity,
            state: BlockState::Free,
            owner_agent_id: 0,
        };
        Ok(alloc)
    }

    /// Allocate a block of at least `requested` bytes. Returns block index.
    pub fn allocate(&mut self, requested: usize, agent_id: u32) -> Result<usize, AluminumError> {
        // Round up to next power of 2
        let size = requested.next_power_of_two();

        // Find smallest free block that fits
        let mut best_idx = None;
        let mut best_size = usize::MAX;
        for i in 0..self.count {
            if self.blocks[i].state == BlockState::Free && self.blocks[i].size >= size {
                if self.blocks[i].size < best_size {
                    best_size = self.blocks[i].size;
                    best_idx = Some(i);
                }
            }
        }

        let idx = best_idx.ok_or(AluminumError::OutOfMemory)?;

        // Split until we reach the right size
        let mut current = idx;
        while self.blocks[current].size > size {
            if self.count >= MAX_BLOCKS - 1 {
                return Err(AluminumError::OutOfMemory);
            }
            let half = self.blocks[current].size / 2;
            self.blocks[current].state = BlockState::Split;

            // Left child
            let left = self.count;
            self.blocks[left] = Block {
                offset: self.blocks[current].offset,
                size: half,
                state: BlockState::Free,
                owner_agent_id: 0,
            };
            self.count += 1;

            // Right child
            let right = self.count;
            self.blocks[right] = Block {
                offset: self.blocks[current].offset + half,
                size: half,
                state: BlockState::Free,
                owner_agent_id: 0,
            };
            self.count += 1;

            current = left;
        }

        self.blocks[current].state = BlockState::Allocated;
        self.blocks[current].owner_agent_id = agent_id;
        Ok(current)
    }

    /// Free a previously allocated block
    pub fn free(&mut self, block_idx: usize) -> Result<(), AluminumError> {
        if block_idx >= self.count || self.blocks[block_idx].state != BlockState::Allocated {
            return Err(AluminumError::InvalidBlockSize);
        }
        self.blocks[block_idx].state = BlockState::Free;
        self.blocks[block_idx].owner_agent_id = 0;
        Ok(())
    }

    /// Count of free blocks
    pub fn free_count(&self) -> usize {
        let mut count = 0;
        for i in 0..self.count {
            if self.blocks[i].state == BlockState::Free {
                count += 1;
            }
        }
        count
    }

    /// Total allocated bytes
    pub fn allocated_bytes(&self) -> usize {
        let mut total = 0;
        for i in 0..self.count {
            if self.blocks[i].state == BlockState::Allocated {
                total += self.blocks[i].size;
            }
        }
        total
    }
}

// ============================================================================
// AgentIdentity
// ============================================================================

/// Trust level for an agent
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum TrustLevel {
    Untrusted = 0,
    Provisional = 1,
    Verified = 2,
    Constitutional = 3,
}

/// A registered agent
#[derive(Debug, Clone, Copy)]
pub struct AgentIdentity {
    pub id: u32,
    pub name: FixedStr,
    pub trust: TrustLevel,
    pub constitutional_compliant: bool,
    pub active: bool,
    pub intents_submitted: u32,
    pub intents_vetoed: u32,
}

/// Agent registry — fixed-size, no heap
pub struct AgentRegistry {
    agents: [AgentIdentity; MAX_AGENTS],
    count: usize,
    next_id: u32,
}

impl AgentRegistry {
    pub fn new() -> Self {
        Self {
            agents: [AgentIdentity {
                id: 0,
                name: FixedStr::empty(),
                trust: TrustLevel::Untrusted,
                constitutional_compliant: false,
                active: false,
                intents_submitted: 0,
                intents_vetoed: 0,
            }; MAX_AGENTS],
            count: 0,
            next_id: 1,
        }
    }

    /// Register a new agent. Returns agent ID.
    pub fn register(&mut self, name: &[u8], trust: TrustLevel) -> Result<u32, AluminumError> {
        if self.count >= MAX_AGENTS {
            return Err(AluminumError::AgentRegistryFull);
        }
        let id = self.next_id;
        self.agents[self.count] = AgentIdentity {
            id,
            name: FixedStr::from_bytes(name),
            trust,
            constitutional_compliant: true,
            active: true,
            intents_submitted: 0,
            intents_vetoed: 0,
        };
        self.count += 1;
        self.next_id += 1;
        Ok(id)
    }

    /// Look up an agent by ID
    pub fn find(&self, id: u32) -> Option<&AgentIdentity> {
        for i in 0..self.count {
            if self.agents[i].id == id {
                return Some(&self.agents[i]);
            }
        }
        None
    }

    /// Mutable lookup by ID
    pub fn find_mut(&mut self, id: u32) -> Option<&mut AgentIdentity> {
        for i in 0..self.count {
            if self.agents[i].id == id {
                return Some(&mut self.agents[i]);
            }
        }
        None
    }

    pub fn count(&self) -> usize {
        self.count
    }
}

// ============================================================================
// IntentScheduler
// ============================================================================

/// Priority level for intents
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Priority {
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3,
}

/// An intent submitted by an agent
#[derive(Debug, Clone, Copy)]
pub struct Intent {
    pub id: u32,
    pub agent_id: u32,
    pub priority: Priority,
    pub description: FixedStr,
    pub domain: constitution_domains::ConstitutionalDomain,
    pub approved: bool,
    pub executed: bool,
}

/// Intent queue with constitutional pre-screening
pub struct IntentScheduler {
    intents: [Intent; MAX_INTENTS],
    count: usize,
    next_id: u32,
}

impl IntentScheduler {
    pub fn new() -> Self {
        Self {
            intents: [Intent {
                id: 0,
                agent_id: 0,
                priority: Priority::Low,
                description: FixedStr::empty(),
                domain: constitution_domains::ConstitutionalDomain::GeneralGovernance,
                approved: false,
                executed: false,
            }; MAX_INTENTS],
            count: 0,
            next_id: 1,
        }
    }

    /// Submit an intent. Returns intent ID if constitutionally valid.
    pub fn submit(
        &mut self,
        agent_id: u32,
        priority: Priority,
        description: &[u8],
        domain: constitution_domains::ConstitutionalDomain,
        constitution: &Constitution,
    ) -> Result<u32, AluminumError> {
        if self.count >= MAX_INTENTS {
            return Err(AluminumError::IntentQueueFull);
        }

        // Constitutional pre-screening
        if !constitution.check_domain_allowed(domain) {
            return Err(AluminumError::ConstitutionalViolation);
        }

        let id = self.next_id;
        self.intents[self.count] = Intent {
            id,
            agent_id,
            priority,
            description: FixedStr::from_bytes(description),
            domain,
            approved: true,
            executed: false,
        };
        self.count += 1;
        self.next_id += 1;
        Ok(id)
    }

    /// Get next highest-priority approved intent
    pub fn next(&self) -> Option<&Intent> {
        let mut best: Option<&Intent> = None;
        for i in 0..self.count {
            let intent = &self.intents[i];
            if intent.approved && !intent.executed {
                match best {
                    None => best = Some(intent),
                    Some(b) if intent.priority > b.priority => best = Some(intent),
                    _ => {}
                }
            }
        }
        best
    }

    /// Mark an intent as executed
    pub fn mark_executed(&mut self, intent_id: u32) -> Result<(), AluminumError> {
        for i in 0..self.count {
            if self.intents[i].id == intent_id {
                self.intents[i].executed = true;
                return Ok(());
            }
        }
        Err(AluminumError::InvalidInput)
    }

    pub fn pending_count(&self) -> usize {
        let mut count = 0;
        for i in 0..self.count {
            if self.intents[i].approved && !self.intents[i].executed {
                count += 1;
            }
        }
        count
    }
}

// ============================================================================
// Constitution
// ============================================================================

/// Severity of a constitutional rule
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Severity {
    Advisory = 0,
    Warning = 1,
    Mandatory = 2,
    Critical = 3,
}

/// A constitutional rule
#[derive(Debug, Clone, Copy)]
pub struct Rule {
    pub id: u32,
    pub name: FixedStr,
    pub severity: Severity,
    pub domain: constitution_domains::ConstitutionalDomain,
    pub dave_protocol_veto: bool,
    pub active: bool,
}

/// The constitution — rule engine for the kernel
pub struct Constitution {
    rules: [Rule; MAX_RULES],
    count: usize,
    next_id: u32,
    dave_protocol_active: bool,
}

impl Constitution {
    pub fn new() -> Self {
        Self {
            rules: [Rule {
                id: 0,
                name: FixedStr::empty(),
                severity: Severity::Advisory,
                domain: constitution_domains::ConstitutionalDomain::GeneralGovernance,
                dave_protocol_veto: false,
                active: false,
            }; MAX_RULES],
            count: 0,
            next_id: 1,
            dave_protocol_active: true,
        }
    }

    /// Add a constitutional rule
    pub fn add_rule(
        &mut self,
        name: &[u8],
        severity: Severity,
        domain: constitution_domains::ConstitutionalDomain,
        dave_veto: bool,
    ) -> Result<u32, AluminumError> {
        if self.count >= MAX_RULES {
            return Err(AluminumError::RuleRegistryFull);
        }
        let id = self.next_id;
        self.rules[self.count] = Rule {
            id,
            name: FixedStr::from_bytes(name),
            severity,
            domain,
            dave_protocol_veto: dave_veto,
            active: true,
        };
        self.count += 1;
        self.next_id += 1;
        Ok(id)
    }

    /// Check if a domain has any active rules blocking it
    pub fn check_domain_allowed(&self, domain: constitution_domains::ConstitutionalDomain) -> bool {
        // All domains are allowed unless there's a Critical+DaveVeto rule blocking them
        for i in 0..self.count {
            if self.rules[i].active
                && self.rules[i].domain == domain
                && self.rules[i].severity == Severity::Critical
                && self.rules[i].dave_protocol_veto
                && self.dave_protocol_active
            {
                return false;
            }
        }
        true
    }

    /// Load default constitutional rules (the 14 core rules from governance repos)
    pub fn load_defaults(&mut self) -> Result<(), AluminumError> {
        use constitution_domains::ConstitutionalDomain::*;
        use Severity::*;

        let defaults: [(& [u8], Severity, constitution_domains::ConstitutionalDomain, bool); 14] = [
            (b"consent-required", Critical, DataPrivacy, true),
            (b"audit-trail-mandatory", Mandatory, TransparencyAudit, false),
            (b"human-override-always", Critical, HumanOversight, true),
            (b"bias-check-required", Mandatory, FairnessBias, false),
            (b"safety-first", Critical, SafetyAlignment, true),
            (b"explainability-required", Warning, Explainability, false),
            (b"resource-limits", Mandatory, ResourceGovernance, false),
            (b"cross-border-compliance", Mandatory, CrossBorderCompliance, false),
            (b"env-impact-check", Warning, EnvironmentalImpact, false),
            (b"interop-standard", Advisory, InteroperabilityStandards, false),
            (b"dispute-resolution", Mandatory, DisputeResolution, false),
            (b"sovereignty-respect", Critical, DigitalSovereignty, true),
            (b"emergency-protocol", Critical, EmergencyProtocols, true),
            (b"governance-general", Advisory, GeneralGovernance, false),
        ];

        for (name, severity, domain, dave_veto) in defaults {
            self.add_rule(name, severity, domain, dave_veto)?;
        }
        Ok(())
    }

    pub fn rule_count(&self) -> usize {
        self.count
    }

    pub fn is_dave_protocol_active(&self) -> bool {
        self.dave_protocol_active
    }
}

// ============================================================================
// Tests
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_buddy_allocator_create() {
        let alloc = BuddyAllocator::new(1024).unwrap();
        assert_eq!(alloc.total_capacity, 1024);
        assert_eq!(alloc.free_count(), 1);
    }

    #[test]
    fn test_buddy_allocator_invalid_size() {
        assert_eq!(BuddyAllocator::new(0).unwrap_err(), AluminumError::InvalidBlockSize);
        assert_eq!(BuddyAllocator::new(100).unwrap_err(), AluminumError::InvalidBlockSize);
    }

    #[test]
    fn test_buddy_allocate_and_free() {
        let mut alloc = BuddyAllocator::new(1024).unwrap();
        let blk = alloc.allocate(128, 1).unwrap();
        assert!(alloc.allocated_bytes() >= 128);
        alloc.free(blk).unwrap();
    }

    #[test]
    fn test_agent_registry() {
        let mut reg = AgentRegistry::new();
        let id = reg.register(b"claude", TrustLevel::Constitutional).unwrap();
        assert_eq!(id, 1);
        let agent = reg.find(id).unwrap();
        assert_eq!(agent.trust, TrustLevel::Constitutional);
        assert!(agent.constitutional_compliant);
    }

    #[test]
    fn test_agent_registry_full() {
        let mut reg = AgentRegistry::new();
        for _i in 0..MAX_AGENTS {
            reg.register(b"agent", TrustLevel::Provisional).unwrap();
        }
        assert_eq!(
            reg.register(b"overflow", TrustLevel::Provisional).unwrap_err(),
            AluminumError::AgentRegistryFull
        );
    }

    #[test]
    fn test_constitution_defaults() {
        let mut con = Constitution::new();
        con.load_defaults().unwrap();
        assert_eq!(con.rule_count(), 14);
        assert!(con.is_dave_protocol_active());
    }

    #[test]
    fn test_constitution_domain_block() {
        let mut con = Constitution::new();
        con.load_defaults().unwrap();
        // DataPrivacy has a Critical + DaveVeto rule — should be blocked
        assert!(!con.check_domain_allowed(
            constitution_domains::ConstitutionalDomain::DataPrivacy
        ));
        // ResourceGovernance is Mandatory, no DaveVeto — should be allowed
        assert!(con.check_domain_allowed(
            constitution_domains::ConstitutionalDomain::ResourceGovernance
        ));
    }

    #[test]
    fn test_intent_scheduler_submit_and_next() {
        let mut con = Constitution::new();
        con.load_defaults().unwrap();
        let mut sched = IntentScheduler::new();

        // Submit to an allowed domain
        let id = sched
            .submit(
                1,
                Priority::High,
                b"run audit",
                constitution_domains::ConstitutionalDomain::ResourceGovernance,
                &con,
            )
            .unwrap();
        assert_eq!(id, 1);
        assert_eq!(sched.pending_count(), 1);

        let next = sched.next().unwrap();
        assert_eq!(next.id, 1);
        assert_eq!(next.priority, Priority::High);
    }

    #[test]
    fn test_intent_constitutional_veto() {
        let mut con = Constitution::new();
        con.load_defaults().unwrap();
        let mut sched = IntentScheduler::new();

        // DataPrivacy is blocked by Critical+DaveVeto
        let result = sched.submit(
            1,
            Priority::Critical,
            b"access data",
            constitution_domains::ConstitutionalDomain::DataPrivacy,
            &con,
        );
        assert_eq!(result.unwrap_err(), AluminumError::ConstitutionalViolation);
    }

    #[test]
    fn test_fixed_str() {
        let s = FixedStr::from_bytes(b"hello world");
        assert_eq!(s.len(), 11);
        assert_eq!(s.as_bytes(), b"hello world");
        assert!(!s.is_empty());

        let empty = FixedStr::empty();
        assert!(empty.is_empty());
    }
}
