import { createHash } from 'crypto';
import { buildLineagePayload, type CanonicalLineage } from './utils/dependency-graph.js';

export interface LeaseRequest {
  tenant_id: string;
  lineage_hash: string;
  capabilities: string[];
}

export interface LeaseResponse {
  lease_id: string;
  token: string;
  expires_at: string;
  capabilities: string[];
  lineage_hash: string;
}

export interface RoyaltyClient {
  collectorUrl: string;
  tenantId: string;
}

/**
 * Acquire a capability-based execution lease from the Royalty Collector.
 * The lease binds a JWT token to tenant identity, canonical lineage hash,
 * capabilities, and a short TTL (15 minutes).
 */
export async function acquireExecutionLease(
  client: RoyaltyClient,
  lineage?: CanonicalLineage,
): Promise<LeaseResponse> {
  const resolvedLineage = lineage || buildLineagePayload();
  const canonical = JSON.stringify(resolvedLineage);
  const lineageHash = createHash('sha256').update(canonical).digest('hex');

  const request: LeaseRequest = {
    tenant_id: client.tenantId,
    lineage_hash: lineageHash,
    capabilities: ['premium_execution', 'full_concurrency', 'priority_attribution'],
  };

  const response = await fetch(`${client.collectorUrl}/v1/leases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Lease acquisition failed (${response.status}): ${body}`);
  }

  return response.json() as Promise<LeaseResponse>;
}

/**
 * Client-side structural validation of a lease token.
 * Does NOT verify signature — only checks expiration and required fields.
 */
export function isLeaseStructurallyValid(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8'),
    );

    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;
    if (!payload.sub || !payload.lineage_hash || !payload.capabilities) return false;

    return true;
  } catch {
    return false;
  }
}