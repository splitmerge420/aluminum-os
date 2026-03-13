# Aluminum OS: Forge Core Prototype Scaffold

## Phase 1 Implementation Guide — From Zero to AI Boot

**Classification:** Artifact #69 — Implementation Scaffold
**Author:** Daavud Afshar / Manus AI
**Date:** March 13, 2026
**Status:** Prototype Scaffold — Ready for Development

---

## 1. Development Environment Setup

### 1.1 Required Toolchain

The Forge Core prototype requires a bare-metal Rust development environment. The following toolchain produces a UEFI-bootable binary that runs on any x86-64 machine with UEFI firmware.

| Tool | Version | Purpose |
|------|---------|---------|
| Rust (nightly) | nightly-2026-03-01+ | `no_std` bare-metal compilation |
| `rust-src` component | Latest | Core library source for custom targets |
| `llvm-tools` component | Latest | Binary utilities for bare-metal targets |
| QEMU | 8.2+ | x86-64 emulation with UEFI (OVMF) |
| OVMF | Latest | UEFI firmware for QEMU testing |
| `uefi-rs` crate | 0.32+ | Rust UEFI application framework |
| `bootloader` crate | 0.11+ | Alternative boot path (non-UEFI) |

### 1.2 Project Structure

```
aluminum-os/
├── forge-boot/              # UEFI bootloader
│   ├── Cargo.toml
│   └── src/
│       └── main.rs          # UEFI entry point
├── forge-core/              # Microkernel
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs           # Kernel entry
│       ├── memory/          # Physical memory manager
│       │   ├── mod.rs
│       │   ├── frame.rs     # Frame allocator
│       │   └── page.rs      # Page table management
│       ├── interrupt/       # Interrupt handling
│       │   ├── mod.rs
│       │   ├── idt.rs       # IDT setup
│       │   └── handlers.rs  # Interrupt handlers
│       ├── hal/             # Hardware Abstraction Layer
│       │   ├── mod.rs
│       │   ├── cpu.rs       # CPU detection and features
│       │   ├── display.rs   # Framebuffer display
│       │   └── serial.rs    # Serial console (debug)
│       └── ring/            # Ring transition gateway
│           ├── mod.rs
│           └── transition.rs
├── inference-engine/        # Ring 1: AI inference runtime
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs
│       ├── runtime/         # Model loading and inference
│       │   ├── mod.rs
│       │   ├── tokenizer.rs # BPE tokenizer (no_std)
│       │   ├── tensor.rs    # Tensor operations (SIMD)
│       │   ├── model.rs     # Model weight loading
│       │   └── inference.rs # Forward pass execution
│       ├── intent/          # Intent processor
│       │   ├── mod.rs
│       │   └── processor.rs
│       └── constitution/    # Constitutional substrate
│           ├── mod.rs
│           └── rules.rs
├── agent-runtime/           # Ring 2: Agent lifecycle
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs
│       ├── agent.rs         # Agent struct and lifecycle
│       ├── scheduler.rs     # Intent-based scheduler
│       ├── registry.rs      # Agent registry
│       └── memory/          # SHELDONBRAIN memory tiers
│           ├── mod.rs
│           ├── stm.rs       # Short-term memory
│           ├── mtm.rs       # Mid-term memory
│           └── ltm.rs       # Long-term memory
├── experience/              # Ring 3: User interface
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs
│       ├── compositor.rs    # Contextual surface compositor
│       ├── text.rs          # Text rendering
│       └── input.rs         # Keyboard/serial input
├── tools/
│   ├── build-iso.sh         # Build bootable ISO
│   ├── run-qemu.sh          # Run in QEMU for testing
│   └── flash-usb.sh         # Flash to USB drive
├── models/
│   └── README.md            # Model weight placement
├── Cargo.toml               # Workspace root
├── rust-toolchain.toml      # Pinned nightly toolchain
└── README.md
```

---

## 2. Core Code Scaffolds

### 2.1 Workspace Root (Cargo.toml)

