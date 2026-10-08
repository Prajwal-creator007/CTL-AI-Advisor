import React, { useState } from 'react';
import {
  Layers,
  RotateCcw,
  CheckCircle2,
  Scale,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  ShieldAlert,
  Info
} from 'lucide-react';
import { POLICIES, STANDARDS, PROCEDURES } from '../data/ctlCorpus';
import { synthesizeDocuments } from '../services/aiService';
import { SynthesisResult } from '../types/ctl';

const PRESET_SYNTHESIS_PACKS = [
  {
    name: 'Identity Lifecycle & Offboarding',
    docCodes: ['POL-SEC-01', 'STD-IAM-101', 'SOP-OFF-08'],
    topic: 'Timely Staff Deprovisioning & Cloud Account Revocation SLAs',
    description: 'Compare 24h/2h revocation SLAs across Policy, Standard, and automated SCIM runbooks'
  },
  {
    name: 'Disaster Recovery & Database RTO',
    docCodes: ['POL-BCP-04', 'STD-BCP-909', 'SOP-BCP-03'],
    topic: 'Tier-1 RTO (<4h), RPO (<15m), and Live Snapshot Restore Mandates',
    description: 'Contrast architectural high-availability with annual snapshot restoration runbook'
  },
  {
    name: 'Emergency Change CAB Governance',
    docCodes: ['POL-CHG-06', 'STD-OPS-1111', 'SOP-CHG-05'],
    topic: 'Segregation of Duties & 48h Retrospective CAB Sign-Off',
    description: 'Evaluate peer-review requirements vs 48-hour retrospective approval windows'
  },
  {
    name: 'Security Telemetry & Immutable WORM Logging',
    docCodes: ['POL-DAT-02', 'STD-LOG-303', 'SOP-LOG-11'],
    topic: '365-Day WORM Compliance Mode & 50ms NTP Clock Drift',
    description: 'Benchmark immutable storage directives against weekly synchronization runbooks'
  },
  {
    name: 'Vulnerability Remediation SLAs',
    docCodes: ['POL-VUL-07', 'STD-VUL-404', 'SOP-VUL-04'],
    topic: 'Critical (7-Day) vs High (30-Day) CVSS Patch SLAs',
    description: 'Compare CISA KEV escalation criteria against monthly scanning workflows'
  },
  {
    name: 'Vendor Assurance & SOC 2 Gap Coverage',
    docCodes: ['POL-VRM-03', 'STD-VRM-1212', 'SOP-VRM-18'],
    topic: 'Critical Vendor Tiering & 90-Day Bridge Letter Limits',
    description: 'Analyze Complementary User Entity Controls (CUECs) and fiscal year-end gaps'
  }
];

