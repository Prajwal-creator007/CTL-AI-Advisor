export type DocumentCategory = 
  | 'policy' 
  | 'standard' 
  | 'procedure' 
  | 'control' 
  | 'historical_finding' 
  | 'remediation';

export interface SourceCitation {
  id: string;
  docId: string;
  docTitle: string;
  docCategory: DocumentCategory;
  version: string;
  section: string;
  sectionTitle: string;
  quote: string;
  confidence: number; // 0 - 100
  effectiveDate?: string;
  urlRef?: string;
}

export interface PolicyDocument {
  id: string;
  code: string;
  title: string;
  category: 'policy';
  version: string;
  effectiveDate: string;
  owner: string;
  regulatoryFrameworks: string[]; // e.g. ['SOX 404', 'SOC 2 CC6', 'ISO 27001 A.9']
  summary: string;
  sections: {
    sectionNumber: string;
    title: string;
    content: string;
    keyRequirements: string[];
    controllerFocusPoints: string[];
  }[];
}

export interface StandardDocument {
  id: string;
  code: string;
  title: string;
  category: 'standard';
  version: string;
  effectiveDate: string;
  governingPolicyCode: string;
  owner: string;
  scope: string;
  sections: {
    sectionNumber: string;
    title: string;
    content: string;
    specifications: string[];
    enforcementCriteria: string[];
  }[];
}

export interface ProcedureDocument {
  id: string;
  code: string;
  title: string;
  category: 'procedure';
  version: string;
  effectiveDate: string;
  governingStandardCode: string;
  cadence: string; // e.g. "Quarterly", "Annual", "Trigger-based within 24h"
  ownerRole: string;
  steps: {
    stepNumber: string;
    name: string;
    description: string;
    requiredArtifacts: string[];
    slaTimeline: string;
  }[];
  controllerTestingGuidance: {
    samplingMethod: string;
    sampleSizeGuideline: string;
    failConditions: string[];
  };
}

export interface ControlDefinition {
  id: string;
  code: string; // e.g. "CTL-AC-01"
  name: string;
  category: 'control';
  controlOwner: string;
  frequency: 'Continuous' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual' | 'Event-driven';
  nature: 'Preventive' | 'Detective' | 'Corrective';
  type: 'Automated' | 'Semi-Automated' | 'Manual';
  associatedRisk: {
    riskId: string;
    title: string;
    inherentRiskRating: 'Critical' | 'High' | 'Medium' | 'Low';
    description: string;
    financialOrRegulatoryImpact: string;
  };
  policyLink: string;
  standardLink: string;
  procedureLink: string;
  testingCriteria: string[];
  requiredEvidenceTypes: string[];
}

export interface HistoricalFinding {
  id: string;
  code: string; // e.g. "FND-2024-01"
  category: 'historical_finding';
  auditYear: number;
  auditScope: string; // e.g. "2024 SOX 404 ITGC Audit", "2023 SOC 2 Type II"
  relatedControlCode: string;
  title: string;
  deficiencyClassification: 'Deficiency' | 'Significant Deficiency' | 'Material Weakness';
  rootCause: string;
  auditObservation: string;
  businessImpact: string;
  status: 'Remediated & Closed' | 'Pending Retest' | 'Under Active Remediation';
  closedDate?: string;
  remediationReferenceId: string;
}

export interface RemediationAction {
  id: string;
  code: string; // e.g. "REM-2024-01-B"
  category: 'remediation';
  relatedFindingCode: string;
  relatedControlCode: string;
  actionTitle: string;
  remediationStrategy: string;
  implementationDate: string;
  leadOwner: string;
  verificationEvidence: string;
  retestResult: 'Sustained / Effective' | 'Partially Effective' | 'Failed Retest';
  lessonsLearned: string;
}

export interface EvidenceArtifact {
  id: string;
  title: string;
  controlCode: string;
  period: string;
  artifactType: 'Access Log' | 'Change Ticket' | 'Disaster Recovery Log' | 'Vendor Assessment' | 'System Config';
  rawText: string;
  metadata: Record<string, string>;
  knownAnomalies?: string[];
}

export interface EvidencePreCheckResult {
  controlCode: string;
  overallAdvisory: 'Likely Satisfactory' | 'Exceptions Detected' | 'Insufficient Evidence' | 'Requires Clarification';
  discrepancies: {
    severity: 'High' | 'Medium' | 'Low';
    lineOrItem: string;
    issue: string;
    standardClause: string;
    historicalPrecedent?: string;
  }[];
  conformingItems: string[];
  groundedCitations: SourceCitation[];
  controllerTestingChecklist: {
    item: string;
    status: 'Verified in Evidence' | 'Not Found in Artifact' | 'Discrepancy';
    notes: string;
  }[];
  regulatoryCaution: string;
}

export interface ControllerWorkpaper {
  id: string;
  controlCode: string;
  controlName: string;
  assessmentPeriod: string;
  controllerName: string;
  controllerEmail: string;
  assessmentDate: string;
  populationCount: number;
  sampleSize: number;
  testConclusion: 'Effective (Pass)' | 'Exception Noted (Conditional)' | 'Ineffective (Fail)' | 'Significant Deficiency';
  testRationale: string;
  evidenceReviewedIds: string[];
  findingsCreated?: {
    findingTitle: string;
    severity: 'Deficiency' | 'Significant Deficiency' | 'Material Weakness';
    description: string;
    managementActionPlan: string;
    targetClosureDate: string;
  };
  riskAcceptance?: {
    isRiskAccepted: boolean;
    approver: string;
    businessJustification: string;
    expiryDate: string;
  };
  aiAdvisoryReferenceSummary?: string;
  citationsUtilized: SourceCitation[];
}

export interface SynthesisComparisonItem {
  tier: 'Policy' | 'Standard' | 'Procedure';
  docCode: string;
  title: string;
  coreMandate: string;
  slaOrMetric: string;
  enforcementMechanism: string;
  evidenceGenerated: string;
}

export interface SynthesisDivergenceItem {
  id: string;
  parameter: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  policyBaseline: string;
  standardSpecification: string;
  procedureExecution: string;
  divergenceNature: string;
  riskExposure: string;
  controllerRecommendation: string;
}

export interface SynthesisAuditTestStep {
  stepNumber: string;
  objective: string;
  populationDefinition: string;
  recommendedSampleSize: string;
  requiredEvidence: string;
  passCondition: string;
  failCondition: string;
}

export interface SynthesisResult {
  synthesizedBaseline: string;
  focusTopic: string;
  inScopeDocumentCodes: string[];
  hierarchyComparison: SynthesisComparisonItem[];
  divergencesAndGaps: SynthesisDivergenceItem[];
  auditTestingProgram: SynthesisAuditTestStep[];
  testingBenchmark: string;
  statutoryNotice: string;
}

export interface AssistantQueryResponse {
  answer: string;
  summary: string;
  citations: SourceCitation[];
  controllerAdvisory: string;
  relatedHistoricalIssues: HistoricalFinding[];
  relatedRemediations: RemediationAction[];
  governanceReminder: string;
  confidenceScore: number;
}