```toml
[workspace]
members = [
    "forge-boot",
    "forge-core",
    "inference-engine",
    "agent-runtime",
    "experience",
]
resolver = "2"

[workspace.package]
version = "0.1.0"
edition = "2024"
license = "MIT"
authors = ["Daavud Afshar <daavud@aluminum-os.org>"]

[workspace.dependencies]
uefi = "0.32"
uefi-services = "0.25"
log = "0.4"
spin = "0.9"         # Spinlock for no_std
bitflags = "2.6"
```

### 2.2 Forge Bootloader (forge-boot/src/main.rs)

```rust
//! Aluminum OS — Forge Bootloader
//! 
//! UEFI application that initializes hardware, sets up memory,
//! and transfers control to the Forge Core microkernel.
//! 
//! Design Philosophy: Aluminum Forge — Industrial Minimalism
//! This is Ring 0 bootstrap. Every instruction matters.

#![no_std]
#![no_main]
#![feature(abi_efiapi)]

extern crate alloc;

use uefi::prelude::*;
use uefi::proto::console::text::Output;
use uefi::proto::media::fs::SimpleFileSystem;
use uefi::table::boot::{MemoryDescriptor, MemoryType};
use log::info;

/// The Aluminum OS boot banner — first thing the user sees
const BOOT_BANNER: &str = r#"
    ╔═══════════════════════════════════════════════════╗
    ║           A L U M I N U M   O S                   ║
    ║       The AI-Native Operating System              ║
    ║                                                   ║
    ║   "Don't retrofit AI into an old OS.              ║
    ║    Build the OS around the AI kernel."            ║
    ╚═══════════════════════════════════════════════════╝
"#;

/// Memory regions reserved for each ring
const RING1_INFERENCE_BASE: u64 = 0x1_0000_0000;  // 4 GiB mark
const RING1_INFERENCE_SIZE: u64 = 0x1_0000_0000;  // 4 GiB for inference
const RING2_AGENT_BASE: u64    = 0x2_0000_0000;  // 8 GiB mark
const RING2_AGENT_SIZE: u64    = 0x0_8000_0000;  // 2 GiB for agents

#[entry]
fn efi_main(image: Handle, mut system_table: SystemTable<Boot>) -> Status {
    // Initialize UEFI services
    uefi_services::init(&mut system_table).unwrap();
    
    // Display boot banner
    let stdout = system_table.stdout();
    stdout.clear().unwrap();
    stdout.output_string(cstr16!(BOOT_BANNER)).unwrap();
    
    info!("[FORGE] Aluminum OS Bootloader v0.1.0");
    info!("[FORGE] Enumerating hardware...");
    
    // Step 1: Detect CPU features
    let cpu_info = detect_cpu_features();
    info!("[FORGE] CPU: {} cores, SSE4.2={}, AVX2={}, AVX-512={}", 
        cpu_info.cores, cpu_info.sse42, cpu_info.avx2, cpu_info.avx512);
    
    // Step 2: Enumerate memory
    let memory_map = system_table.boot_services().memory_map(MemoryType::LOADER_DATA).unwrap();
    let total_ram = calculate_total_ram(&memory_map);
    info!("[FORGE] RAM: {} MiB detected", total_ram / (1024 * 1024));
    
    // Step 3: Detect AI accelerators
    let accel = detect_ai_accelerators(&system_table);
    info!("[FORGE] AI Accelerators: NPU={}, GPU={}", accel.npu, accel.gpu_name);
    
    // Step 4: Reserve memory regions for each ring
    info!("[FORGE] Reserving Ring 1 (Inference Engine): {} MiB at 0x{:X}", 
        RING1_INFERENCE_SIZE / (1024 * 1024), RING1_INFERENCE_BASE);
    info!("[FORGE] Reserving Ring 2 (Agent Runtime): {} MiB at 0x{:X}", 
        RING2_AGENT_SIZE / (1024 * 1024), RING2_AGENT_BASE);
    
    // Step 5: Load Forge Core kernel from disk
    info!("[FORGE] Loading Forge Core kernel...");
    let kernel_data = load_kernel_from_disk(&system_table);
    
    // Step 6: Exit UEFI boot services and transfer to kernel
    info!("[FORGE] Exiting UEFI boot services...");
    info!("[FORGE] Transferring control to Forge Core...");
    
    let (runtime_table, memory_map) = system_table
        .exit_boot_services(MemoryType::LOADER_DATA);
    
    // Jump to Forge Core entry point
    // This never returns — we are now in Aluminum OS
    unsafe {
        forge_core::kernel_entry(
            &runtime_table,
            &memory_map,
            &cpu_info,
            &accel,
        );
    }
    
    // Unreachable
    Status::SUCCESS
}

/// CPU feature detection via CPUID
struct CpuInfo {
    cores: u32,
    sse42: bool,
    avx2: bool,
    avx512: bool,
    vendor: [u8; 12],
}

fn detect_cpu_features() -> CpuInfo {
    // CPUID-based detection
    // Implementation uses raw CPUID instructions in no_std context
    todo!("CPUID enumeration")
}

struct AiAccelerators {
    npu: bool,
    npu_name: &'static str,
    gpu: bool,
    gpu_name: &'static str,
}

fn detect_ai_accelerators(_st: &SystemTable<Boot>) -> AiAccelerators {
    // PCI enumeration for known NPU/GPU device IDs
    // Intel Meteor Lake NPU: 0x7D1D
    // Qualcomm Hexagon NPU: via ACPI
    // AMD/NVIDIA GPU: PCI class 0x0300
    todo!("PCI/ACPI enumeration for AI accelerators")
}

fn calculate_total_ram(memory_map: &[MemoryDescriptor]) -> u64 {
    memory_map.iter()
        .filter(|desc| desc.ty == MemoryType::CONVENTIONAL)
        .map(|desc| desc.page_count * 4096)
        .sum()
}

fn load_kernel_from_disk(_st: &SystemTable<Boot>) -> &'static [u8] {
    // Load forge-core binary from EFI system partition
    todo!("Load kernel ELF from ESP")
}
```

