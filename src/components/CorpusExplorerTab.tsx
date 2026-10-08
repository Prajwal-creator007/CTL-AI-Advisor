import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink
} from 'lucide-react';
import { POLICIES, STANDARDS, PROCEDURES, CONTROLS } from '../data/ctlCorpus';
import { SourceCitation } from '../types/ctl';

interface CorpusExplorerTabProps {
  onSelectCitation: (citation: SourceCitation) => void;
}

export const CorpusExplorerTab: React.FC<CorpusExplorerTabProps> = ({ onSelectCitation }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'policies' | 'standards' | 'procedures' | 'controls'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocCode, setSelectedDocCode] = useState<string>('POL-SEC-01');

  const term = searchTerm.toLowerCase();

  const filteredPolicies = POLICIES.filter(p =>
    p.title.toLowerCase().includes(term) ||
    p.code.toLowerCase().includes(term) ||
    p.summary.toLowerCase().includes(term) ||
    p.sections.some(s => s.content.toLowerCase().includes(term) || s.title.toLowerCase().includes(term))
  );

  const filteredStandards = STANDARDS.filter(s =>
    s.title.toLowerCase().includes(term) ||
    s.code.toLowerCase().includes(term) ||
    s.scope.toLowerCase().includes(term) ||
    s.sections.some(sec => sec.content.toLowerCase().includes(term) || sec.title.toLowerCase().includes(term))
  );

  const filteredProcedures = PROCEDURES.filter(pr =>
    pr.title.toLowerCase().includes(term) ||
    pr.code.toLowerCase().includes(term) ||
    pr.cadence.toLowerCase().includes(term) ||
    pr.steps.some(st => st.description.toLowerCase().includes(term) || st.name.toLowerCase().includes(term))
  );

  const filteredControls = CONTROLS.filter(c =>
    c.name.toLowerCase().includes(term) ||
    c.code.toLowerCase().includes(term) ||
    c.associatedRisk.title.toLowerCase().includes(term) ||
    c.associatedRisk.description.toLowerCase().includes(term)
  );

  const selectedPolicy = POLICIES.find(p => p.code === selectedDocCode);
  const selectedStandard = STANDARDS.find(s => s.code === selectedDocCode);
  const selectedProcedure = PROCEDURES.find(pr => pr.code === selectedDocCode);
  const selectedControl = CONTROLS.find(c => c.code === selectedDocCode);

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-xs dark:shadow-md space-y-4 transition-colors duration-200">
        <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            CTL Authoritative Governance Corpus Explorer
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            Browse official policy directives ({POLICIES.length}), technical standards ({STANDARDS.length}), standard operating procedures ({PROCEDURES.length}), and control matrices ({CONTROLS.length}) governing enterprise financial reporting & cybersecurity.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search across all policies, standards, procedures, controls, and risks..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-md pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white text-xs px-1"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto text-xs shrink-0">
            {[
              { id: 'all', label: 'All Documents' },
              { id: 'policies', label: `Policies (${POLICIES.length})` },
              { id: 'standards', label: `Standards (${STANDARDS.length})` },
              { id: 'procedures', label: `Procedures (${PROCEDURES.length})` },
              { id: 'controls', label: `Controls (${CONTROLS.length})` },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 border border-slate-900 dark:border-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Index */}
        <div className="lg:col-span-5 space-y-4 max-h-[750px] overflow-y-auto pr-1">
          {/* Policies Group */}
          {(activeCategory === 'all' || activeCategory === 'policies') && filteredPolicies.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block px-1">
                Policies ({filteredPolicies.length})
              </span>
              {filteredPolicies.map(p => (
                <div
                  key={p.code}
                  onClick={() => setSelectedDocCode(p.code)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedDocCode === p.code
                      ? 'bg-slate-100 dark:bg-slate-800 border-emerald-500 dark:border-emerald-400 shadow-xs ring-1 ring-emerald-500/30'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{p.code}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">v{p.version}</span>
                  </div>
                  <div className="text-slate-900 dark:text-slate-100 font-semibold">{p.title}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">{p.summary}</p>
                </div>
              ))}
            </div>
          )}

          {/* Standards Group */}
          {(activeCategory === 'all' || activeCategory === 'standards') && filteredStandards.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block px-1">
                Technical Standards ({filteredStandards.length})
              </span>
              {filteredStandards.map(s => (
                <div
                  key={s.code}
                  onClick={() => setSelectedDocCode(s.code)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedDocCode === s.code
                      ? 'bg-slate-100 dark:bg-slate-800 border-emerald-500 dark:border-emerald-400 shadow-xs ring-1 ring-emerald-500/30'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{s.code}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">v{s.version}</span>
                  </div>
                  <div className="text-slate-900 dark:text-slate-100 font-semibold">{s.title}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">Scope: {s.scope}</p>
                </div>
              ))}
            </div>
          )}

          {/* Procedures Group */}
          {(activeCategory === 'all' || activeCategory === 'procedures') && filteredProcedures.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block px-1">
                Procedures ({filteredProcedures.length})
              </span>
              {filteredProcedures.map(pr => (
                <div
                  key={pr.code}
                  onClick={() => setSelectedDocCode(pr.code)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedDocCode === pr.code
                      ? 'bg-slate-100 dark:bg-slate-800 border-emerald-500 dark:border-emerald-400 shadow-xs ring-1 ring-emerald-500/30'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{pr.code}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">v{pr.version}</span>
                  </div>
                  <div className="text-slate-900 dark:text-slate-100 font-semibold">{pr.title}</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">Cadence: {pr.cadence}</div>
                </div>
              ))}
            </div>
          )}

          {/* Controls Group */}
          {(activeCategory === 'all' || activeCategory === 'controls') && filteredControls.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block px-1">
                Controls & Risks ({filteredControls.length})
              </span>
              {filteredControls.map(c => (
                <div
                  key={c.code}
                  onClick={() => setSelectedDocCode(c.code)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedDocCode === c.code
                      ? 'bg-slate-100 dark:bg-slate-800 border-emerald-500 dark:border-emerald-400 shadow-xs ring-1 ring-emerald-500/30'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{c.code}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{c.frequency}</span>
                  </div>
                  <div className="text-slate-900 dark:text-slate-100 font-semibold">{c.name}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                    Risk: {c.associatedRisk.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Reader */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-6 shadow-xs dark:shadow-md space-y-5 text-xs max-h-[750px] overflow-y-auto animate-in fade-in duration-150 transition-colors duration-200">
            {selectedPolicy && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-base text-slate-900 dark:text-white">{selectedPolicy.code}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">v{selectedPolicy.version} · {selectedPolicy.effectiveDate}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedPolicy.title}</h3>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                    <div><span className="text-slate-500 dark:text-slate-400 font-medium">Policy Owner:</span> <span className="text-slate-900 dark:text-slate-100 font-semibold">{selectedPolicy.owner}</span></div>
                    <div><span className="text-slate-500 dark:text-slate-400 font-medium">Frameworks:</span> <span className="text-slate-800 dark:text-slate-200">{selectedPolicy.regulatoryFrameworks.join(', ')}</span></div>
                    <div><span className="text-slate-500 dark:text-slate-400 font-medium">Executive Summary:</span> <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedPolicy.summary}</span></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Policy Sections & Mandates:</h4>
                  {selectedPolicy.sections.map(sec => (
                    <div key={sec.sectionNumber} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          § {sec.sectionNumber} — {sec.title}
                        </span>
                        <button
                          onClick={() => onSelectCitation({
                            id: `cit-${selectedPolicy.code}-${sec.sectionNumber}`,
                            docId: selectedPolicy.code,
                            docTitle: selectedPolicy.title,
                            docCategory: 'policy',
                            version: selectedPolicy.version,
                            section: sec.sectionNumber,
                            sectionTitle: sec.title,
                            quote: sec.content,
                            confidence: 100
                          })}
                          className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 flex items-center gap-1 transition-colors cursor-pointer font-medium"
                        >
                          View Citation <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{sec.content}</p>
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-[11px] text-slate-900 dark:text-white font-semibold">Controller Focus:</span>
                        <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-slate-700 dark:text-slate-300 text-[11px]">
                          {sec.controllerFocusPoints.map((pt, pIdx) => (
                            <li key={pIdx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedStandard && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-base text-slate-900 dark:text-white">{selectedStandard.code}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">v{selectedStandard.version} · {selectedStandard.effectiveDate}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedStandard.title}</h3>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <div><span className="text-slate-500 dark:text-slate-400 font-medium">Standard Owner:</span> <span className="text-slate-900 dark:text-slate-100 font-semibold">{selectedStandard.owner}</span></div>
                    <div><span className="text-slate-500 dark:text-slate-400 font-medium">Governing Policy:</span> <span className="text-slate-800 dark:text-slate-200">{selectedStandard.governingPolicyCode}</span></div>
                    <div><span className="text-slate-500 dark:text-slate-400 font-medium">Scope:</span> <span className="text-slate-700 dark:text-slate-300">{selectedStandard.scope}</span></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Technical Specifications:</h4>
                  {selectedStandard.sections.map(sec => (
                    <div key={sec.sectionNumber} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                      <div className="font-bold text-slate-900 dark:text-white text-xs">
                        § {sec.sectionNumber} — {sec.title}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{sec.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedProcedure && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-base text-slate-900 dark:text-white">{selectedProcedure.code}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">v{selectedProcedure.version} · Cadence: {selectedProcedure.cadence}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedProcedure.title}</h3>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Operating Steps:</h4>
                  {selectedProcedure.steps.map(step => (
                    <div key={step.stepNumber} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          Step {step.stepNumber}: {step.name}
                        </span>
                        <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-mono bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-700">
                          SLA: {step.slaTimeline}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedControl && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-base text-slate-900 dark:text-white">{selectedControl.code}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">{selectedControl.frequency} · {selectedControl.nature}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedControl.name}</h3>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Testing Criteria:</h4>
                  <div className="space-y-1.5">
                    {selectedControl.testingCriteria.map((crit, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2">
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{idx + 1}.</span>
                        <span>{crit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
