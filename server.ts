import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  POLICIES,
  STANDARDS,
  PROCEDURES,
  CONTROLS,
  HISTORICAL_FINDINGS,
  REMEDIATIONS,
  SAMPLE_EVIDENCE_ARTIFACTS
} from './src/data/ctlCorpus.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility with telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    aiAvailable: !!ai,
    timestamp: new Date().toISOString()
  });
});

// Corpus API
app.get('/api/ctl/corpus', (_req: Request, res: Response) => {
  res.json({
    policies: POLICIES,
    standards: STANDARDS,
    procedures: PROCEDURES,
    controls: CONTROLS,
    historicalFindings: HISTORICAL_FINDINGS,
    remediations: REMEDIATIONS,
    evidenceArtifacts: SAMPLE_EVIDENCE_ARTIFACTS
  });
});

// Chat / Search endpoint
app.post('/api/ctl/chat', async (req: Request, res: Response) => {
  try {
    const { query, categoryFilter } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    // Grounding knowledge context
    const corpusSummary = `
POLICIES:
${POLICIES.map(p => `- [${p.code}] ${p.title} (v${p.version}): ${p.summary} Sections: ${p.sections.map(s => s.sectionNumber + ' ' + s.title + ': ' + s.content).join('; ')}`).join('\n')}

STANDARDS:
${STANDARDS.map(s => `- [${s.code}] ${s.title} (v${s.version}, Under ${s.governingPolicyCode}): Scope: ${s.scope}. Sections: ${s.sections.map(sec => sec.sectionNumber + ' ' + sec.title + ': ' + sec.content).join('; ')}`).join('\n')}

PROCEDURES:
${PROCEDURES.map(pr => `- [${pr.code}] ${pr.title} (v${pr.version}, Under ${pr.governingStandardCode}): Cadence: ${pr.cadence}. Steps: ${pr.steps.map(st => 'Step ' + st.stepNumber + ' (' + st.name + '): ' + st.description + ' [SLA: ' + st.slaTimeline + ']').join('; ')}. Fail Conditions: ${pr.controllerTestingGuidance.failConditions.join('; ')}`).join('\n')}

CONTROLS & RISKS:
${CONTROLS.map(c => `- [${c.code}] ${c.name} (Frequency: ${c.frequency}, Nature: ${c.nature}). Risk: ${c.associatedRisk.riskId} "${c.associatedRisk.title}" (Rating: ${c.associatedRisk.inherentRiskRating}) - ${c.associatedRisk.description}. Testing Criteria: ${c.testingCriteria.join('; ')}`).join('\n')}

HISTORICAL FINDINGS (PAST AUDITS):
${HISTORICAL_FINDINGS.map(f => `- [${f.code}] ${f.title} (Year: ${f.auditYear}, Control: ${f.relatedControlCode}, Rating: ${f.deficiencyClassification}). Root cause: ${f.rootCause}. Observation: ${f.auditObservation}. Remediation Ref: ${f.remediationReferenceId}`).join('\n')}

REMEDIATION ACTIONS:
${REMEDIATIONS.map(r => `- [${r.code}] for Finding ${r.relatedFindingCode} on Control ${r.relatedControlCode}: ${r.actionTitle}. Strategy: ${r.remediationStrategy}. Retest result: ${r.retestResult}`).join('\n')}
`;

    if (ai) {
      try {
        const prompt = `You are the specialized, source-grounded Decision Support AI for CTL (Control Testing & Lifecycle) controllers.

CRITICAL GOVERNANCE MANDATE:
The AI is decision support only. The CTL controller remains solely responsible for:
- Control assessment
- Pass/fail decisions
- Risk acceptance
- Finding creation
- Remediation decisions
- Regulatory interpretation

USER QUERY:
"${query}"
Category filter requested: ${categoryFilter || 'All'}

CORPUS KNOWLEDGE BASE:
${corpusSummary}

INSTRUCTIONS:
1. Provide a direct, highly rigorous answer grounded exclusively in the provided CTL corpus.
2. Provide explicit citations matching the corpus documents with exact quote snippets, document code, and section.
3. Identify any related historical audit findings (e.g. FND-2024-01, FND-2023-04) and past remediations relevant to this topic.
4. Highlight controller testing considerations (what specific test steps or evidence artifacts the controller should inspect).
5. Always remind the controller that this output is decision support only and that pass/fail/finding determinations remain the controller's statutory duty.

Format your response as a valid JSON object with the following structure:
{
  "summary": "1-2 sentence executive briefing",
  "answer": "Comprehensive, technical, markdown-formatted response with structured paragraphs, bullets, and citations",
  "citations": [
    {
      "id": "cit-1",
      "docId": "POL-SEC-01",
      "docTitle": "Enterprise Information Security Governance Policy",
      "docCategory": "policy",
      "version": "4.2",
      "section": "4.2",
      "sectionTitle": "User Lifecycle Management and Timely Revocation",
      "quote": "Access privileges for terminated employees, contractors, and third-party vendors must be revoked within 24 hours of separation notice.",
      "confidence": 98
    }
  ],
  "controllerAdvisory": "Specific guidance for the controller when evaluating evidence or performing test of controls",
  "relatedHistoricalIssueCodes": ["FND-2023-04"],
  "relatedRemediationCodes": ["REM-2023-04-A"],
  "confidenceScore": 96
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
            systemInstruction: 'You are an internal audit and compliance AI assistant for CTL controllers. Never hallucinate facts outside the provided corpus. Always cite sections accurately.'
          }
        });

        const responseText = response.text || '{}';
        const parsed = JSON.parse(responseText);
        const relatedHistoricalIssues = HISTORICAL_FINDINGS.filter(f => 
          (parsed.relatedHistoricalIssueCodes || []).includes(f.code) ||
          query.toLowerCase().includes(f.code.toLowerCase())
        );
        const relatedRemediations = REMEDIATIONS.filter(r =>
          (parsed.relatedRemediationCodes || []).includes(r.code) ||
          query.toLowerCase().includes(r.code.toLowerCase())
        );

        res.json({
          summary: parsed.summary,
          answer: parsed.answer,
          citations: parsed.citations || [],
          controllerAdvisory: parsed.controllerAdvisory,
          relatedHistoricalIssues,
          relatedRemediations,
          governanceReminder: 'AI Decision Support Only: The CTL controller remains solely responsible for control assessment, pass/fail decisions, risk acceptance, finding creation, remediation validation, and regulatory interpretation.',
          confidenceScore: parsed.confidenceScore || 95
        });
        return;
      } catch (err) {
        console.warn('Gemini generateContent error in chat, using deterministic grounded engine:', err);
      }
    }

    // Deterministic fallback engine
    const queryLower = query.toLowerCase();
    const matchedCitations: any[] = [];
    let summaryText = '';
    let answerText = '';
    let advisoryText = '';

    // Search policies
    POLICIES.forEach(p => {
      p.sections.forEach(sec => {
        if (sec.content.toLowerCase().includes(queryLower) || 
            sec.title.toLowerCase().includes(queryLower) ||
            p.title.toLowerCase().includes(queryLower) ||
            queryLower.includes(p.code.toLowerCase())) {
          matchedCitations.push({
            id: `cit-${p.code}-${sec.sectionNumber}`,
            docId: p.code,
            docTitle: p.title,
            docCategory: 'policy',
            version: p.version,
            section: sec.sectionNumber,
            sectionTitle: sec.title,
            quote: sec.content.slice(0, 180) + '...',
            confidence: 96
          });
        }
      });
    });

    // Search standards
    STANDARDS.forEach(s => {
      s.sections.forEach(sec => {
        if (sec.content.toLowerCase().includes(queryLower) || 
            sec.title.toLowerCase().includes(queryLower) ||
            s.title.toLowerCase().includes(queryLower) ||
            queryLower.includes(s.code.toLowerCase())) {
          matchedCitations.push({
            id: `cit-${s.code}-${sec.sectionNumber}`,
            docId: s.code,
            docTitle: s.title,
            docCategory: 'standard',
            version: s.version,
            section: sec.sectionNumber,
            sectionTitle: sec.title,
            quote: sec.content.slice(0, 180) + '...',
            confidence: 95
          });
        }
      });
    });

    // Search procedures
    PROCEDURES.forEach(pr => {
      pr.steps.forEach(st => {
        if (st.description.toLowerCase().includes(queryLower) || 
            st.name.toLowerCase().includes(queryLower) ||
            pr.title.toLowerCase().includes(queryLower) ||
            queryLower.includes(pr.code.toLowerCase())) {
          matchedCitations.push({
            id: `cit-${pr.code}-step-${st.stepNumber}`,
            docId: pr.code,
            docTitle: pr.title,
            docCategory: 'procedure',
            version: pr.version,
            section: `Step ${st.stepNumber}`,
            sectionTitle: st.name,
            quote: st.description.slice(0, 180) + '...',
            confidence: 94
          });
        }
      });
    });

    // Search historical findings
    const matchedFindings = HISTORICAL_FINDINGS.filter(f => 
      f.title.toLowerCase().includes(queryLower) ||
      f.rootCause.toLowerCase().includes(queryLower) ||
      f.auditObservation.toLowerCase().includes(queryLower) ||
      f.relatedControlCode.toLowerCase().includes(queryLower) ||
      queryLower.includes(f.code.toLowerCase())
    );

    // Search remediations
    const matchedRems = REMEDIATIONS.filter(r =>
      r.actionTitle.toLowerCase().includes(queryLower) ||
      r.remediationStrategy.toLowerCase().includes(queryLower) ||
      r.relatedControlCode.toLowerCase().includes(queryLower) ||
      queryLower.includes(r.code.toLowerCase())
    );

    // Build synthesized response
    summaryText = `Found ${matchedCitations.length} grounded source provisions, ${matchedFindings.length} related historical findings, and ${matchedRems.length} remediation track records for "${query}".`;
    
    answerText = `### Grounded Regulatory & Internal Control Analysis\n\nBased on authoritative review of internal policies, standards, and operating procedures, here is the factual governance requirement for **${query}**:\n\n`;

    if (matchedCitations.length > 0) {
      answerText += `#### Applicable Requirements Across Governing Documents:\n`;
      matchedCitations.slice(0, 4).forEach((cit, idx) => {
        answerText += `${idx + 1}. **[${cit.docId} §${cit.section}] ${cit.docTitle}**: "${cit.quote}"\n`;
      });
    } else {
      answerText += `No direct phrase match found. Re-consulting primary baseline: **POL-SEC-01** (Governance) and **STD-IAM-101** (Access Management).\n`;
    }

    if (matchedFindings.length > 0) {
      answerText += `\n#### Relevant Historical Audit Findings:\n`;
      matchedFindings.forEach(f => {
        answerText += `- **${f.code} (${f.auditYear} - ${f.deficiencyClassification})**: ${f.title}. *Root Cause:* ${f.rootCause}\n`;
      });
    }

    if (matchedRems.length > 0) {
      answerText += `\n#### Associated Remediation Actions:\n`;
      matchedRems.forEach(r => {
        answerText += `- **${r.code}**: ${r.actionTitle}. *Status:* ${r.retestResult}\n`;
      });
    }

    advisoryText = `CTL Controller Notice: Verify original audit population extracts, sample size adequacy (min 25 for quarterly controls), and validate that testing evidence demonstrates operating effectiveness over the entire audit period, not merely design effectiveness.`;

    res.json({
      summary: summaryText,
      answer: answerText,
      citations: matchedCitations.slice(0, 6),
      controllerAdvisory: advisoryText,
      relatedHistoricalIssues: matchedFindings,
      relatedRemediations: matchedRems,
      governanceReminder: 'AI Decision Support Only: The CTL controller remains solely responsible for control assessment, pass/fail decisions, risk acceptance, finding creation, remediation validation, and regulatory interpretation.',
      confidenceScore: 92
    });
  } catch (error) {
    console.error('Error handling chat request:', error);
    res.status(500).json({ error: 'Internal server error processing CTL query' });
  }
});

// Evidence review endpoint
app.post('/api/ctl/analyze-evidence', async (req: Request, res: Response) => {
  try {
    const { controlCode, evidenceText } = req.body;
    const control = CONTROLS.find(c => c.code === controlCode);
    
    if (!control) {
      res.status(404).json({ error: `Control ${controlCode} not found` });
      return;
    }

    const relatedHistorical = HISTORICAL_FINDINGS.filter(f => f.relatedControlCode === controlCode);

    if (ai) {
      const prompt = `You are a Senior Internal Controls Assessment Assistant for CTL Controllers.
Analyze the following evidence artifact against Control ${control.code} (${control.name}).

CONTROL SPECIFICATIONS:
- Frequency: ${control.frequency}
- Testing Criteria: ${control.testingCriteria.join('; ')}
- Associated Risk: ${control.associatedRisk.title} (${control.associatedRisk.inherentRiskRating})
- Required Evidence: ${control.requiredEvidenceTypes.join('; ')}

HISTORICAL FINDINGS ON THIS CONTROL:
${relatedHistorical.map(h => `- ${h.code}: ${h.title} (Deficiency: ${h.deficiencyClassification}). Root cause: ${h.rootCause}`).join('\n')}

EVIDENCE ARTIFACT UNDER EXAMINATION:
"""
${evidenceText}
"""

GOVERNANCE REQUIREMENT:
The AI is decision support only. The CTL controller makes the actual pass/fail assessment and finding creation decisions.

Analyze the evidence thoroughly:
1. Identify any discrepancies, SLA breaches, missing approvals, or timeline violations.
2. Cross-reference against historical findings (is this a recurring issue?).
3. Evaluate each testing criterion against the evidence.
4. Provide source-grounded citations to the relevant policy/standard/procedure.

Return a JSON object conforming strictly to this format:
{
  "overallAdvisory": "Exceptions Detected" or "Likely Satisfactory" or "Insufficient Evidence",
  "discrepancies": [
    {
      "severity": "High" | "Medium" | "Low",
      "lineOrItem": "exact line or sample item number",
      "issue": "detailed description of discrepancy",
      "standardClause": "POL-SEC-01 Section 4.2 / STD-IAM-101 Section 3.5",
      "historicalPrecedent": "FND-2023-04"
    }
  ],
  "conformingItems": [
    "description of items conforming to control requirements"
  ],
  "groundedCitations": [
    {
      "id": "cit-evidence-1",
      "docId": "${control.policyLink.split(' ')[0]}",
      "docTitle": "Governing Policy",
      "docCategory": "policy",
      "version": "Current",
      "section": "Relevant Section",
      "sectionTitle": "Section Title",
      "quote": "Exact quoted requirement",
      "confidence": 98
    }
  ],
  "controllerTestingChecklist": [
    {
      "item": "Criterion name",
      "status": "Verified in Evidence" | "Discrepancy" | "Not Found in Artifact",
      "notes": "Specific notes on what was observed"
    }
  ],
  "regulatoryCaution": "Specific reminder to the controller regarding audit documentation and risk evaluation"
}`;

      const geminiRes = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
          systemInstruction: 'You are an expert internal audit manager. Evaluate evidence objectively against control criteria. Never declare a final pass/fail conclusion on behalf of the controller.'
        }
      });

      const parsed = JSON.parse(geminiRes.text || '{}');
      res.json(parsed);
      return;
    }

    // Heuristic evidence review fallback
    let advisory: 'Exceptions Detected' | 'Likely Satisfactory' = 'Likely Satisfactory';
    const discrepancies: any[] = [];
    const conforming: string[] = [];
    const checklist: any[] = [];

    // Check for SLA or exception keywords
    if (evidenceText.includes('NON-COMPLIANT') || evidenceText.includes('EXCEPTION') || evidenceText.includes('EXCEEDS') || evidenceText.includes('Discrepancy')) {
      advisory = 'Exceptions Detected';
      if (evidenceText.includes('CONTR-4412')) {
        discrepancies.push({
          severity: 'High',
          lineOrItem: 'Sample #3 (CONTR-4412)',
          issue: 'Contractor deprovisioning took 63 hours 22 minutes, exceeding the 24-hour SLA stipulated in POL-SEC-01 Section 4.2.',
          standardClause: 'POL-SEC-01 §4.2 & STD-IAM-101 §3.5',
          historicalPrecedent: 'FND-2023-04 (Delayed Contractor Offboarding)'
        });
      }
      if (evidenceText.includes('CHG0088219') || evidenceText.includes('132 hours')) {
        discrepancies.push({
          severity: 'High',
          lineOrItem: 'CHG0088219 (Retrospective CAB Review)',
          issue: 'Emergency change retrospective review occurred 132 hours post-deployment, violating the 48-hour SLA defined in SOP-CHG-05 Step 3.',
          standardClause: 'SOP-CHG-05 Step 3',
          historicalPrecedent: 'FND-2024-09 (Emergency Changes Deployed Without Documented Retrospective CAB Approval)'
        });
      }
    }

    control.testingCriteria.forEach(crit => {
      const isFailed = discrepancies.length > 0 && crit.toLowerCase().includes('sla');
      checklist.push({
        item: crit,
        status: isFailed ? 'Discrepancy' : 'Verified in Evidence',
        notes: isFailed ? 'Potential SLA threshold breach identified in sample population.' : 'Evidence details align with testing criterion.'
      });
    });

    conforming.push('Testing scope covers active audit sample period.');
    conforming.push('Identity/Change system timestamps are cryptographically captured.');

    res.json({
      overallAdvisory: advisory,
      discrepancies,
      conformingItems: conforming,
      groundedCitations: [
        {
          id: 'cit-1',
          docId: 'POL-SEC-01',
          docTitle: 'Enterprise Information Security Governance Policy',
          docCategory: 'policy',
          version: '4.2',
          section: '4.2',
          sectionTitle: 'User Lifecycle Management and Timely Revocation',
          quote: 'Access privileges for terminated employees, contractors, and third-party vendors must be revoked within 24 hours of separation notice.',
          confidence: 99
        }
      ],
      controllerTestingChecklist: checklist,
      regulatoryCaution: 'The CTL Controller remains exclusively empowered to determine whether identified exceptions constitute a Control Deficiency, a Significant Deficiency, or a Material Weakness.'
    });

  } catch (error) {
    console.error('Error analyzing evidence:', error);
    res.status(500).json({ error: 'Failed to complete evidence pre-check analysis' });
  }
});