### 2.3 Forge Core Kernel Entry (forge-core/src/lib.rs)

```rust
//! Aluminum OS — Forge Core Microkernel
//! 
//! The bare-metal foundation. Manages hardware, memory, and ring transitions.
//! Everything above this is agents. Everything below is silicon.

#![no_std]
#![feature(asm_const)]
#![feature(naked_functions)]

pub mod memory;
pub mod interrupt;
pub mod hal;
pub mod ring;

use core::panic::PanicInfo;

/// Kernel entry point — called by Forge Bootloader after exiting UEFI
/// 
/// # Safety
/// This function is called exactly once, with valid memory map and CPU info.
/// After this point, UEFI boot services are no longer available.
#[no_mangle]
pub unsafe extern "C" fn kernel_entry(
    runtime: &uefi::table::RuntimeServices,
    memory_map: &[uefi::table::boot::MemoryDescriptor],
    cpu: &CpuInfo,
    accel: &AiAccelerators,
) -> ! {
    // Phase 1: Initialize serial console for early debug output
    hal::serial::init();
    klog!("[CORE] Forge Core microkernel starting...");
    
    // Phase 2: Set up GDT and IDT
    klog!("[CORE] Initializing interrupt descriptor table...");
    interrupt::idt::init();
    
    // Phase 3: Initialize physical memory manager
    klog!("[CORE] Initializing physical memory manager...");
    memory::frame::init(memory_map);
    
    // Phase 4: Set up kernel page tables
    klog!("[CORE] Setting up kernel page tables...");
    memory::page::init();
    
    // Phase 5: Initialize Ring 1 memory region for Inference Engine
    klog!("[CORE] Mapping Ring 1 (Inference Engine) memory region...");
    ring::transition::map_ring1_region();
    
    // Phase 6: Load and start the Inference Engine
    klog!("[CORE] Loading Inference Engine into Ring 1...");
    let inference = inference_engine::InferenceEngine::init(cpu, accel);
    
    // Phase 7: Load Constitutional Substrate
    klog!("[CORE] Loading Constitutional Substrate...");
    inference.load_constitution();
    
    // Phase 8: Perform self-test inference
    klog!("[CORE] Running inference self-test...");
    let test_result = inference.self_test();
    klog!("[CORE] Self-test result: {}", test_result);
    
    // Phase 9: Initialize Agent Runtime (Ring 2)
    klog!("[CORE] Starting Agent Runtime...");
    agent_runtime::init(&inference);
    
    // Phase 10: Boot SHELDONBRAIN (primary agent)
    klog!("[CORE] Spawning SHELDONBRAIN...");
    agent_runtime::spawn_sheldonbrain();
    
    // Phase 11: Start Experience Layer (Ring 3)
    klog!("[CORE] Starting Experience Layer...");
    experience::init();
    
    // Phase 12: System is live
    klog!("[CORE] ═══════════════════════════════════════");
    klog!("[CORE]   Aluminum OS is live.");
    klog!("[CORE]   AI kernel ready. Agents running.");
    klog!("[CORE]   The future doesn't retrofit.");
    klog!("[CORE] ═══════════════════════════════════════");
    
    // Enter the intent-based scheduler loop
    // This never returns
    agent_runtime::scheduler::run_forever()
}

/// Kernel panic handler — the last resort
#[panic_handler]
fn panic(info: &PanicInfo) -> ! {
    klog!("[PANIC] Forge Core panic: {}", info);
    // Attempt to save agent state to persistent storage
    // Then halt
    loop {
        unsafe { core::arch::asm!("hlt") };
    }
}

/// Kernel log macro — outputs to serial and framebuffer
#[macro_export]
macro_rules! klog {
    ($($arg:tt)*) => {
        $crate::hal::serial::write_fmt(format_args!($($arg)*));
        $crate::hal::display::write_fmt(format_args!($($arg)*));
    };
}
```

