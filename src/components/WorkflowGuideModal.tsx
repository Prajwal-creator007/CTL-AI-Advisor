import React from 'react';
import {
  X,
  Scale,
  ArrowRight,
  Lock,
  Search,
  Layers,
  History,
  BookOpen
} from 'lucide-react';

interface WorkflowGuideModalProps {
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const WorkflowGuideModal: React.FC<WorkflowGuideModalProps> = ({
  onClose,
  onNavigateTab
}) => {
  const steps = [
    {
      num: '01',
      title: 'Policy, Standard & Control Search',
      role: 'Source-Grounded Retrieval',
      desc: 'Query governance mandates across policies (e.g. POL-SEC-01, POL-DAT-02), technical standards (STD-IAM-101, STD-LOG-303), operating procedures, and control risk profiles. The AI returns direct, verifiable citations with verbatim quotes and section anchors.',
      tab: 'assistant',
      tabLabel: 'Open AI Query & Citations',
      icon: Search
    },
    {
      num: '02',
      title: 'Multi-Document Requirement Synthesis',
      role: 'Cross-Document Gap Analysis',
      desc: 'Select multiple documents across hierarchy tiers (Policy vs Standard vs Operating SOP). The synthesizer compares directives, highlights conflicting SLAs or timeline divergences, and identifies compliance benchmarks for controller reliance.',
      tab: 'synthesizer',
      tabLabel: 'Open Requirement Synthesizer',
      icon: Layers
    },
    {
      num: '03',
      title: 'Historical Audit Finding & Remediation Research',
      role: 'Root Cause & Repeat Risk Analysis',
      desc: 'Search past internal audit, SOX 404, and SOC 2 examination findings (2022–2025). Review documented root causes, corrective remediation strategies (e.g. automated SCIM webhooks, EventBridge sync), and retest track records.',
      tab: 'historical',
      tabLabel: 'Open Historical Findings',
      icon: History
    },
    {
      num: '04',
      title: 'Complete Policy & Control Library Inspection',
      role: 'Direct Reading & Verification',
      desc: 'Browse the entire library of 4 executive policies, 4 technical standards, 4 standard operating procedures, and 6 control definitions with inherent risk ratings and testing criteria.',
      tab: 'corpus',
      tabLabel: 'Open Policy & Control Library',
      icon: BookOpen
    }
  ];

  const inventory = [
    {
      category: 'Policies (Executive Directives)',
      items: [
        'POL-SEC-01: Information Security Governance (Least privilege, 24h/2h revocation SLAs, independent testing)',
        'POL-DAT-02: Data Protection & Cryptographic Security (AES-256, 365-day immutable WORM logging)',
        'POL-BCP-04: Business Continuity & Disaster Recovery (RTO < 4h, RPO < 15m, annual live restore)',
        'POL-VRM-03: Third-Party & Vendor Risk Management (Annual SOC 2 Type II, 90-day bridge letters)'
      ]
    },
    {
      category: 'Standards (Technical Specifications)',
      items: [
        'STD-IAM-101: Identity & Access Management (FIDO2 MFA, 60-day inactivity lockout, quarterly UAR)',
        'STD-CRY-202: Cryptographic Architecture & Key Management (Banned primitives, annual KMS rotation)',
        'STD-LOG-303: Security Telemetry & SIEM Ingestion (NTP drift < 50ms, centralized Splunk pipeline)',
        'STD-VUL-404: Vulnerability Management SLAs (Critical 7 days, High 30 days, Medium 60 days)'
      ]
    },
    {
      category: 'Procedures (Operational Protocols)',
      items: [
        'SOP-IAM-02: Quarterly User Access Review (15-day campaign, Day 16 auto-revocation, 25-item sampling)',
        'SOP-CHG-05: Emergency & Standard Change Management (CAB approvals, 48h retrospective ECR signoff)',
        'SOP-INC-12: Security Incident Escalation & Regulatory Disclosure (72h GDPR, 4-day SEC Form 8-K)',
        'SOP-BCP-03: Annual Disaster Recovery Failover Testing (Snapshot restoration execution runbook)'
      ]
    },
    {
      category: 'Controls & Inherent Risks Matrix',
      items: [
        'CTL-AC-01: Privileged Access Recertification (Risk: RSK-IAM-01 Privilege Accumulation)',
        'CTL-SEC-08: Timely Deprovisioning of Separated Staff (Risk: RSK-IAM-04 Orphaned Account Exploitation)',
        'CTL-CM-04: Production Deployment Segregation of Duties (Risk: RSK-CHG-02 Malicious Code Injection)',
        'CTL-DR-02: Tier-1 DR Database Snapshot Restoration (Risk: RSK-BCP-01 Catastrophic Regional Outage)',
        'CTL-VR-03: Critical Vendor Annual SOC 2 Review (Risk: RSK-VRM-03 Supply Chain Breach)',
        'CTL-LOG-05: Centralized SIEM Immutable Logging (Risk: RSK-LOG-02 Audit Log Tampering/Destruction)'
      ]
    },
    {
      category: 'Historical Audit Findings (2022–2025)',
      items: [
        'FND-2024-01: AWS Cloud IAM Roles Excluded from SailPoint Campaign (Significant Deficiency)',
        'FND-2023-04: Contractor Offboarding Exceeded 24h SLA by 39h (Deficiency)',
        'FND-2024-09: Emergency Changes Deployed Without 48h Retro-CAB Approval (Significant Deficiency)',
        'FND-2024-07: DR Tabletop Drill Conducted Without DB Restore (Significant Deficiency)',
        'FND-2023-11: Vendor SOC 2 Bridge Letter Missing for 4-Month Year-End Gap (Deficiency)',
        'FND-2022-03: Logging S3 Bucket Lacked Compliance Mode Object Lock (Deficiency)'
      ]
    },
    {
      category: 'Remediation Action Plans & Retest Records',
      items: [
        'REM-2024-01-B: Automated AWS EventBridge Role Ingestion (Retest: Sustained / Effective)',
        'REM-2023-04-A: Workday Contingent Worker SCIM Webhook (Retest: Sustained / Effective)',
        'REM-2024-09-C: ServiceNow Hard Gating & Retro-CAB Alerts (Retest: Partially Effective)',
        'REM-2024-07-D: Dedicated Monthly Automated Aurora Restore VPC (Retest: Sustained / Effective)',
        'REM-2023-11-D: OneTrust Automated Gap Calculator & Bridge Letter Requisition (Retest: Sustained / Effective)',
        'REM-2022-03-A: Terraform Module Hard-Coded Object Lock Compliance Mode (Retest: Sustained / Effective)'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <Scale className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">AegisCTL Workflow & Governance Scope</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Decision support engine and controller governance mandate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Statutory Division of Responsibility */}
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/80 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2">
              <span className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Division of Responsibility: AI Decision Support vs. Human CTL Controller
              </span>
              <span className="text-[11px] text-slate-500 font-mono">SOX 404 & PCAOB AS 2201 Guidance</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 dark:text-slate-300">
              <div className="space-y-1.5">
                <div className="font-semibold text-slate-900 dark:text-slate-300 text-[11px]">AI Assistant Scope (Decision Support Only):</div>
                <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-600 dark:text-slate-400 leading-relaxed">
                  <li>Source-grounded indexing of policies, standards, and procedures.</li>
                  <li>Citation verification with exact section quotes and document codes.</li>
                  <li>Cross-document SLA comparison and strictness gap detection.</li>
                  <li>Correlating search topics with historical audit findings and root causes.</li>
                </ul>
              </div>
              <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 md:pl-4 pt-2 md:pt-0">
                <div className="font-semibold text-slate-900 dark:text-slate-200 text-[11px]">CTL Controller Exclusive Responsibility:</div>
                <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li><strong>Control Assessment:</strong> Designing testing procedures and sample populations.</li>
                  <li><strong>Pass/Fail Decisions:</strong> Determining control operating effectiveness.</li>
                  <li><strong>Finding Creation:</strong> Formally establishing deficiencies and severity ratings.</li>
                  <li><strong>Risk Acceptance:</strong> Approving business justifications and compensating controls.</li>
                  <li><strong>Regulatory Interpretation:</strong> Applying statutory SEC, SOX, and SOC 2 rules.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Streamlined Assistant Workflow
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {steps.map(step => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-lg flex flex-col justify-between space-y-2.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">{step.num}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{step.role}</span>
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                        <StepIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        <span>{step.title}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed pt-0.5">{step.desc}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateTab(step.tab);
                        }}
                        className="text-[11px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
                      >
                        <span>{step.tabLabel}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Corpus Inventory */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Knowledge Corpus Inventory
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inventory.map((inv, idx) => (
                <div key={idx} className="bg-slate-50/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-3.5 rounded-lg space-y-1.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-200 text-xs">{inv.category}</div>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                    {inv.items.map((it, iIdx) => (
                      <li key={iIdx} className="leading-relaxed">
                        • {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>AegisCTL Decision Support Engine</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md text-xs transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
