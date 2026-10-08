import React from 'react';
import { X, Check, Copy, BookOpen } from 'lucide-react';
import { SourceCitation } from '../types/ctl';
import { POLICIES, STANDARDS, PROCEDURES, CONTROLS } from '../data/ctlCorpus';

interface SourceDrawerProps {
  citation: SourceCitation | null;
  onClose: () => void;
}

export const SourceDrawer: React.FC<SourceDrawerProps> = ({ citation, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!citation) return null;

  const policy = POLICIES.find(p => p.code === citation.docId);
  const standard = STANDARDS.find(s => s.code === citation.docId);
  const procedure = PROCEDURES.find(pr => pr.code === citation.docId);
  const control = CONTROLS.find(c => c.code === citation.docId);

  const copyQuote = () => {
    navigator.clipboard.writeText(`[${citation.docId} §${citation.section}] "${citation.quote}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto shadow-2xl flex flex-col text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-sm text-slate-900 dark:text-white">{citation.docId}</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-medium bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  {citation.docCategory}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">v{citation.version}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{citation.docTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cited Snippet Highlight Card */}
        <div className="p-4 bg-slate-50/60 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5">
              <span>Section Anchor:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono">§ {citation.section} ({citation.sectionTitle})</span>
            </span>
            <button
              onClick={copyQuote}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy Quote'}</span>
            </button>
          </div>
          <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed shadow-2xs">
            "{citation.quote}"
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Grounding Confidence: <strong className="font-mono text-emerald-700 dark:text-emerald-400">{citation.confidence}%</strong></span>
            {citation.effectiveDate && <span>Effective Date: <strong className="text-slate-700 dark:text-slate-300">{citation.effectiveDate}</strong></span>}
          </div>
        </div>

        {/* Full Document View */}
        <div className="p-5 space-y-5 flex-1 text-xs">
          {policy && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <div>Owner: <span className="text-slate-900 dark:text-slate-200 font-medium">{policy.owner}</span></div>
                <div>Frameworks: <span className="text-slate-700 dark:text-slate-300">{policy.regulatoryFrameworks.join(', ')}</span></div>
                <div>Summary: <span className="text-slate-600 dark:text-slate-400">{policy.summary}</span></div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Full Document Sections:</h4>
                {policy.sections.map(sec => {
                  const isCited = sec.sectionNumber === citation.section;
                  return (
                    <div
                      key={sec.sectionNumber}
                      className={`p-3.5 rounded-lg border text-xs leading-relaxed space-y-1.5 transition-all ${
                        isCited
                          ? 'bg-emerald-50/50 dark:bg-slate-900 border-emerald-400 dark:border-emerald-500/80 ring-1 ring-emerald-400/40 dark:ring-emerald-500/40'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                        <span>§ {sec.sectionNumber} — {sec.title}</span>
                        {isCited && (
                          <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-100/80 dark:bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
                            Cited in Response
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{sec.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {standard && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <div>Owner: <span className="text-slate-900 dark:text-slate-200 font-medium">{standard.owner}</span></div>
                <div>Governing Policy: <span className="text-slate-700 dark:text-slate-300">{standard.governingPolicyCode}</span></div>
                <div>Scope: <span className="text-slate-600 dark:text-slate-400">{standard.scope}</span></div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200">Technical Specifications:</h4>
                {standard.sections.map(sec => {
                  const isCited = sec.sectionNumber === citation.section;
                  return (
                    <div
                      key={sec.sectionNumber}
                      className={`p-3.5 rounded-lg border text-xs leading-relaxed space-y-1.5 transition-all ${
                        isCited
                          ? 'bg-emerald-50/50 dark:bg-slate-950 border-emerald-300 dark:border-slate-600 ring-1 ring-emerald-300/40 dark:ring-slate-600/50'
                          : 'bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium text-slate-900 dark:text-slate-200">
                        <span>§ {sec.sectionNumber} — {sec.title}</span>
                        {isCited && (
                          <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium bg-emerald-100/70 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-slate-800">
                            Cited in Response
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{sec.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {procedure && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <div>Role: <span className="text-slate-900 dark:text-slate-200 font-medium">{procedure.ownerRole}</span></div>
                <div>Cadence: <span className="text-slate-700 dark:text-slate-300">{procedure.cadence}</span></div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200">Procedural Steps:</h4>
                {procedure.steps.map(step => {
                  const isCited = citation.section.includes(step.stepNumber);
                  return (
                    <div
                      key={step.stepNumber}
                      className={`p-3.5 rounded-lg border text-xs leading-relaxed space-y-1.5 transition-all ${
                        isCited
                          ? 'bg-emerald-50/50 dark:bg-slate-950 border-emerald-300 dark:border-slate-600 ring-1 ring-emerald-300/40 dark:ring-slate-600/50'
                          : 'bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium text-slate-900 dark:text-slate-200">
                        <span>Step {step.stepNumber}: {step.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">SLA: {step.slaTimeline}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {control && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <div>Control: <span className="text-slate-900 dark:text-slate-200 font-medium">{control.name}</span></div>
                <div>Risk: <span className="text-slate-700 dark:text-slate-300">{control.associatedRisk.title}</span></div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200">Testing Criteria:</h4>
                {control.testingCriteria.map((crit, cIdx) => (
                  <div key={cIdx} className="p-3 rounded-lg bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
                    {cIdx + 1}. {crit}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