export const MultiDocSynthesizerTab: React.FC = () => {
  const [selectedDocs, setSelectedDocs] = useState<string[]>(['POL-SEC-01', 'STD-IAM-101', 'SOP-OFF-08']);
  const [focusTopic, setFocusTopic] = useState<string>('Timely Staff Deprovisioning & Cloud Account Revocation SLAs');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [synthesisResult, setSynthesisResult] = useState<SynthesisResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const toggleDoc = (code: string) => {
    if (selectedDocs.includes(code)) {
      if (selectedDocs.length > 2) {
        setSelectedDocs(selectedDocs.filter(c => c !== code));
      }
    } else {
      setSelectedDocs([...selectedDocs, code]);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_SYNTHESIS_PACKS[0]) => {
    setSelectedDocs(preset.docCodes);
    setFocusTopic(preset.topic);
    handleSynthesize(preset.docCodes, preset.topic);
  };

  const handleSynthesize = async (docs = selectedDocs, topic = focusTopic) => {
    if (docs.length < 2) return;
    setIsLoading(true);
    try {
      const res = await synthesizeDocuments(docs, topic);
      setSynthesisResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!synthesisResult) return;
    const text = `AEGIS CTL MULTI-DOCUMENT SYNTHESIS MEMORANDUM
Topic: ${synthesisResult.focusTopic}
In-Scope Documents: ${synthesisResult.inScopeDocumentCodes.join(', ')}

EXECUTIVE BASELINE:
${synthesisResult.synthesizedBaseline}

IDENTIFIED DIVERGENCES & GAPS:
${synthesisResult.divergencesAndGaps.map(d => `[${d.severity}] ${d.parameter}\n- Nature: ${d.divergenceNature}\n- Risk: ${d.riskExposure}\n- Controller Action: ${d.controllerRecommendation}`).join('\n\n')}

AUDIT TESTING PROGRAM:
${synthesisResult.auditTestingProgram.map(s => `Step ${s.stepNumber}: ${s.objective}\n- Population: ${s.populationDefinition}\n- Sample Size: ${s.recommendedSampleSize}\n- Pass Condition: ${s.passCondition}\n- Fail Condition: ${s.failCondition}`).join('\n\n')}

${synthesisResult.statutoryNotice}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-xs dark:shadow-md space-y-5 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              Cross-Document Requirement Synthesizer & Gap Analysis
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Side-by-side comparative analysis of Policies, Standards, and SOPs. Detects exact numerical SLA divergence, conflicting definitions, and unmitigated exposure windows.
            </p>
          </div>
          <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-700/60 px-2.5 py-1 rounded-md self-start sm:self-auto">
            Granular Tier Synthesis Active
          </div>
        </div>

        {/* Pre-Configured Synthesis Packages */}
        <div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-2.5">
            Pre-Configured Cross-Tier Benchmark Packages:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESET_SYNTHESIS_PACKS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(p)}
                className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800/90 text-left transition-all text-xs cursor-pointer flex flex-col justify-between group shadow-2xs"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="truncate max-w-[200px]">{p.docCodes.join(' · ')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Document Selection Matrix */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Select In-Scope Governance Documents</span>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded">
                {selectedDocs.length} selected
              </span>
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={focusTopic}
                onChange={(e) => setFocusTopic(e.target.value)}
                placeholder="Specific Topic (e.g. Timely Deprovisioning)..."
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 w-72 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            {/* Policies Column */}
            <div className="bg-slate-50/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 p-3.5 rounded-lg space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span className="font-semibold text-slate-900 dark:text-white text-xs">
                  Policies ({POLICIES.length})
                </span>
                <span className="text-[10px] uppercase font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 px-1.5 py-0.2 rounded">
                  Tier 1 Directives
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {POLICIES.map(p => (
                  <label key={p.code} className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs py-0.5">
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(p.code)}
                      onChange={() => toggleDoc(p.code)}
                      className="rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-mono text-xs text-slate-900 dark:text-slate-100 font-medium">[{p.code}]</span>
                    <span className="truncate text-[11px] text-slate-600 dark:text-slate-300">{p.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Standards Column */}
            <div className="bg-slate-50/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 p-3.5 rounded-lg space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span className="font-semibold text-slate-900 dark:text-white text-xs">
                  Standards ({STANDARDS.length})
                </span>
                <span className="text-[10px] uppercase font-mono text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 px-1.5 py-0.2 rounded">
                  Tier 2 Tech Specs
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {STANDARDS.map(s => (
                  <label key={s.code} className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs py-0.5">
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(s.code)}
                      onChange={() => toggleDoc(s.code)}
                      className="rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-mono text-xs text-slate-900 dark:text-slate-100 font-medium">[{s.code}]</span>
                    <span className="truncate text-[11px] text-slate-600 dark:text-slate-300">{s.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Procedures Column */}
            <div className="bg-slate-50/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 p-3.5 rounded-lg space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span className="font-semibold text-slate-900 dark:text-white text-xs">
                  Procedures ({PROCEDURES.length})
                </span>
                <span className="text-[10px] uppercase font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded">
                  Tier 3 Runbooks
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {PROCEDURES.map(pr => (
                  <label key={pr.code} className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs py-0.5">
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(pr.code)}
                      onChange={() => toggleDoc(pr.code)}
                      className="rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-mono text-xs text-slate-900 dark:text-slate-100 font-medium">[{pr.code}]</span>
                    <span className="truncate text-[11px] text-slate-600 dark:text-slate-300">{pr.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleSynthesize()}
              disabled={isLoading || selectedDocs.length < 2}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-2 transition-all disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-600 cursor-pointer shadow-sm"
            >
              {isLoading ? (
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{isLoading ? 'Synthesizing Requirements...' : 'Run Detailed Cross-Tier Synthesis'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Synthesis Output Workspace */}
      {synthesisResult && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Executive Synthesis Summary Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-xs dark:shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Synthesized Regulatory & Operational Baseline
                  </h3>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Topic: <strong className="text-slate-900 dark:text-slate-100">{synthesisResult.focusTopic}</strong>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySummary}
                  className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Memorandum' : 'Copy Memorandum'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-normal bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              {synthesisResult.synthesizedBaseline}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
              <span className="font-medium text-slate-800 dark:text-slate-200">Scope Verified Across:</span>
              {synthesisResult.inScopeDocumentCodes.map(code => (
                <span key={code} className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {code}
                </span>
              ))}
            </div>
          </div>

          {/* Section 1: Granular Multi-Tier Comparison Matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-xs dark:shadow-md space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Cross-Tier Governance Architecture Matrix
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Mandates, numerical SLAs, automated gates, and evidence
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {synthesisResult.hierarchyComparison.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {item.docCode}
                      </span>
                      <span className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded border ${
                        item.tier === 'Policy'
                          ? 'bg-purple-50 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-700/70 border-purple-200'
                          : item.tier === 'Standard'
                          ? 'bg-sky-50 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-700/70 border-sky-200'
                          : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/70 border-emerald-200'
                      }`}>
                        {item.tier}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                      {item.title}
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-800 dark:text-slate-200 block text-[10px] uppercase font-mono tracking-wider mb-0.5">
                        Core Directive:
                      </strong>
                      {item.coreMandate}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 space-y-2 text-[11px]">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block">
                        Numerical SLA / Cadence:
                      </span>
                      <span className="font-mono font-medium text-emerald-800 dark:text-emerald-300">
                        {item.slaOrMetric}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block">
                        Enforcement Mechanism:
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {item.enforcementMechanism}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block">
                        Evidence Generated:
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 italic">
                        {item.evidenceGenerated}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Strictness Divergences & Gap Analysis Matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-xs dark:shadow-md space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Strictness Gaps, Latency Windows & SLA Divergences ({synthesisResult.divergencesAndGaps.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Actionable findings for controller audit workpapers
              </span>
            </div>

            <div className="space-y-3.5">
              {synthesisResult.divergencesAndGaps.map((div, dIdx) => (
                <div
                  key={dIdx}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        div.severity === 'Critical'
                          ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-700'
                          : div.severity === 'High'
                          ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-700'
                          : 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950/80 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700'
                      }`}>
                        {div.severity} Severity
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        {div.parameter}
                      </span>
                    </div>
                  </div>

                  {/* 3-Tier Layer Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-purple-700 dark:text-purple-300 font-bold block mb-1">
                        Policy Directive:
                      </span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                        {div.policyBaseline}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-sky-700 dark:text-sky-300 font-bold block mb-1">
                        Technical Standard Spec:
                      </span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                        {div.standardSpecification}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-emerald-700 dark:text-emerald-300 font-bold block mb-1">
                        Operating Runbook Step:
                      </span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                        {div.procedureExecution}
                      </p>
                    </div>
                  </div>

                  {/* Impact & Action */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 rounded bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-1">
                      <span className="text-[10px] font-semibold uppercase text-amber-800 dark:text-amber-300 block font-mono">
                        Divergence Nature & Risk Exposure:
                      </span>
                      <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed">
                        <strong>{div.divergenceNature}</strong> {div.riskExposure}
                      </p>
                    </div>
                    <div className="p-3 rounded bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                      <span className="text-[10px] font-semibold uppercase text-emerald-800 dark:text-emerald-300 block font-mono">
                        CTL Controller Workpaper Recommendation:
                      </span>
                      <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed">
                        {div.controllerRecommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: CTL Controller Audit Testing Program */}
          {synthesisResult.auditTestingProgram && synthesisResult.auditTestingProgram.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-xs dark:shadow-md space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Actionable Controller Audit Testing Program
                  </h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Ready-to-execute testing steps
                </span>
              </div>

              <div className="space-y-3.5">
                {synthesisResult.auditTestingProgram.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-mono text-[11px] font-bold flex items-center justify-center">
                          {step.stepNumber}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {step.objective}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        Sample: {step.recommendedSampleSize}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                          Target Population Definition:
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                          {step.populationDefinition}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                          Required Primary Evidence Artifacts:
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 mt-0.5 font-mono">
                          {step.requiredEvidence}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                      <div className="p-2 rounded bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50">
                        <strong className="text-emerald-800 dark:text-emerald-300 block mb-0.5">
                          Pass Condition:
                        </strong>
                        <span className="text-slate-700 dark:text-slate-300">
                          {step.passCondition}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/50">
                        <strong className="text-rose-800 dark:text-rose-300 block mb-0.5">
                          Fail Condition (Deficiency Flag):
                        </strong>
                        <span className="text-slate-700 dark:text-slate-300">
                          {step.failCondition}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statutory Benchmark Banner */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <p className="text-slate-700 dark:text-slate-300">
                {synthesisResult.testingBenchmark}
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0 hidden sm:block">
              PCAOB AS 2201 / SOX 404
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
