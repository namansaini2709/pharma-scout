import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register a standard font (optional, using default Helvetica for now)
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981', // Primary Green
  },
  confidential: {
    fontSize: 10,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginTop: 8,
  },
  titleSection: {
    marginBottom: 20,
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 15,
    marginBottom: 25,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 4,
  },
  text: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.5,
    marginBottom: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletDot: {
    width: 4,
    height: 4,
    backgroundColor: '#6B7280',
    borderRadius: 2,
    marginRight: 8,
    marginTop: 6,
  },
  bulletText: {
    fontSize: 11,
    color: '#374151',
    flex: 1,
  },
  agentLog: {
    marginTop: 4,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  agentName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 2,
  },
  agentText: {
    fontSize: 9,
    color: '#4B5563',
    fontFamily: 'Courier',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
});

interface ScoreCard {
  scientific_fit: number;
  commercial_potential: number;
  ip_risk: number;
  supply_feasibility: number;
  overall_score: number;
}

interface Narrative {
  summary: string;
  recommendation: string;
  rationale: { [key: string]: string };
  risks: string[];
  next_steps: string[];
}

interface AgentSummary {
  agent_name: string;
  status: string;
  summary: string;
  key_findings: string[];
}

interface JobResult {
  job_id: string;
  query: string;
  status: string;
  scores: ScoreCard;
  narrative: Narrative;
  agent_details: AgentSummary[];
}

// Ensure the types match what's passed from Dashboard
export const ReportDocument = ({ data }: { data: JobResult }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Pharma Scout Copilot</Text>
        <Text style={styles.confidential}>CONFIDENTIAL • INTERNAL USE ONLY</Text>
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.reportTitle}>Opportunity Analysis: {data.query}</Text>
        <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()} • Job ID: {data.job_id.slice(0, 8)}</Text>
      </View>

      {/* Main Scorecard */}
      <View style={styles.scoreSection}>
        <View style={styles.scoreItem}>
          <Text style={{ ...styles.scoreValue, color: '#10b981' }}>{data.scores.overall_score}</Text>
          <Text style={styles.scoreLabel}>Overall Score</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{data.narrative.recommendation.replace("_", " ")}</Text>
          <Text style={styles.scoreLabel}>Recommendation</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{data.scores.scientific_fit}</Text>
          <Text style={styles.scoreLabel}>Scientific</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{data.scores.commercial_potential}</Text>
          <Text style={styles.scoreLabel}>Commercial</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{data.scores.ip_risk}</Text>
          <Text style={styles.scoreLabel}>IP Risk</Text>
        </View>
      </View>

      {/* Executive Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <Text style={styles.text}>{data.narrative.summary}</Text>
      </View>

      {/* Rationale Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detailed Rationale</Text>
        <Text style={{...styles.text, fontWeight: 'bold'}}>Scientific Fit:</Text>
        <Text style={styles.text}>{data.narrative.rationale.scientific}</Text>
        
        <Text style={{...styles.text, fontWeight: 'bold', marginTop: 5}}>Commercial Potential:</Text>
        <Text style={styles.text}>{data.narrative.rationale.commercial}</Text>

        <Text style={{...styles.text, fontWeight: 'bold', marginTop: 5}}>IP & Legal:</Text>
        <Text style={styles.text}>{data.narrative.rationale.ip}</Text>
      </View>

      {/* Risks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Risks</Text>
        {data.narrative.risks.map((risk, i) => (
          <View key={i} style={styles.bulletPoint}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{risk}</Text>
          </View>
        ))}
      </View>

      {/* Agent Findings (Mini Logs) */}
      <View style={{...styles.section, marginTop: 10}}>
        <Text style={styles.sectionTitle}>Intelligence Source Logs</Text>
        {data.agent_details.map((agent, i) => (
          <View key={i} style={styles.agentLog}>
            <Text style={styles.agentName}>{agent.agent_name}</Text>
            <Text style={styles.agentText}>{agent.summary}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Generated by Pharma Scout AI • Data is for informational purposes only. Do not rely for clinical decisions.
      </Text>

    </Page>
  </Document>
);