### 2.4 Intent-Based Scheduler (agent-runtime/src/scheduler.rs)

```rust
//! Aluminum OS — Intent-Based Scheduler
//!
//! Unlike traditional schedulers that use time-slicing or priority queues,
//! this scheduler evaluates agent intents through the Inference Engine
//! to determine execution order. The system understands WHAT it's doing
//! and WHY, not just WHEN.

use crate::agent::{Agent, AgentState, AgentId};
use crate::registry::AgentRegistry;
use inference_engine::InferenceEngine;
use alloc::vec::Vec;
use spin::Mutex;

/// The global agent registry
static REGISTRY: Mutex<AgentRegistry> = Mutex::new(AgentRegistry::new());

/// Scheduling decision from the Inference Engine
struct ScheduleDecision {
    agent_id: AgentId,
    priority_score: f32,      // 0.0 - 1.0, AI-determined
    reasoning: &'static str,  // Why this agent was prioritized
    time_budget_ms: u64,      // Suggested execution time
}

/// The main scheduler loop — runs forever after boot
pub fn run_forever() -> ! {
    loop {
        // Step 1: Collect all active agents and their current intents
        let registry = REGISTRY.lock();
        let active_agents: Vec<&Agent> = registry
            .agents()
            .filter(|a| a.state == AgentState::Active)
            .collect();
        
        if active_agents.is_empty() {
            // No active agents — enter low-power wait
            wait_for_interrupt();
            continue;
        }
        
        // Step 2: Submit all intents to the Inference Engine for prioritization
        let intents: Vec<(&AgentId, &str)> = active_agents
            .iter()
            .map(|a| (&a.id, a.current_intent()))
            .collect();
        
        let decisions = InferenceEngine::prioritize_intents(&intents);
        
        // Step 3: Execute agents in AI-determined priority order
        for decision in decisions.iter() {
            let agent = registry.get_mut(decision.agent_id);
            
            // Check constitutional compliance before execution
            if !InferenceEngine::check_constitution(agent, &decision) {
                agent.escalate_to_council();
                continue;
            }
            
            // Execute the agent's current intent
            agent.execute_intent(decision.time_budget_ms);
            
            // Check if the agent has completed its intent
            if agent.intent_complete() {
                agent.transition(AgentState::Idle);
            }
        }
        
        // Step 4: Run memory consolidation if due
        if memory_consolidation_due() {
            crate::memory::consolidate();
        }
    }
}

fn wait_for_interrupt() {
    unsafe { core::arch::asm!("hlt") };
}

fn memory_consolidation_due() -> bool {
    // Check if 30 minutes have elapsed since last consolidation
    // (SHELDONBRAIN memory architecture specification)
    todo!("Timer-based consolidation check")
}
```

