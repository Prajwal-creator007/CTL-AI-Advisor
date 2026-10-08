import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { AssistantTab } from './components/AssistantTab';
import { MultiDocSynthesizerTab } from './components/MultiDocSynthesizerTab';
import { HistoricalIssuesTab } from './components/HistoricalIssuesTab';
import { CorpusExplorerTab } from './components/CorpusExplorerTab';
import { SourceDrawer } from './components/SourceDrawer';
import { WorkflowGuideModal } from './components/WorkflowGuideModal';
import { SourceCitation } from './types/ctl';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('assistant');
  const [activeCitation, setActiveCitation] = useState<SourceCitation | null>(null);
  const [isWorkflowGuideOpen, setIsWorkflowGuideOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors duration-200">
      {/* Navigation Header with Light/Dark Mode Toggle */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWorkflowGuide={() => setIsWorkflowGuideOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'assistant' && (
          <AssistantTab
            onSelectCitation={(citation) => setActiveCitation(citation)}
          />
        )}

        {activeTab === 'synthesizer' && (
          <MultiDocSynthesizerTab />
        )}

        {activeTab === 'historical' && (
          <HistoricalIssuesTab />
        )}

        {activeTab === 'corpus' && (
          <CorpusExplorerTab
            onSelectCitation={(citation) => setActiveCitation(citation)}
          />
        )}
      </main>

      {/* Quiet, Professional Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-4 text-xs text-slate-500 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-slate-700 dark:text-slate-400 font-medium">AegisCTL</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>AI Decision Support System</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-600 dark:text-slate-400">CTL Controller Accountability Mandate</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            SOX 404 · SOC 2 Type II · ISO 27001:2022 · NIST CSF 2.0
          </div>
        </div>
      </footer>

      {/* Source Citation Drawer */}
      <SourceDrawer
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />

      {/* Workflow & Scope Modal */}
      {isWorkflowGuideOpen && (
        <WorkflowGuideModal
          onClose={() => setIsWorkflowGuideOpen(false)}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setIsWorkflowGuideOpen(false);
          }}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
