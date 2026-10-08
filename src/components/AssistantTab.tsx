import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  RotateCcw,
  ExternalLink,
  Filter,
  CheckCircle2,
  Scale,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { askAssistant } from '../services/aiService';
import {
  AssistantQueryResponse,
  SourceCitation,
  DocumentCategory
} from '../types/ctl';

interface AssistantTabProps {
  onSelectCitation: (citation: SourceCitation) => void;
  onOpenWorkpaperForControl?: (controlCode: string) => void;
}

const PRESET_QUERIES = [
  {
    category: 'Access Management',
    label: 'Termination SLA across Policy & Standard',
    query: 'What are the exact user revocation SLAs for voluntary vs involuntary departures across POL-SEC-01 and STD-IAM-101?'
  },
  {
    category: 'Historical Audits',
    label: 'Findings for Privileged Access (CTL-AC-01)',
    query: 'What historical audit findings and root causes occurred on privileged access recertifications (CTL-AC-01)?'
  },
  {
    category: 'Operational Resilience',
    label: 'Disaster Recovery RTO & Testing Mandates',
    query: 'Summarize the RTO, RPO, and annual live failover database restore testing requirements under POL-BCP-04 and SOP-BCP-03.'
  },
  {
    category: 'Change Management',
    label: 'Emergency Change CAB Pass/Fail Rules',
    query: 'What are the controller fail conditions and retrospective CAB documentation SLAs for emergency changes under SOP-CHG-05?'
  },
  {
    category: 'Remediation',
    label: 'Delayed Contractor Offboarding Fix',
    query: 'What corrective remediation strategy was implemented for delayed contractor offboarding (FND-2023-04 / REM-2023-04-A)?'
  },
  {
    category: 'Data Protection',
    label: 'SIEM Log Storage & Tamper-Proofing',
    query: 'What are the technical specifications and risks for immutable log storage under STD-LOG-303 and POL-DAT-02?'
  },
  {
    category: 'Vulnerability SLAs',
    label: 'Critical & High Patch Deadlines',
    query: 'What are the remediation SLAs and CISA KEV escalation criteria under POL-VUL-07 and STD-VUL-404?'
  },
  {
    category: 'Vendor Governance',
    label: 'SOC 2 Bridge Letter Requirements',
    query: 'What are the rules for vendor SOC 2 gap coverage and 90-day bridge letter limits under POL-VRM-03 and STD-VRM-1212?'
  },
  {
    category: 'Database Access',
    label: 'Break-Glass Production Query Rules',
    query: 'What are the technical safeguards and 4-hour session limits for database break-glass access under STD-DAT-1010 and SOP-DB-20?'
  }
];