### 2.5 Bare-Metal Tensor Operations (inference-engine/src/runtime/tensor.rs)

```rust
//! Aluminum OS — Bare-Metal Tensor Operations
//!
//! SIMD-optimized tensor math for CPU inference.
//! No BLAS, no LAPACK, no libc. Just raw metal.
//! 
//! Supports: SSE4.2, AVX2, AVX-512 (auto-detected at boot)

#![allow(unsafe_code)]

use core::arch::x86_64::*;

/// A tensor stored in contiguous memory
pub struct Tensor {
    data: &'static mut [f32],
    shape: &'static [usize],
    strides: &'static [usize],
}

impl Tensor {
    /// Matrix multiplication: C = A @ B
    /// Uses AVX2 when available, falls back to SSE4.2, then scalar
    pub fn matmul(&self, other: &Tensor) -> Tensor {
        assert_eq!(self.shape[1], other.shape[0], "Shape mismatch for matmul");
        
        let m = self.shape[0];
        let k = self.shape[1];
        let n = other.shape[1];
        
        // Dispatch to best available SIMD path
        if is_x86_feature_detected!("avx512f") {
            unsafe { self.matmul_avx512(other, m, k, n) }
        } else if is_x86_feature_detected!("avx2") {
            unsafe { self.matmul_avx2(other, m, k, n) }
        } else {
            self.matmul_scalar(other, m, k, n)
        }
    }
    
    /// AVX2 matrix multiplication (8 floats per SIMD lane)
    #[target_feature(enable = "avx2", enable = "fma")]
    unsafe fn matmul_avx2(&self, other: &Tensor, m: usize, k: usize, n: usize) -> Tensor {
        // 8-wide SIMD matmul with FMA (fused multiply-add)
        // Each iteration processes 8 elements of the output row
        todo!("AVX2 matmul implementation")
    }
    
    /// AVX-512 matrix multiplication (16 floats per SIMD lane)
    #[target_feature(enable = "avx512f")]
    unsafe fn matmul_avx512(&self, other: &Tensor, m: usize, k: usize, n: usize) -> Tensor {
        todo!("AVX-512 matmul implementation")
    }
    
    /// Scalar fallback — works on any x86-64
    fn matmul_scalar(&self, other: &Tensor, m: usize, k: usize, n: usize) -> Tensor {
        todo!("Scalar matmul implementation")
    }
    
    /// Softmax activation (used in attention layers)
    pub fn softmax(&mut self) {
        let max_val = self.data.iter().cloned().fold(f32::NEG_INFINITY, f32::max);
        let mut sum = 0.0f32;
        for x in self.data.iter_mut() {
            *x = (*x - max_val).exp();
            sum += *x;
        }
        for x in self.data.iter_mut() {
            *x /= sum;
        }
    }
    
    /// RMS normalization (used in modern transformers)
    pub fn rms_norm(&mut self, weight: &[f32], eps: f32) {
        let ss: f32 = self.data.iter().map(|x| x * x).sum::<f32>() / self.data.len() as f32;
        let scale = 1.0 / (ss + eps).sqrt();
        for (x, w) in self.data.iter_mut().zip(weight.iter()) {
            *x = *x * scale * w;
        }
    }
}
```

---

## 3. Build and Test Pipeline

### 3.1 Build Script (tools/build-iso.sh)

