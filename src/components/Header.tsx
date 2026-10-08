import React from 'react';
import { Shield, HelpCircle, Search, Layers, History, BookOpen, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenWorkflowGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenWorkflowGuide
}) => {
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'assistant', label: 'AI Query & Citations', icon: Search },
    { id: 'synthesizer', label: 'Multi-Document Synthesizer', icon: Layers },
    { id: 'historical', label: 'Historical Findings & Precedents', icon: History },
    { id: 'corpus', label: 'Policy & Control Library', icon: BookOpen },
  ];

  return (
    <header className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Masthead */}
        <div className="flex items-center justify-between h-14 border-b border-slate-100 dark:border-slate-900/80">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700/70 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-white">AegisCTL</span>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Control Testing & Lifecycle Assistant</span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                Decision Support
              </span>
            </div>
          </div>

          {/* Right Action & Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs">
            <div className="hidden lg:flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
            </div>

            {/* Theme Toggle Segmented Control */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => {
                  if (isDark) toggleTheme();
                }}
                aria-label="Switch to light mode"
                title="Light mode"
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  !isDark
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">Light</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isDark) toggleTheme();
                }}
                aria-label="Switch to dark mode"
                title="Dark mode"
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 text-white shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-sky-300' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 text-xs font-medium scrollbar-none" aria-label="Tabs">
          {navItems.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer text-xs ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white font-medium shadow-xs border border-slate-900 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
