use crate::tracer::CanonicalLineage;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AttributionNode {
    pub package: String,
    pub weight: f64,
    pub role: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AttributionMap {
    pub model_version: String,
    pub weighting_strategy: String,
    pub weighting_confidence: String,
    pub total_weight: f64,
    pub nodes: Vec<AttributionNode>,
}

impl AttributionMap {
    pub fn calculate_v0(lineage: &CanonicalLineage) -> Self {
        let mut nodes = Vec::new();
        let primary_weight = 0.40;
        nodes.push(AttributionNode {
            package: lineage.primary_package.name.clone(),
            weight: primary_weight,
            role: "primary".to_string(),
        });

        let dep_count = lineage.resolved_dependencies.len() as f64;
        if dep_count > 0.0 {
            let split_weight = 0.60 / dep_count;
            for dep in &lineage.resolved_dependencies {
                nodes.push(AttributionNode {
                    package: dep.name.clone(),
                    weight: (split_weight * 10000.0).round() / 10000.0,
                    role: "dependency".to_string(),
                });
            }
        } else {
            nodes[0].weight = 1.0;
        }

        AttributionMap {
            model_version: "0.1".to_string(),
            weighting_strategy: "primary_40_equal_split_60".to_string(),
            weighting_confidence: "experimental".to_string(),
            total_weight: 1.0,
            nodes,
        }
    }

    pub fn simulate_royalties(&self, pool_amount: f64) -> Vec<SimulatedRoyalty> {
        self.nodes.iter().map(|node| SimulatedRoyalty {
            package: node.package.clone(),
            weight: node.weight,
            role: node.role.clone(),
            simulated_amount: (node.weight * pool_amount * 100.0).round() / 100.0,
        }).collect()
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SimulatedRoyalty {
    pub package: String,
    pub weight: f64,
    pub role: String,
    pub simulated_amount: f64,
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::tracer::CanonicalLineage;

    #[test]
    fn weights_sum_to_one() {
        let lineage = CanonicalLineage::mock();
        let map = AttributionMap::calculate_v0(&lineage);
        let total: f64 = map.nodes.iter().map(|n| n.weight).sum();
        assert!((total - 1.0).abs() < 0.001);
    }

    #[test]
    fn primary_gets_40_percent() {
        let lineage = CanonicalLineage::mock();
        let map = AttributionMap::calculate_v0(&lineage);
        assert_eq!(map.nodes[0].role, "primary");
        assert!((map.nodes[0].weight - 0.40).abs() < 0.001);
    }

    #[test]
    fn dependencies_split_60_percent() {
        let lineage = CanonicalLineage::mock();
        let map = AttributionMap::calculate_v0(&lineage);
        let dep_total: f64 = map.nodes.iter().filter(|n| n.role == "dependency").map(|n| n.weight).sum();
        assert!((dep_total - 0.60).abs() < 0.001);
    }

    #[test]
    fn simulated_royalties_sum_correctly() {
        let lineage = CanonicalLineage::mock();
        let map = AttributionMap::calculate_v0(&lineage);
        let royalties = map.simulate_royalties(1.00);
        let total: f64 = royalties.iter().map(|r| r.simulated_amount).sum();
        assert!((total - 1.00).abs() < 0.02);
    }
}