```bash
#!/bin/bash
# Aluminum OS — Build Bootable ISO
# Produces a UEFI-bootable ISO image that runs on any x86-64 machine

set -euo pipefail

echo "╔═══════════════════════════════════════╗"
echo "║   Building Aluminum OS ISO            ║"
echo "╚═══════════════════════════════════════╝"

# Build the UEFI bootloader
echo "[BUILD] Compiling Forge Bootloader..."
cargo build --package forge-boot \
    --target x86_64-unknown-uefi \
    --release

# Build the kernel
echo "[BUILD] Compiling Forge Core..."
cargo build --package forge-core \
    --target x86_64-unknown-none \
    --release

# Create ISO directory structure
echo "[BUILD] Assembling ISO..."
mkdir -p iso/EFI/BOOT
cp target/x86_64-unknown-uefi/release/forge-boot.efi iso/EFI/BOOT/BOOTX64.EFI
cp target/x86_64-unknown-none/release/forge-core iso/aluminum-core.bin

# Copy model weights if present
if [ -d "models/weights" ]; then
    echo "[BUILD] Including model weights..."
    cp -r models/weights iso/models/
fi

# Copy Constitutional Substrate
cp constitution/substrate.json iso/constitution.json

# Build ISO with xorriso
echo "[BUILD] Creating bootable ISO..."
xorriso -as mkisofs \
    -o aluminum-os.iso \
    -e EFI/BOOT/BOOTX64.EFI \
    -no-emul-boot \
    -isohybrid-gpt-basdat \
    iso/

echo "╔═══════════════════════════════════════╗"
echo "║   aluminum-os.iso ready               ║"
echo "║   Flash to USB: dd if=aluminum-os.iso ║"
echo "║                 of=/dev/sdX bs=4M     ║"
echo "╚═══════════════════════════════════════╝"
```

### 3.2 QEMU Test Script (tools/run-qemu.sh)

```bash
#!/bin/bash
# Run Aluminum OS in QEMU for testing
# Requires: qemu-system-x86_64, OVMF firmware

set -euo pipefail

OVMF_CODE="/usr/share/OVMF/OVMF_CODE.fd"
OVMF_VARS="/usr/share/OVMF/OVMF_VARS.fd"

echo "[QEMU] Launching Aluminum OS..."

qemu-system-x86_64 \
    -machine q35 \
    -cpu host \
    -enable-kvm \
    -m 8G \
    -smp 4 \
    -drive if=pflash,format=raw,readonly=on,file="$OVMF_CODE" \
    -drive if=pflash,format=raw,file="$OVMF_VARS" \
    -cdrom aluminum-os.iso \
    -serial stdio \
    -display gtk \
    -device virtio-gpu-pci \
    -device virtio-keyboard-pci \
    -device virtio-mouse-pci \
    -netdev user,id=net0 \
    -device virtio-net-pci,netdev=net0
```

---

## 4. What This Scaffold Enables

This scaffold provides the structural foundation for the entire Aluminum OS development effort. With this in place, a development team can immediately begin work on parallel tracks:

| Track | Starting Point | First Milestone |
|-------|---------------|-----------------|
| **Boot** | `forge-boot/src/main.rs` | UEFI boot to serial output |
| **Kernel** | `forge-core/src/lib.rs` | Memory management + interrupts |
| **Inference** | `inference-engine/src/runtime/` | CPU inference of a small model |
| **Agents** | `agent-runtime/src/` | Agent spawn/schedule/terminate |
| **Experience** | `experience/src/` | Framebuffer text rendering |

The first demo target (M1.6 from the Architecture Blueprint) is a USB drive that boots any x86-64 machine into an AI conversation. This scaffold provides every file, every directory, and every interface needed to reach that target.

---

## 5. Dependency on Existing Aluminum OS Artifacts

This scaffold builds directly on the following existing specifications:

| Artifact | Used In | How |
|----------|---------|-----|
| Agent Control Plane Spec v1.0 | `agent-runtime/` | Agent Registry, A2A protocol, audit trail |
| SHELDONBRAIN Memory Architecture v1.0 | `agent-runtime/src/memory/` | STM/MTM/LPM tiers, consolidation cycles |
| UWS MCP Governance Layer v1.0 | `inference-engine/src/constitution/` | Constitutional Substrate, impact classification |
| Unified Field v3.0 | Architecture overall | Four-ring model, design philosophy |
| Trained Adult Instance Protocol | `agent-runtime/src/agent.rs` | Agent autonomy tiers, maturation model |

Every artifact produced over the last 67+ sessions feeds directly into this implementation. Nothing was wasted. Everything converges here.
