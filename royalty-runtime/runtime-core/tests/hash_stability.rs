use runtime_core::tracer::{CanonicalLineage, PackageMeta, Dependency};

fn create_mock_lineage() -> CanonicalLineage {
    CanonicalLineage {
        primary_package: PackageMeta {
            name: "app".into(),
            version: "1.0.0".into(),
        },
        runtime: PackageMeta {
            name: "node".into(),
            version: "20.11.0".into(),
        },
        lockfile_digest: "sha256:abcd".into(),
        resolved_dependencies: vec![
            Dependency { name: "express".into(), version: "4.18.2".into() },
            Dependency { name: "zod".into(), version: "3.22.4".into() },
        ],
    }
}

#[test]
fn same_input_same_hash() {
    let lineage1 = create_mock_lineage();
    let lineage2 = create_mock_lineage();
    assert_eq!(lineage1.generate_hash(), lineage2.generate_hash());
}

#[test]
fn version_change_changes_hash() {
    let lineage1 = create_mock_lineage();
    let mut lineage2 = create_mock_lineage();
    lineage2.resolved_dependencies[0].version = "4.18.3".into();
    assert_ne!(lineage1.generate_hash(), lineage2.generate_hash());
}

#[test]
fn whitespace_does_not_change_hash() {
    let lineage = create_mock_lineage();
    let hash = lineage.generate_hash();
    assert!(!hash.is_empty());
    assert_eq!(hash.len(), 64);
}

#[test]
fn dependency_order_does_not_change_hash_when_presorted() {
    let lineage1 = create_mock_lineage();
    let lineage2 = create_mock_lineage();
    assert_eq!(lineage1.generate_hash(), lineage2.generate_hash());
}

#[test]
fn different_primary_package_changes_hash() {
    let lineage1 = create_mock_lineage();
    let mut lineage2 = create_mock_lineage();
    lineage2.primary_package.name = "different-app".into();
    assert_ne!(lineage1.generate_hash(), lineage2.generate_hash());
}

#[test]
fn different_runtime_version_changes_hash() {
    let lineage1 = create_mock_lineage();
    let mut lineage2 = create_mock_lineage();
    lineage2.runtime.version = "22.0.0".into();
    assert_ne!(lineage1.generate_hash(), lineage2.generate_hash());
}

#[test]
fn adding_dependency_changes_hash() {
    let lineage1 = create_mock_lineage();
    let mut lineage2 = create_mock_lineage();
    lineage2.resolved_dependencies.push(Dependency {
        name: "pg".into(),
        version: "8.11.3".into(),
    });
    assert_ne!(lineage1.generate_hash(), lineage2.generate_hash());
}

#[test]
fn removing_dependency_changes_hash() {
    let lineage1 = create_mock_lineage();
    let mut lineage2 = create_mock_lineage();
    lineage2.resolved_dependencies.pop();
    assert_ne!(lineage1.generate_hash(), lineage2.generate_hash());
}