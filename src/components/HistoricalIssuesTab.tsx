import React, { useState } from 'react';
import {
  History,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { HISTORICAL_FINDINGS, REMEDIATIONS } from '../data/ctlCorpus';
import { HistoricalFinding } from '../types/ctl';

export const HistoricalIssuesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFinding, setSelectedFinding] = useState<HistoricalFinding | null>(HISTORICAL_FINDINGS[0]);

  const filteredFindings = HISTORICAL_FINDINGS.filter(f => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.relatedControlCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.rootCause.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || f.deficiencyClassification === severityFilter;
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const activeRemediation = selectedFinding
    ? REMEDIATIONS.find(r => r.relatedFindingCode === selectedFinding.code)
    : null;

  return (
    <div className="space-y-6">
      {/* Header Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-xs dark:shadow-md space-y-4 transition-colors duration-200">
        <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            Historical Audit Findings & Remediation Precedent Repository ({HISTORICAL_FINDINGS.length} Precedents)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            Search historical findings from past internal audits, SOX 404 reviews, and SOC 2 examinations. Analyze root causes and review remediation track records to identify repeat control failure risks.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search findings by code, title, or root cause..."
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

          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 cursor-pointer"
            >
              <option value="all">All Classifications</option>
              <option value="Deficiency">Control Deficiency</option>
              <option value="Significant Deficiency">Significant Deficiency</option>
              <option value="Material Weakness">Material Weakness</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 cursor-pointer"
            >
              <option value="all">All Remediation Statuses</option>
              <option value="Remediated & Closed">Remediated & Closed</option>
              <option value="Pending Retest">Pending Retest</option>
              <option value="Under Active Remediation">Under Active Remediation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Two Column Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Findings List */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-200 px-1 font-semibold">
            <span>Historical Findings ({filteredFindings.length})</span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-normal">Audit Scope</span>
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredFindings.map(finding => {
              const isSelected = selectedFinding?.id === finding.id;
              return (
                <div
                  key={finding.id}
                  onClick={() => setSelectedFinding(finding)}
                  className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800 border-emerald-500 dark:border-emerald-400 shadow-xs ring-1 ring-emerald-500/40 dark:ring-emerald-400/30'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-900 dark:text-white font-semibold">
                      {finding.code} · {finding.relatedControlCode}
                    </span>
                    <span className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded border ${
                      finding.deficiencyClassification === 'Significant Deficiency'
                        ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-700'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}>
                      {finding.deficiencyClassification}
                    </span>
                  </div>

                  <div className="text-slate-900 dark:text-slate-100 font-semibold line-clamp-2">
                    {finding.title}
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{finding.auditScope}</span>
                    <span className="font-mono font-medium">{finding.auditYear}</span>
                  </div>
                </div>
              );
            })}

            {filteredFindings.length === 0 && (
              <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 text-xs">
                No historical findings matched the filter criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right: Detail View */}
        <div className="lg:col-span-7">
          {selectedFinding ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-6 shadow-xs dark:shadow-md space-y-5 text-xs animate-in fade-in duration-150 transition-colors duration-200">
              {/* Finding Title & Metadata */}
              <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{selectedFinding.code}</span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="font-mono text-xs text-emerald-700 dark:text-emerald-300 font-semibold">{selectedFinding.relatedControlCode}</span>
                  </div>
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-700">
                    {selectedFinding.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedFinding.title}</h3>
                <div className="text-[11px] text-slate-600 dark:text-slate-300">
                  Classification: <strong className="text-slate-900 dark:text-slate-100">{selectedFinding.deficiencyClassification}</strong> · Scope: {selectedFinding.auditScope} ({selectedFinding.auditYear})
                </div>
              </div>

              {/* Observation & Root Cause */}
              <div className="space-y-3">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="text-[11px] text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Audit Observation:</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-xs">
                    {selectedFinding.auditObservation}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="text-[11px] text-slate-900 dark:text-white font-semibold">Root Cause Analysis:</div>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-xs">
                    {selectedFinding.rootCause}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="text-[11px] text-slate-900 dark:text-white font-semibold">Business & Financial Impact:</div>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-xs">
                    {selectedFinding.businessImpact}
                  </p>
                </div>
              </div>

              {/* Linked Remediation Plan */}
              {activeRemediation && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Remediation Plan: {activeRemediation.code}
                    </span>
                    <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-700">
                      Retest: {activeRemediation.retestResult}
                    </span>
                  </div>

                  <div className="text-slate-900 dark:text-white font-semibold text-xs">
                    {activeRemediation.actionTitle}
                  </div>

                  <p className="text-slate-700 dark:text-slate-200 text-xs leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">Strategy:</strong> {activeRemediation.remediationStrategy}
                  </p>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <div>Owner: <span className="text-slate-800 dark:text-slate-200">{activeRemediation.leadOwner}</span> · Completed: {activeRemediation.implementationDate}</div>
                    <div>Verification Evidence: <span className="text-slate-800 dark:text-slate-200 font-mono">{activeRemediation.verificationEvidence}</span></div>
                    <div className="text-slate-800 dark:text-slate-200 font-medium">Lessons Learned: {activeRemediation.lessonsLearned}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center text-slate-500 dark:text-slate-400 text-xs">
              Select a historical finding on the left to inspect root causes and remediation records.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
