/**
 * Agent Statistics Calculation
 * Issue 12: Calculate stats from data arrays instead of storing counters
 */

import type { User } from '../types';
import { getInquiries, getProperties } from './storage';

export interface AgentStats {
  agentId: number;
  agentName: string;
  activeInquiries: number;
  totalInquiries: number;
  propertiesSold: number;
  totalCommission: number;
  avgCommission: number;
  successRate: number;
  viewingsScheduled: number;
  depositsReceived: number;
}

/**
 * Calculate statistics for a specific agent
 */
export function calculateAgentStats(agentId: number, agentName: string): AgentStats {
  const inquiries = getInquiries();
  const properties = getProperties();

  // Filter inquiries for this agent
  const agentInquiries = inquiries.filter((inq) => inq.assignedAgentId === agentId);

  // Active inquiries (not Successful or Cancelled)
  const activeInquiries = agentInquiries.filter(
    (inq) => inq.status !== 'Successful' && inq.status !== 'Cancelled'
  ).length;

  // Successful inquiries
  const successfulInquiries = agentInquiries.filter(
    (inq) => inq.status === 'Successful'
  );

  // Properties sold by this agent
  const soldProperties = properties.filter((prop) => {
    if (prop.status !== 'Sold') return false;
    // Check if this agent had a successful inquiry for this property
    return successfulInquiries.some((inq) => inq.propertyId === prop.id);
  });

  // Calculate total commission
  const totalCommission = soldProperties.reduce((sum, prop) => {
    return sum + (prop.finalCommission || prop.commission);
  }, 0);

  // Average commission
  const avgCommission =
    soldProperties.length > 0 ? totalCommission / soldProperties.length : 0;

  // Success rate (successful / total non-cancelled)
  const nonCancelledInquiries = agentInquiries.filter(
    (inq) => inq.status !== 'Cancelled'
  );
  const successRate =
    nonCancelledInquiries.length > 0
      ? (successfulInquiries.length / nonCancelledInquiries.length) * 100
      : 0;

  // Viewings scheduled
  const viewingsScheduled = agentInquiries.filter(
    (inq) =>
      inq.status === 'Viewing Scheduled' ||
      inq.status === 'Viewed - Interested' ||
      inq.status === 'Viewed - Not Interested' ||
      inq.status === 'Viewed - Undecided' ||
      inq.status === 'Deposit Paid' ||
      inq.status === 'Successful'
  ).length;

  // Deposits received
  const depositsReceived = agentInquiries.filter(
    (inq) => inq.status === 'Deposit Paid' || inq.status === 'Successful'
  ).length;

  return {
    agentId,
    agentName,
    activeInquiries,
    totalInquiries: agentInquiries.length,
    propertiesSold: soldProperties.length,
    totalCommission,
    avgCommission,
    successRate,
    viewingsScheduled,
    depositsReceived,
  };
}

/**
 * Calculate statistics for all agents
 */
export function calculateAllAgentStats(agents: User[]): AgentStats[] {
  return agents
    .filter((user) => user.role === 'agent')
    .map((agent) => calculateAgentStats(agent.id, agent.name));
}

/**
 * Get top performing agents by commission
 */
export function getTopAgentsByCommission(limit: number = 5): AgentStats[] {
  const inquiries = getInquiries();
  
  // Get all agents from inquiries
  const agentMap = new Map<number, { id: number; name: string }>();
  inquiries.forEach((inq) => {
    if (inq.assignedAgentId && inq.assignedAgentName) {
      agentMap.set(inq.assignedAgentId, {
        id: inq.assignedAgentId,
        name: inq.assignedAgentName,
      });
    }
  });

  const stats = Array.from(agentMap.values()).map((agent) =>
    calculateAgentStats(agent.id, agent.name)
  );

  return stats.sort((a, b) => b.totalCommission - a.totalCommission).slice(0, limit);
}

/**
 * Get agents with high workload (20+ active inquiries)
 */
export function getOverloadedAgents(): AgentStats[] {
  const inquiries = getInquiries();
  
  const agentMap = new Map<number, { id: number; name: string }>();
  inquiries.forEach((inq) => {
    if (inq.assignedAgentId && inq.assignedAgentName) {
      agentMap.set(inq.assignedAgentId, {
        id: inq.assignedAgentId,
        name: inq.assignedAgentName,
      });
    }
  });

  const stats = Array.from(agentMap.values()).map((agent) =>
    calculateAgentStats(agent.id, agent.name)
  );

  return stats.filter((s) => s.activeInquiries >= 20);
}

/**
 * Calculate global statistics
 */
export function calculateGlobalStats(): {
  totalInquiries: number;
  activeInquiries: number;
  totalProperties: number;
  availableProperties: number;
  propertiesSold: number;
  totalCommission: number;
  successRate: number;
} {
  const inquiries = getInquiries();
  const properties = getProperties();

  const activeInquiries = inquiries.filter(
    (inq) => inq.status !== 'Successful' && inq.status !== 'Cancelled'
  ).length;

  const successfulInquiries = inquiries.filter((inq) => inq.status === 'Successful').length;

  const soldProperties = properties.filter((prop) => prop.status === 'Sold');

  const totalCommission = soldProperties.reduce((sum, prop) => {
    return sum + (prop.finalCommission || prop.commission);
  }, 0);

  const nonCancelledInquiries = inquiries.filter((inq) => inq.status !== 'Cancelled').length;
  const successRate =
    nonCancelledInquiries > 0 ? (successfulInquiries / nonCancelledInquiries) * 100 : 0;

  return {
    totalInquiries: inquiries.length,
    activeInquiries,
    totalProperties: properties.length,
    availableProperties: properties.filter((p) => p.status === 'Available').length,
    propertiesSold: soldProperties.length,
    totalCommission,
    successRate,
  };
}