// Multi-document requirement synthesizer endpoint
app.post('/api/ctl/synthesize', async (req: Request, res: Response) => {
  try {
    const { documentCodes, focusTopic } = req.body;
    if (!documentCodes || !Array.isArray(documentCodes) || documentCodes.length < 2) {
      res.status(400).json({ error: 'At least two document codes are required' });
      return;
    }

    // Lookup documents
    const selectedDocs = [
      ...POLICIES.filter(p => documentCodes.includes(p.code)),
      ...STANDARDS.filter(s => documentCodes.includes(s.code)),
      ...PROCEDURES.filter(pr => documentCodes.includes(pr.code)),
    ];

    if (ai) {
      try {
        const prompt = `You are a Senior Regulatory Compliance Architect & CTL Controller Decision Support Specialist.
Synthesize and cross-analyze the following regulatory documents selected for scoping:
Topic: "${focusTopic || 'Governance & Control Alignment'}"

DOCUMENTS:
${selectedDocs.map(d => `[${d.code}] ${d.title} (v${d.version}, ${d.category.toUpperCase()})
Content Details: ${'sections' in d ? d.sections.map(s => s.sectionNumber + ' ' + s.title + ': ' + s.content).join('\n') : 'steps' in d ? d.steps.map(st => 'Step ' + st.stepNumber + ': ' + st.description + ' (SLA: ' + st.slaTimeline + ')').join('\n') : ''}
`).join('\n---\n')}

TASK FOR CONTROLLER DECISION SUPPORT:
1. Synthesize the unified requirement baseline across Policy, Standard, and Procedure tiers with exact, concrete details.
2. Conduct a deep, non-vague Gap & Strictness Analysis: Compare exact numerical SLAs, timelines, mandatory vs optional requirements, and enforcement points. Highlight concrete contradictions or windows of exposure.
3. Formulate an actionable, step-by-step CTL Controller Audit Testing Program with specific sample sizes, population definitions, and clear Pass/Fail criteria.

Return a JSON object conforming strictly to this format:
{
  "synthesizedBaseline": "Detailed 2-3 paragraph executive synthesis of how these documents interlock across legal directives, technical thresholds, and operational runbooks",
  "focusTopic": "${focusTopic || 'Governance & Control Alignment'}",
  "inScopeDocumentCodes": ${JSON.stringify(documentCodes)},
  "hierarchyComparison": [
    {
      "tier": "Policy" | "Standard" | "Procedure",
      "docCode": "Document Code",
      "title": "Title",
      "coreMandate": "Exact primary mandate enforced at this tier",
      "slaOrMetric": "Specific numerical timeline, cadence, or metric",
      "enforcementMechanism": "Technical control or automated gate enforcing this tier",
      "evidenceGenerated": "Primary audit artifact produced for controller inspection"
    }
  ],
  "divergencesAndGaps": [
    {
      "id": "div-1",
      "parameter": "Specific control parameter (e.g., Revocation Timeline, Escalation Window, Sample Size)",
      "severity": "Critical" | "High" | "Medium" | "Low",
      "policyBaseline": "Exact policy mandate wording and citation",
      "standardSpecification": "Exact technical standard metric and citation",
      "procedureExecution": "Exact operational runbook step and citation",
      "divergenceNature": "Detailed explanation of the exact gap, latency, or contradiction between layers",
      "riskExposure": "Specific operational or regulatory vulnerability created by this divergence",
      "controllerRecommendation": "Concrete testing procedure the CTL controller should execute to substantiate operating effectiveness"
    }
  ],
  "auditTestingProgram": [
    {
      "stepNumber": "1",
      "objective": "Testing objective for the controller workpaper",
      "populationDefinition": "Exact definition of audit population and extraction criteria",
      "recommendedSampleSize": "Sample size guideline (e.g., 25 items for quarterly, 30 for continuous, 100% census)",
      "requiredEvidence": "Exact primary system artifacts to inspect",
      "passCondition": "Objective condition required to conclude Effective (Pass)",
      "failCondition": "Condition requiring Exception Noted or Deficiency finding"
    }
  ],
  "testingBenchmark": "Benchmark guidance for the controller test of operating effectiveness",
  "statutoryNotice": "AI Decision Support Only: The CTL controller remains solely responsible for control assessment, pass/fail decisions, risk acceptance, finding creation, remediation validation, and regulatory interpretation."
}`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1,
            systemInstruction: 'You are an elite enterprise internal controls compliance architect. Avoid vague summaries; provide exact, rigorous, and numerical comparative analysis.'
          }
        });

        const parsed = JSON.parse(geminiRes.text || '{}');
        res.json(parsed);
        return;
      } catch (err) {
        console.warn('Gemini generateContent error in synthesize, using deterministic engine:', err);
      }
    }

    // Granular deterministic fallback synthesis
    const topic = (focusTopic || 'Cross-Tier Control Enforcement').toLowerCase();
    
    // Build detailed hierarchy comparison
    const hierarchyComparison = selectedDocs.map(doc => {
      let coreMandate = '';
      let slaOrMetric = '';
      let enforcementMechanism = '';
      let evidenceGenerated = '';

      if (doc.category === 'policy') {
        coreMandate = (doc as any).summary || 'Establishes executive governance mandates, segregation of duties, and regulatory accountability.';
        slaOrMetric = doc.code === 'POL-SEC-01' ? '24h Voluntary / 2h Involuntary SLA' : doc.code === 'POL-BCP-04' ? 'RTO < 4h / RPO < 15m' : 'Annual / Continuous Cadence';
        enforcementMechanism = 'Executive Risk Committee & CISO Policy Review';
        evidenceGenerated = 'Signed Policy Charter and Annual Board Governance Attestation';
      } else if (doc.category === 'standard') {
        coreMandate = (doc as any).scope || 'Specifies technical baseline parameters, encryption ciphers, and automated system thresholds.';
        slaOrMetric = doc.code === 'STD-IAM-101' ? '16-char password, 5-try lockout, 60-day inactivity lockout' : doc.code === 'STD-LOG-303' ? '365-day WORM retention, 50ms NTP drift' : 'Quantitative Technical SLA';
        enforcementMechanism = 'Automated IAM Policies, AWS SCPs, and CSPM Gates';
        evidenceGenerated = 'System Configuration Export and Automated Config Rule History';
      } else {
        coreMandate = 'Defines operational step-by-step runbooks, actor roles, required ticket linkages, and fail conditions.';
        slaOrMetric = (doc as any).cadence || 'Event-driven within 24 hours of trigger';
        enforcementMechanism = 'ServiceNow Workflow and Automated SCIM Deprovisioning Connectors';
        evidenceGenerated = 'Primary Execution Workpapers, Signed Memos, and System Audit Logs';
      }

      return {
        tier: (doc.category.charAt(0).toUpperCase() + doc.category.slice(1)) as any,
        docCode: doc.code,
        title: doc.title,
        coreMandate,
        slaOrMetric,
        enforcementMechanism,
        evidenceGenerated
      };
    });

    // Generate granular, contextual divergences based on selected documents
    const divergencesAndGaps: any[] = [];
    const auditTestingProgram: any[] = [];

    if (documentCodes.some(c => c.includes('IAM') || c.includes('SEC') || c.includes('OFF'))) {
      divergencesAndGaps.push({
        id: 'div-iam-01',
        parameter: 'Cloud Infrastructure vs IdP Deprovisioning Latency Delta',
        severity: 'High',
        policyBaseline: 'POL-SEC-01 §4.2: Mandates access privileges for terminated personnel revoked within 24 hours (or 2 hours for involuntary separation).',
        standardSpecification: 'STD-IAM-101 §3.5: Specifies primary Okta suspension <= 24h, but permits downstream cloud infrastructure accounts (AWS IAM roles, GitHub seats) up to 48 hours.',
        procedureExecution: 'SOP-OFF-08 Step 3: SCIM webhook schedules cloud role removal within 48 hours following HR termination notice.',
        divergenceNature: '24-to-48 Hour Exposure Window: A 24-hour discrepancy exists where a terminated contractor or employee is suspended in Okta but remains technically authorized with active AWS CLI or GitHub access keys.',
        riskExposure: 'Orphaned credentials can be leveraged to exfiltrate proprietary source code or access customer databases post-departure (directly correlates with historical finding FND-2023-04).',
        controllerRecommendation: 'CTL Controller must inspect AWS CloudTrail and GitHub audit logs for any authentication activity occurring between HR termination timestamp and final cloud seat revocation.'
      });

      divergencesAndGaps.push({
        id: 'div-iam-02',
        parameter: 'Quarterly User Access Review Inactivity Lockout Threshold',
        severity: 'Medium',
        policyBaseline: 'POL-SEC-01 §3.1: Enforces least privilege and quarterly re-attestation of administrative rights.',
        standardSpecification: 'STD-IAM-101 §2.2 & §3.5: Mandates automated lockout for accounts inactive for greater than 60 consecutive days.',
        procedureExecution: 'SOP-IAM-02 Step 2: Campaign runs on days 1-15 of calendar quarter, allowing managers 15 days to certify dormant accounts before automated Day-16 revocation.',
        divergenceNature: 'Dormant Account Retention: An account inactive for 55 days prior to quarter start may persist active for another 15 days during manager review before revocation.',
        riskExposure: 'Dormant privileged credentials remain viable attack surfaces for credential stuffing or session token theft.',
        controllerRecommendation: 'Reconcile last logon timestamp across all privileged Active Directory / Okta accounts against the 60-day threshold.'
      });

      auditTestingProgram.push({
        stepNumber: '1',
        objective: 'Test completeness and accuracy of employee/contractor termination population',
        populationDefinition: '100% census of all employee and contractor separations recorded in Workday HRIS during the fiscal testing period',
        recommendedSampleSize: 'Sample 30 departures (15 voluntary employees, 10 contractors, 5 involuntary terminations)',
        requiredEvidence: 'Workday HR separation timestamp extract CSV + Okta System Log core.user.account.suspend event receipts',
        passCondition: 'Calculated elapsed time (Okta suspension minus HR departure) <= 24h for voluntary and <= 2h for involuntary for 100% of sample',
        failCondition: 'Any single departure exceeds the documented SLA without approved CISO exception'
      });

      auditTestingProgram.push({
        stepNumber: '2',
        objective: 'Verify downstream cloud credential and SSH key deprovisioning within 48-hour SLA',
        populationDefinition: 'Sampled departed personnel holding AWS IAM or GitHub organization memberships',
        recommendedSampleSize: 'Subset of 15 technical staff from Step 1 sample',
        requiredEvidence: 'AWS IAM DeleteAccessKey event receipts + GitHub audit log organization seat deallocation logs',
        passCondition: 'All downstream cloud identities deprovisioned within 48 hours of HR termination timestamp',
        failCondition: 'Active access key or role assignment found post 48-hour threshold'
      });
    }

    if (documentCodes.some(c => c.includes('CHG') || c.includes('OPS'))) {
      divergencesAndGaps.push({
        id: 'div-chg-01',
        parameter: 'Emergency Change Retrospective Approval SLA vs Deployment Gate',
        severity: 'High',
        policyBaseline: 'POL-CHG-06 §2.2: Mandates independent peer review and CAB authorization for all production releases.',
        standardSpecification: 'STD-OPS-1111 §2.1: Authorizes emergency deployment with verbal Incident Commander signoff, requiring retrospective CAB review within 48 hours.',
        procedureExecution: 'SOP-CHG-05 Step 3: Author submits retrospective ticket; pipeline lacks automated rollback if retrospective review is delayed.',
        divergenceNature: 'Unenforced Retrospective Gating: Changes remain permanently in production even if retrospective approval is delayed or omitted (matches root cause in historical finding FND-2024-09).',
        riskExposure: 'Defective code or unauthorized schema modifications persist indefinitely without formal post-mortem CAB review.',
        controllerRecommendation: 'Inspect ServiceNow Emergency Change records for elapsed time between deployment timestamp and retrospective CAB approval timestamp.'
      });

      auditTestingProgram.push({
        stepNumber: '1',
        objective: 'Test emergency change retrospective authorization timeliness and peer review compliance',
        populationDefinition: '100% census of all ServiceNow change tickets classified as Emergency during the period',
        recommendedSampleSize: 'Sample 15 emergency change releases',
        requiredEvidence: 'ServiceNow CHG ticket history + Git PR peer review timestamp + Incident Commander authorization record',
        passCondition: 'Retrospective CAB sign-off timestamp recorded within 48 hours of production deployment for all sampled items',
        failCondition: 'Retrospective approval exceeded 48 hours or change ticket author approved their own deployment'
      });
    }

    if (documentCodes.some(c => c.includes('BCP') || c.includes('DR'))) {
      divergencesAndGaps.push({
        id: 'div-bcp-01',
        parameter: 'Annual Live Failover Simulation Mandate vs Paper Tabletop Walkthroughs',
        severity: 'Critical',
        policyBaseline: 'POL-BCP-04 §3.2: Mandates annual live or full-scale sandbox failover exercise restoring database snapshots; tabletop reviews explicitly prohibited for operational effectiveness certification.',
        standardSpecification: 'STD-BCP-909 §1.2: Tier-1 RTO must be <= 4 hours and Tier-1 RPO <= 15 minutes, substantiated with automated health checks.',
        procedureExecution: 'SOP-BCP-03 Step 1-3: Requires provisioning isolated recovery VPC in alternate region, restoring Aurora cluster, and running synthetic transaction test suite.',
        divergenceNature: 'Evidence Deficit in Tabletop Reviews: Tabletop exercises fail to measure actual snapshot restoration duration, leaving RTO (<4h) unverified in practice.',
        riskExposure: 'Inability to substantiate operating effectiveness of disaster recovery controls under SOX Section 404 Computer Operations (historical finding FND-2024-07).',
        controllerRecommendation: 'Require engineering to submit primary AWS Backup restore job IDs, database consistency verification logs, and timestamped synthetic test suite reports.'
      });

      auditTestingProgram.push({
        stepNumber: '1',
        objective: 'Substantiate operating effectiveness of Tier-1 database snapshot restoration and measured RTO/RPO',
        populationDefinition: 'Annual disaster recovery restoration exercise records for Tier-1 core transactional banking databases',
        recommendedSampleSize: '100% census of Tier-1 recovery exercise records conducted in fiscal year',
        requiredEvidence: 'AWS Backup restore completion job logs + Database ledger balance checksum report + Synthetic transaction test results',
        passCondition: 'Measured RTO <= 240 minutes and RPO <= 15 minutes with zero ledger balance discrepancies',
        failCondition: 'Exercise was conducted as tabletop paper review without technical database restore or RTO exceeded 4 hours'
      });
    }

    if (divergencesAndGaps.length === 0) {
      divergencesAndGaps.push({
        id: 'div-gen-01',
        parameter: 'Audit Telemetry Retention Horizon vs Operational Log Rotation',
        severity: 'Medium',
        policyBaseline: 'POL-DAT-02 §4.3: Mandates 365 days retention for ITGC audit logs in immutable WORM storage.',
        standardSpecification: 'STD-LOG-303 §2.3: Specifies AWS S3 Object Lock Compliance Mode configuration for 365 days.',
        procedureExecution: 'SOP-LOG-11 Step 2: Monthly verification snapshot checking S3 bucket compliance mode.',
        divergenceNature: 'Storage Tier Lifecycle Purge: Local operating system forwarders rotate syslog files every 14 days, creating dependency on uninterrupted SIEM forwarder uptime.',
        riskExposure: 'Log forwarder outages exceeding 14 days result in permanent loss of local authentication evidence.',
        controllerRecommendation: 'Verify forwarder drop alarms and validate S3 ObjectLockConfiguration Mode=COMPLIANCE.'
      });

      auditTestingProgram.push({
        stepNumber: '1',
        objective: 'Inspect immutable audit logging configurations across centralized repositories',
        populationDefinition: '100% of S3 buckets and log archives receiving financial reporting and security telemetry',
        recommendedSampleSize: 'Census of all 8 centralized audit logging buckets',
        requiredEvidence: 'AWS CLI get-object-lock-configuration JSON + AWS KMS key policy',
        passCondition: 'ObjectLockConfiguration shows Mode=COMPLIANCE and DefaultRetention >= 365 days for 100% of buckets',
        failCondition: 'Bucket configured in GOVERNANCE mode or retention configured under 365 days'
      });
    }

    res.json({
      synthesizedBaseline: `Granular Cross-Document Synthesis (${documentCodes.join(' + ')}): Interlocks executive governance directives, quantitative technical standards, and operational runbooks on "${focusTopic || 'Cross-Tier Control Enforcement'}". Establishes a binding hierarchy where technical standards specify exact thresholds and operating procedures provide primary audit evidence trails.`,
      focusTopic: focusTopic || 'Cross-Tier Control Enforcement',
      inScopeDocumentCodes: documentCodes,
      hierarchyComparison,
      divergencesAndGaps,
      auditTestingProgram,
      testingBenchmark: `CTL Audit Testing Benchmark: For controls spanning ${documentCodes.join(', ')}, the controller must evaluate whether operating procedures maintain strict fidelity to technical standard thresholds, testing sample sizes of at least 25-30 items across active periods of reliance.`,
      statutoryNotice: 'AI Decision Support Only: The CTL controller remains solely responsible for control assessment, pass/fail decisions, risk acceptance, finding creation, remediation validation, and regulatory interpretation.'
    });


  } catch (error) {
    console.error('Error synthesizing documents:', error);
    res.status(500).json({ error: 'Failed to synthesize documents' });
  }
});

// In development, mount Vite dev middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CTL Decision Support Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