export const AssistantTab: React.FC<AssistantTabProps> = ({
  onSelectCitation
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AssistantQueryResponse | null>(null);

  const handleSearch = async (queryText?: string) => {
    const textToSearch = queryText || query;
    if (!textToSearch.trim()) return;

    setIsLoading(true);
    try {
      const response = await askAssistant(textToSearch, categoryFilter);
      setResult(response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (presetQuery: string) => {
    setQuery(presetQuery);
    handleSearch(presetQuery);
  };

  return (
    <div className="space-y-6">
      {/* Search Header Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-xs dark:shadow-md space-y-4 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              Source-Grounded Regulatory & Control Query Engine
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Search policies, understand standards, verify procedures, and inspect historical findings with grounded citations.
            </p>
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-700/60 px-2.5 py-1 rounded-md self-start sm:self-auto">
            Strict Decision Support Mode
          </div>
        </div>

        {/* Input Command Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a compliance question or enter a code (e.g., 'What is the deprovisioning SLA in STD-IAM-101?', 'CTL-AC-01')..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-lg pl-10 pr-16 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white text-xs px-1.5 py-0.5 rounded transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-2 transition-all shrink-0 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-600 cursor-pointer shadow-sm"
          >
            {isLoading ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isLoading ? 'Querying...' : 'Search Engine'}</span>
          </button>
        </form>

        {/* Category Scope Filter */}
        <div className="flex items-center gap-1.5 text-xs flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Scope Filter:
          </span>
          {[
            { id: 'all', label: 'All Documents' },
            { id: 'policy', label: 'Policies' },
            { id: 'standard', label: 'Standards' },
            { id: 'procedure', label: 'Procedures' },
            { id: 'control', label: 'Controls & Risks' },
            { id: 'historical_finding', label: 'Historical Findings' },
            { id: 'remediation', label: 'Remediations' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as any)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border border-slate-900 dark:border-slate-600 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Suggested Queries */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-2">
            Common Compliance & Control Inquiries:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {PRESET_QUERIES.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(p.query)}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 text-left transition-all group cursor-pointer flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium block mb-0.5">
                    {p.category}
                  </span>
                  <span className="text-xs text-slate-900 dark:text-white font-semibold leading-tight line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    {p.label}
                  </span>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">
                  <span className="truncate max-w-[200px]">{p.query.slice(0, 36)}...</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Query Result Card */}
      {result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-6 shadow-xs dark:shadow-md space-y-6 text-xs animate-in fade-in duration-200 transition-colors duration-200">
          {/* Executive Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-900 dark:text-white font-semibold">Source-Grounded Answer</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span>Confidence: <strong className="font-mono text-slate-900 dark:text-white">{result.confidenceScore}%</strong></span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span>Citations: {result.citations.length}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 mt-1.5 leading-relaxed font-normal">
                {result.summary}
              </p>
            </div>

            <div className="shrink-0 text-slate-700 dark:text-slate-200 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-md">
              Decision Support Only
            </div>
          </div>

          {/* Controller Advisory Box */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-1.5">
            <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-slate-600 dark:text-emerald-400" />
              <span>Controller Testing Guidance:</span>
            </div>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-xs">
              {result.controllerAdvisory}
            </p>
          </div>

          {/* Grounded Citations Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                <BookOpen className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                Verified Citations ({result.citations.length})
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Click citation to view full text in context
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.citations.map((citation) => (
                <div
                  key={citation.id}
                  onClick={() => onSelectCitation(citation)}
                  className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-all flex flex-col justify-between space-y-2.5 group shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="font-mono font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                        {citation.docId} § {citation.section}
                      </span>
                      <span className="text-[10px] text-slate-700 dark:text-slate-300 uppercase font-mono font-semibold bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {citation.docCategory}
                      </span>
                    </div>
                    <div className="text-xs text-slate-800 dark:text-slate-200 font-semibold mb-1.5">
                      {citation.docTitle}
                    </div>
                    <blockquote className="text-[11px] text-slate-700 dark:text-slate-300 pl-2.5 border-l-2 border-slate-300 dark:border-slate-600 line-clamp-3 leading-relaxed italic">
                      "{citation.quote}"
                    </blockquote>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[200px]">{citation.sectionTitle}</span>
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 font-medium shrink-0">
                      View Source <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Answer Body */}
          <div className="p-5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-800 dark:text-slate-200 space-y-3">
            <div
              dangerouslySetInnerHTML={{
                __html: result.answer
                  .replace(/### (.*?)\n/g, '<h3 class="text-sm font-semibold text-slate-900 dark:text-white mt-3 mb-1.5 pb-1 border-b border-slate-200 dark:border-slate-800">$1</h3>')
                  .replace(/#### (.*?)\n/g, '<h4 class="text-xs font-semibold text-slate-900 dark:text-white mt-2.5 mb-1">$1</h4>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-950 dark:text-white">$1</strong>')
                  .replace(/> (.*?)\n/g, '<blockquote class="border-l-2 border-slate-400 dark:border-slate-500 pl-3 py-1 my-1.5 text-slate-800 dark:text-slate-200 text-[11px] bg-slate-100 dark:bg-slate-900 rounded-r">$1</blockquote>')
                  .replace(/- (.*?)\n/g, '<li class="ml-4 list-disc text-slate-800 dark:text-slate-200 text-[11px] mb-1">$1</li>')
                  .replace(/\n\n/g, '<br/>')
              }}
            />
          </div>

          {/* Historical Precedents Box */}
          {result.relatedHistoricalIssues && result.relatedHistoricalIssues.length > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3">
              <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Related Historical Audit Precedents:
              </div>

              <div className="space-y-2">
                {result.relatedHistoricalIssues.map((finding) => (
                  <div
                    key={finding.id}
                    className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        {finding.code} · {finding.auditYear} {finding.auditScope}
                      </span>
                      <span className="text-[10px] text-slate-700 dark:text-slate-200 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {finding.deficiencyClassification}
                      </span>
                    </div>
                    <div className="text-slate-900 dark:text-slate-100 font-semibold">{finding.title}</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Root Cause: {finding.rootCause}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Remediations Box */}
          {result.relatedRemediations && result.relatedRemediations.length > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3">
              <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Historical Remediation Precedents:
              </div>

              <div className="space-y-2">
                {result.relatedRemediations.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        {rem.code} (Control: {rem.relatedControlCode})
                      </span>
                      <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-700">
                        Retest: {rem.retestResult}
                      </span>
                    </div>
                    <div className="text-slate-900 dark:text-slate-100 font-semibold">{rem.actionTitle}</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Strategy: {rem.remediationStrategy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
