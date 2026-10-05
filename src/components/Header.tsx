import React from 'react';
import { PlusCircle, Printer, FileText, Sparkles, Building2, PackageCheck } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: string) => void;
  activeCompanyCount: number;
  totalAddresses: number;
  onOpenQuickCreate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  activeCompanyCount,
  totalAddresses,
  onOpenQuickCreate,
}) => {
  return (
    <header id="app-header" className="no-print bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm ring-1 ring-white/20">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wider uppercase text-white font-mono">
                COURIER ADDRESS MANAGER
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                PRO A4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Multi-Company Label Generator • Zero-Typing Dispatch
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-300 mr-2 border-r border-slate-800 pr-4">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>
                <strong className="text-white font-semibold">{activeCompanyCount}</strong> Companies
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                <strong className="text-white font-semibold">{totalAddresses}</strong> Saved Addresses
              </span>
            </div>
          </div>

          <button
            onClick={onOpenQuickCreate}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="font-bold">+ Create New Courier Address</span>
          </button>
        </div>
      </div>
    </header>
  );
};
